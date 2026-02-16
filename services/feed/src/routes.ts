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
import { prisma } from "./db.js";

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
    .map((s) => s.trim())
    .filter(Boolean);
}

export function registerRoutes(app: Express) {
  // Express 4 does not automatically handle async errors. Wrap handlers so any
  // thrown/rejected error goes to the error middleware instead of crashing the process.
  const ah = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);
  for (const m of ["get", "post", "put", "delete", "patch"] as const) {
    const orig = (app as any)[m].bind(app);
    (app as any)[m] = (...args: any[]) => {
      // Preserve Express getter behavior: app.get('env') etc.
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

    // Manual fetch of images due to Prisma Client generation issues
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

    res.json({
      posts: posts.map((p) => ({
        ...p,
        images: imagesByPostId[p.id] || [],
        reactions: reactionsByPostId[p.id] || {},
        viewerReaction: viewerReactionByPostId[p.id] || null,
      })),
    });
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

    const formattedPost = {
      ...post,
      images: postImages,
      reactions,
      viewerReaction,
    };
    res.json({ post: formattedPost });
  });

  app.post("/posts", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const input = PostCreateSchema.parse(req.body);
    const post = await prisma.post.create({
      data: {
        userId: username,
        text: String(input.text || ""),
        imageUrl: input.imageUrl ? String(input.imageUrl) : null,
        clubBookId: input.clubBookId ? String(input.clubBookId) : null,
      },
    });

    // Manual insert images
    if (input.images && input.images.length > 0) {
      try {
        for (let i = 0; i < input.images.length; i++) {
          const url = input.images[i];
          const id = Math.random().toString(36).substring(2, 15); // Simple ID gen
          await prisma.$executeRawUnsafe(`INSERT INTO PostImage (id, postId, url, "index") VALUES ('${id}', '${post.id}', '${url}', ${i})`);
        }
      } catch (e) {
        console.error("Failed to insert images", e);
      }
    }
    const env = makeEventEnvelope({ source: "feed", type: "post.created", data: { id: post.id } });
    await publishEvent(env, eventTargets());
    res.status(201).json({ post });
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
    res.status(201).json({ comment });
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

    res.json({
      poll: {
        ...poll,
        options: optionsWithResults,
        votes: undefined,
        totalVotes: showResults ? totalVotes : undefined,
        userHasVoted: hasVoted,
      },
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
      ? (input as any).optionIds
      : (input as any)?.optionId
        ? [(input as any).optionId]
        : [];
    const optionIds = Array.from(new Set(optionIdsRaw.map((v: any) => String(v)).filter(Boolean)));
    if (optionIds.length === 0) return res.status(400).json({ error: "missing optionIds" });
    if (!poll.multiChoice && optionIds.length !== 1) return res.status(400).json({ error: "single_choice_requires_one_option" });

    const optionIdSet = new Set(poll.options.map((o) => o.id));
    for (const id of optionIds) {
      if (!optionIdSet.has(id)) return res.status(400).json({ error: "invalid option" });
    }

    const existingVotes = await prisma.pollVote.findMany({ where: { pollId, userId }, select: { id: true } });
    if (existingVotes.length > 0) return res.status(409).json({ error: "already_voted" });

    await prisma.$transaction(async (tx) => {
      await tx.pollVote.createMany({
        data: optionIds.map((optionId) => ({ pollId, optionId, userId })),
      });
    });

    res.json({ ok: true, action: "added" });
  });

  app.post("/events", async (req, res) => {
    // Dev hook: accept envelopes and validate shape (no-op for MVP).
    EventEnvelopeSchema.parse(req.body);
    res.json({ ok: true });
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    if (err?.name === "ZodError" || Array.isArray(err?.issues)) {
      return res.status(400).json({ error: "invalid_input", issues: err.issues || [] });
    }
    const status = Number(err?.status || 500);
    res.status(status).json(err?.body || { error: err?.message || "internal error" });
  });
}
