import type { Express } from "express";
import {
    CommentCreateSchema,
    EventEnvelopeSchema,
    PostCreateSchema,
    PostReactSchema,
    PollCreateSchema,
    PollVoteSchema,
    makeEventEnvelope,
    publishEvent,
} from "@clube/shared";
import { prisma } from "../../db.js";

declare const process: any;

function getUsername(req: any): string | null {
    const v = req.header("x-username");
    if (!v) return null;
    return String(v);
}

function eventTargets(): string[] {
    const raw = process.env.EVENT_TARGETS || "";
    return raw
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
}

async function assertAdmin(username: string): Promise<boolean> {
    const u = await prisma.user.findUnique({ where: { id: username }, select: { isAdmin: true } });
    return !!u?.isAdmin;
}

// Helper to enrich posts with User and ClubBook data (Manual Aggregation for Monolith)
async function enrichPosts(posts: any[]) {
    if (posts.length === 0) return posts;

    // 1. Collect IDs
    const userIds = new Set<string>();
    const clubBookIds = new Set<string>();

    for (const p of posts) {
        if (p.userId) userIds.add(p.userId);
        if (p.clubBookId) clubBookIds.add(p.clubBookId);
        if (Array.isArray(p.comments)) {
            for (const c of p.comments) {
                if (c.userId) userIds.add(c.userId);
            }
        }
    }

    // 2. Fetch Data
    const [users, clubBooks] = await Promise.all([
        userIds.size > 0 ? prisma.user.findMany({ where: { id: { in: Array.from(userIds) } } }) : [],
        clubBookIds.size > 0 ? prisma.clubBook.findMany({ where: { id: { in: Array.from(clubBookIds) } } }) : [],
    ]);

    // 3. Map Data
    const userMap = new Map(users.map((u) => [u.id, u]));
    const clubBookMap = new Map(clubBooks.map((b) => [b.id, b]));

    // 4. Attach
    return posts.map((p) => ({
        ...p,
        user: userMap.get(p.userId) || { id: p.userId, name: p.userId },
        clubBook: p.clubBookId ? clubBookMap.get(p.clubBookId) || null : null,
        comments: Array.isArray(p.comments)
            ? p.comments.map((c: any) => ({
                ...c,
                user: userMap.get(c.userId) || { id: c.userId, name: c.userId },
            }))
            : [],
    }));
}

async function enrichPoll(poll: any, viewerId: string | null) {
    if (!poll) return poll;

    // If publicVotes is enabled and viewer is checking, we might want to show voters?
    // Gateway logic:
    // "If publicVotes is enabled and the viewer already voted, feed returns voter ids per option."
    // "Attach basic user profiles to keep UI simple."

    const options = Array.isArray(poll.options) ? poll.options : [];

    // Collect voter IDs from options (if any)
    const voterIds = new Set<string>();
    // In the monolith, we can just fetch them if we need them.
    // The logic in gateway relied on what the feed service returned.
    // In feed service (monolith migrated), we return `voters` (userIds) if public.

    // Let's re-implement the poll fetching logic to be "rich" by default.
    // Actually, we should check `poll.publicVotes` and `userHasVoted`.

    // But first, let's just make sure we attach user profiles for any voters present in the object.
    for (const o of options) {
        if (Array.isArray(o.voters)) {
            for (const v of o.voters) voterIds.add(String(v));
        }
    }

    if (voterIds.size === 0) return poll;

    const users = await prisma.user.findMany({ where: { id: { in: Array.from(voterIds) } } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return {
        ...poll,
        options: options.map((o: any) => ({
            ...o,
            voters: Array.isArray(o.voters)
                ? o.voters.map((id: string) => userMap.get(id) || { id, name: id })
                : o.voters,
        })),
    };
}


export function registerRoutes(app: Express) {
    // Express 4 async handler wrapper
    const ah = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);
    for (const m of ["get", "post", "put", "delete", "patch"] as const) {
        const orig = (app as any)[m].bind(app);
        (app as any)[m] = (...args: any[]) => {
            if (args.length === 1) return orig(args[0]);
            const [path, ...handlers] = args;
            const wrapped = handlers.map((h) => (typeof h === "function" ? ah(h) : h));
            return orig(path, ...wrapped);
        };
    }

    app.get("/feed", async (_req, res) => {
        const req = _req as any;
        const viewerId = getUsername(req);
        const clubBookId = String(req.query?.clubBookId || "").trim();
        const posts = await prisma.post.findMany({
            where: {
                ...(clubBookId ? { clubBookId } : {}),
                ...(req.query?.userId ? { userId: String(req.query.userId) } : {}),
            },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                comments: { orderBy: { createdAt: "desc" }, take: 2 },
                _count: { select: { likes: true, comments: true } },
            },
        });

        // Manual fetch of images
        const postIds = posts.map((p) => p.id);
        const imagesByPostId: Record<string, string[]> = {};

        if (postIds.length > 0) {
            try {
                const postIdsString = postIds.map(id => `'${id}'`).join(",");
                const rawImages = await prisma.$queryRawUnsafe(`SELECT * FROM PostImage WHERE postId IN (${postIdsString}) ORDER BY "index" ASC`) as any[];
                for (const img of rawImages) {
                    (imagesByPostId[img.postId] ||= []).push(img.url);
                }
            } catch (e) {
                console.error("Failed to fetch images via raw SQL", e);
            }
        }

        const reactionsRows =
            postIds.length === 0
                ? []
                : await prisma.like.groupBy({
                    by: ["postId", "type"],
                    where: { postId: { in: postIds } },
                    _count: { _all: true },
                });
        const reactionsByPostId: Record<string, Record<string, number>> = {};
        for (const r of reactionsRows as any[]) {
            const pid = String(r.postId);
            const type = String(r.type);
            const n = Number(r._count?._all || 0);
            (reactionsByPostId[pid] ||= {})[type] = n;
        }

        const viewerRows =
            viewerId && postIds.length
                ? await prisma.like.findMany({
                    where: { postId: { in: postIds }, userId: viewerId },
                    select: { postId: true, type: true },
                })
                : [];
        const viewerReactionByPostId = Object.fromEntries(
            viewerRows.map((r) => [String(r.postId), { type: String((r as any).type || "like") }])
        );

        const rawPosts = posts.map((p) => ({
            ...p,
            images: imagesByPostId[p.id] || [],
            reactions: reactionsByPostId[p.id] || {},
            viewerReaction: viewerReactionByPostId[p.id] || null,
        }));

        // Enrich with User and ClubBook data
        const enrichedPosts = await enrichPosts(rawPosts);

        res.json({ posts: enrichedPosts });
    });

    app.get("/posts/:id", async (req, res) => {
        const id = String(req.params.id);
        const viewerId = getUsername(req);
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                likes: true, // actually reactions (one per user)
                comments: { orderBy: { createdAt: "asc" } },
                _count: { select: { likes: true, comments: true } },
            },
        });
        if (!post) return res.status(404).json({ error: "post not found" });

        // Manual fetch images
        let postImages: string[] = [];
        try {
            const rawImages = await prisma.$queryRawUnsafe(`SELECT * FROM PostImage WHERE postId = '${id}' ORDER BY "index" ASC`) as any[];
            postImages = rawImages.map(img => img.url);
        } catch (e) {
            console.error("Failed to fetch single post images", e);
        }

        const reactionsRows = await prisma.like.groupBy({
            by: ["type"],
            where: { postId: id },
            _count: { _all: true },
        });
        const reactions: Record<string, number> = {};
        for (const r of reactionsRows as any[]) {
            reactions[String(r.type)] = Number(r._count?._all || 0);
        }

        const viewerReaction =
            viewerId
                ? await prisma.like
                    .findUnique({ where: { postId_userId: { postId: id, userId: viewerId } }, select: { type: true } })
                    .then((r) => (r ? { type: String((r as any).type || "like") } : null))
                : null;

        const rawPost = {
            ...post,
            images: postImages,
            reactions,
            viewerReaction,
        };

        const enriched = (await enrichPosts([rawPost]))[0];
        res.json({ post: enriched });
    });

    app.post("/posts", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const input = PostCreateSchema.parse(req.body);

        // If clubBookId is missing, try to infer from active club book (like gateway did)
        let clubBookId = input.clubBookId ? String(input.clubBookId) : null;
        if (!clubBookId) {
            // Logic to find active club book for user's city/etc.
            // For now, let's keep it simple: if not provided, check "FORTALEZA" default?
            // The gateway did: GET active. Let's do a direct DB call.
            const now = new Date();
            const active = await prisma.clubBook.findFirst({
                where: { city: "FORTALEZA", month: now.getMonth() + 1, year: now.getFullYear() },
                orderBy: { createdAt: "desc" }
            });
            if (active) clubBookId = active.id;
        }

        const post = await prisma.post.create({
            data: {
                userId: username,
                text: String(input.text || ""),
                imageUrl: input.imageUrl ? String(input.imageUrl) : null,
                clubBookId: clubBookId,
            },
        });

        // Manual insert images
        if (input.images && input.images.length > 0) {
            try {
                for (let i = 0; i < input.images.length; i++) {
                    const url = input.images[i];
                    const id = Math.random().toString(36).substring(2, 15);
                    await prisma.$executeRawUnsafe(`INSERT INTO PostImage (id, postId, url, "index") VALUES ('${id}', '${post.id}', '${url}', ${i})`);
                }
            } catch (e) {
                console.error("Failed to insert images", e);
            }
        }
        const env = makeEventEnvelope({ source: "feed", type: "post.created", data: { id: post.id } });
        await publishEvent(env, eventTargets());

        // Enrich response
        const enriched = (await enrichPosts([{ ...post, images: input.images || [], comments: [] }]))[0];
        res.status(201).json({ post: enriched });
    });

    app.post("/posts/:id/like", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const postId = String(req.params.id);

        const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId: username } } });
        let active = true;
        if (existing && String((existing as any).type || "like") === "like") {
            await prisma.like.delete({ where: { postId_userId: { postId, userId: username } } });
            active = false;
        } else if (existing) {
            await prisma.like.update({ where: { postId_userId: { postId, userId: username } }, data: { type: "like" } });
            active = true;
        } else {
            await prisma.like.create({ data: { postId, userId: username, type: "like" } }).catch(() => null);
            active = true;
        }

        const env = makeEventEnvelope({
            source: "feed",
            type: active ? "post.liked" : "post.unliked",
            data: { postId, userId: username },
        });
        await publishEvent(env, eventTargets());
        res.json({ ok: true, active, type: active ? "like" : null });
    });

    app.delete("/posts/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });

        const isAdmin = await assertAdmin(username);
        if (!isAdmin) return res.status(403).json({ error: "forbidden" });

        const postId = String(req.params.id);
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ error: "post not found" });

        await prisma.post.delete({ where: { id: postId } });
        res.status(204).send();
    });

    app.post("/posts/:id/react", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const postId = String(req.params.id);
        const input = PostReactSchema.parse(req.body);

        const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId: username } } });
        const wanted = String(input.type);
        let active = true;
        if (existing && String((existing as any).type || "like") === wanted) {
            await prisma.like.delete({ where: { postId_userId: { postId, userId: username } } });
            active = false;
        } else if (existing) {
            await prisma.like.update({ where: { postId_userId: { postId, userId: username } }, data: { type: wanted } });
            active = true;
        } else {
            await prisma.like.create({ data: { postId, userId: username, type: wanted } });
            active = true;
        }

        const env = makeEventEnvelope({
            source: "feed",
            type: active ? "post.reacted" : "post.unreacted",
            data: { postId, userId: username, reaction: wanted },
        });
        await publishEvent(env, eventTargets());
        res.json({ ok: true, active, type: active ? wanted : null });
    });

    app.post("/posts/:id/comments", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const postId = String(req.params.id);
        const input = CommentCreateSchema.parse(req.body);
        const comment = await prisma.comment.create({ data: { postId, userId: username, text: input.text } });
        const env = makeEventEnvelope({
            source: "feed",
            type: "comment.created",
            data: { id: comment.id, postId },
        });
        await publishEvent(env, eventTargets());

        // Enrich comment? Frontend usually just appends it.
        // The gateway used to enrich it.
        const enrichedComment = (await enrichPosts([{ userId: username, comments: [comment] } as any]))[0].comments[0];
        res.status(201).json({ comment: enrichedComment });
    });

    app.get("/polls", async (_req, res) => {
        const req = _req as any;
        const clubBookId = String(req.query?.clubBookId || "").trim();
        if (!clubBookId) return res.status(400).json({ error: "missing clubBookId" });
        const polls = await prisma.poll.findMany({
            where: { clubBookId },
            orderBy: { createdAt: "desc" },
            include: {
                options: { orderBy: { index: "asc" } },
                _count: { select: { votes: true } },
            },
        });
        res.json({ polls });
    });

    app.get("/polls/:id", async (req, res) => {
        const id = String(req.params.id);
        const userId = getUsername(req);

        const poll = await prisma.poll.findUnique({
            where: { id },
            include: {
                options: { orderBy: { index: "asc" } },
                votes: userId ? { where: { userId } } : false,
            },
        });

        if (!poll) return res.status(404).json({ error: "poll not found" });

        const userVotes = poll.votes || [];
        const hasVoted = userVotes.length > 0;
        const showResults = hasVoted;

        let voteCounts: Record<string, number> = {};
        let totalVotes = 0;

        // Map to hold voters per option for "rich" response
        // Using simple array of strings initially.
        let votersByOptionId: Record<string, string[]> = {};

        if (showResults) {
            const results = await prisma.pollVote.groupBy({
                by: ["optionId"],
                where: { pollId: id },
                _count: { _all: true },
            });
            for (const r of results) {
                voteCounts[r.optionId] = r._count._all;
                totalVotes += r._count._all;
            }

            if (poll.publicVotes) {
                const votes = await prisma.pollVote.findMany({
                    where: { pollId: id },
                    select: { optionId: true, userId: true },
                    orderBy: { createdAt: "asc" },
                });
                for (const v of votes) {
                    (votersByOptionId[v.optionId] ||= []).push(v.userId);
                }
            }
        }

        const optionsWithResults = poll.options.map((o) => ({
            ...o,
            votes: showResults ? voteCounts[o.id] || 0 : undefined,
            userVoted: userVotes.some((v) => v.optionId === o.id),
            voters: showResults && poll.publicVotes ? votersByOptionId[o.id] || [] : undefined,
        }));

        const rawPoll = {
            ...poll,
            options: optionsWithResults,
            votes: undefined,
            totalVotes: showResults ? totalVotes : undefined,
            userHasVoted: hasVoted,
        };

        const enrichedPoll = await enrichPoll(rawPoll, userId);

        res.json({
            poll: enrichedPoll,
        });
    });

    app.post("/polls", async (req, res) => {
        const userId = getUsername(req);
        if (!userId) return res.status(401).json({ error: "unauthorized" });
        const input = PollCreateSchema.parse(req.body);

        const poll = await prisma.poll.create({
            data: {
                userId,
                clubBookId: input.clubBookId,
                question: input.question,
                description: input.description,
                imageUrl: input.imageUrl,
                multiChoice: input.multiChoice,
                publicVotes: input.publicVotes,
                options: {
                    create: input.options.map((o, i) => ({
                        text: o.text,
                        imageUrl: o.imageUrl,
                        index: i,
                    })),
                },
            },
            include: { options: true },
        });
        res.status(201).json({ poll });
    });

    app.post("/polls/:id/vote", async (req, res) => {
        const userId = getUsername(req);
        if (!userId) return res.status(401).json({ error: "unauthorized" });
        const pollId = String(req.params.id);
        const input = PollVoteSchema.parse(req.body);

        const poll = await prisma.poll.findUnique({ where: { id: pollId }, include: { options: true } });
        if (!poll) return res.status(404).json({ error: "poll not found" });

        const optionIdsRaw = (input as any)?.optionIds
            ? (input as any).optionIds as any[]
            : (input as any)?.optionId
                ? [(input as any).optionId]
                : [];
        const optionIds = Array.from(new Set(optionIdsRaw.map((v: any) => String(v)).filter(Boolean))) as string[];
        if (optionIds.length === 0) return res.status(400).json({ error: "missing optionIds" });
        if (!poll.multiChoice && optionIds.length !== 1) return res.status(400).json({ error: "single_choice_requires_one_option" });

        const optionIdSet = new Set(poll.options.map((o) => o.id));
        for (const id of optionIds) {
            if (!optionIdSet.has(id)) return res.status(400).json({ error: "invalid option" });
        }

        const existingVotes = await prisma.pollVote.findMany({ where: { pollId, userId }, select: { id: true } });
        if (existingVotes.length > 0) return res.status(409).json({ error: "already_voted" });

        await prisma.$transaction(async (tx: any) => {
            await tx.pollVote.createMany({
                data: optionIds.map((optionId) => ({ pollId, optionId, userId })),
            });
        });

        res.json({ ok: true, action: "added" });
    });



    app.use((err: any, _req: any, res: any, _next: any) => {
        if (err?.name === "ZodError" || Array.isArray(err?.issues)) {
            return res.status(400).json({ error: "invalid_input", issues: err.issues || [] });
        }
        const status = Number(err?.status || 500);
        res.status(status).json(err?.body || { error: err?.message || "internal error" });
    });
}
