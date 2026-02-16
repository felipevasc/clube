import type { Express } from "express";
import {
  ClubBookArtifactCreateSchema,
  ClubBookCreateSchema,
  ClubBookMessageCreateSchema,
  GroupCreateSchema,
  makeEventEnvelope,
  publishEvent,
} from "@clube/shared";
import { z } from "zod";
import { prisma } from "./db.js";

function getUsername(req: any): string | null {
  const v = req.header("x-username");
  if (!v) return null;
  return String(v);
}

function roleWeight(role: string): number {
  // Keep the list stable for UI: owner -> mod -> member -> anything else.
  switch (String(role || "").toLowerCase()) {
    case "owner":
      return 0;
    case "mod":
      return 1;
    case "member":
      return 2;
    default:
      return 3;
  }
}

function eventTargets(): string[] {
  const raw = process.env.EVENT_TARGETS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function assertOwner(username: string, groupId: string): Promise<boolean> {
  const g = await prisma.group.findUnique({ where: { id: groupId } });
  return !!g && g.ownerId === username;
}

async function assertMember(username: string, groupId: string): Promise<boolean> {
  const m = await prisma.membership.findUnique({ where: { groupId_userId: { groupId, userId: username } } });
  return !!m;
}

async function assertClubBookExists(clubBookId: string): Promise<boolean> {
  const b = await prisma.clubBook.findUnique({ where: { id: clubBookId }, select: { id: true } });
  return !!b;
}

const GroupBookOfMonthSetSchema = z.object({
  bookId: z.string().min(1).max(64),
});

export function registerRoutes(app: Express) {
  // Database Initialization (Workaround for environment Prisma issues)
  (async () => {
    try {
      await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Channel" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "cityCode" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ChannelMessage" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "channelId" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "DirectMessage" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "fromUserId" TEXT NOT NULL,
          "toUserId" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial channels if empty
      const countResult: any = await (prisma as any).$queryRawUnsafe('SELECT COUNT(*) as count FROM "Channel"');
      const count = Number(countResult[0]?.count ?? 0);
      if (count === 0) {
        await (prisma as any).$executeRawUnsafe(`
          INSERT INTO "Channel" ("id", "name", "type", "cityCode") VALUES 
          ('geral', 'Geral', 'GLOBAL', NULL),
          ('fortaleza', 'Fortaleza', 'CITY', 'FORTALEZA'),
          ('brasilia', 'Brasília', 'CITY', 'BRASILIA')
        `);
      }
    } catch (e) {
      console.error("[database init error]", e);
    }
  })();

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

  app.get("/groups", async (_req, res) => {
    const username = getUsername(_req);
    if (!username) return res.status(401).json({ error: "missing x-username" });

    const memberships = await prisma.membership.findMany({
      where: { userId: username },
      select: { groupId: true },
    });
    const ids = memberships.map((m) => m.groupId).filter(Boolean);
    const groups =
      ids.length > 0
        ? await prisma.group.findMany({
          where: { id: { in: ids } },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
        : [];
    res.json({ groups });
  });

  app.post("/groups", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const input = GroupCreateSchema.parse(req.body);
    const group = await prisma.group.create({
      data: { ...input, ownerId: username },
    });
    await prisma.membership.create({
      data: { groupId: group.id, userId: username, role: "owner" },
    });
    const env = makeEventEnvelope({ source: "groups", type: "group.created", data: { id: group.id } });
    await publishEvent(env, eventTargets());
    res.status(201).json({ group });
  });

  app.get("/groups/:id", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const id = String(req.params.id);
    if (!(await assertMember(username, id))) return res.status(404).json({ error: "group not found" });
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) return res.status(404).json({ error: "group not found" });
    res.json({ group });
  });

  app.get("/groups/:id/me", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });

    const [membership, pendingRequest] = await Promise.all([
      prisma.membership.findUnique({ where: { groupId_userId: { groupId, userId: username } } }),
      prisma.joinRequest.findUnique({
        where: { groupId_userId_status: { groupId, userId: username, status: "pending" } },
      }),
    ]);

    res.json({
      membership,
      pendingRequest,
      isOwner: group.ownerId === username,
    });
  });

  app.post("/groups/:id/join", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });

    const alreadyMember = await prisma.membership.findUnique({
      where: { groupId_userId: { groupId, userId: username } },
    });
    if (alreadyMember) return res.json({ status: "already_member" });

    const existingPending = await prisma.joinRequest.findUnique({
      where: { groupId_userId_status: { groupId, userId: username, status: "pending" } },
    });
    if (existingPending) return res.json({ status: "already_requested", request: existingPending });

    const reqRow = await prisma.joinRequest.create({
      data: { groupId, userId: username, status: "pending" },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.join_requested",
      data: { id: reqRow.id, groupId, userId: username },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({ request: reqRow });
  });

  app.post("/groups/:id/leave", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });
    if (group.ownerId === username) return res.status(400).json({ error: "owner cannot leave group" });

    const membership = await prisma.membership.findUnique({
      where: { groupId_userId: { groupId, userId: username } },
    });
    if (!membership) return res.json({ status: "not_member" });

    await prisma.membership.delete({ where: { groupId_userId: { groupId, userId: username } } });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.left",
      data: { groupId, userId: username },
    });
    await publishEvent(env, eventTargets());
    res.json({ status: "left" });
  });

  app.get("/groups/:id/requests", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    if (!(await assertOwner(username, groupId))) return res.status(403).json({ error: "owner only" });
    const requests = await prisma.joinRequest.findMany({
      where: { groupId, status: "pending" },
      orderBy: { createdAt: "asc" },
    });
    res.json({ requests });
  });

  app.post("/groups/:id/requests/:requestId/approve", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const requestId = String(req.params.requestId);
    if (!(await assertOwner(username, groupId))) return res.status(403).json({ error: "owner only" });

    const jr = await prisma.joinRequest.findUnique({ where: { id: requestId } });
    if (!jr || jr.groupId !== groupId) return res.status(404).json({ error: "request not found" });
    if (jr.status !== "pending") return res.status(400).json({ error: "not pending" });

    await prisma.joinRequest.update({ where: { id: requestId }, data: { status: "approved" } });
    await prisma.membership.create({ data: { groupId, userId: jr.userId, role: "member" } });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.join_approved",
      data: { requestId, groupId, userId: jr.userId },
    });
    await publishEvent(env, eventTargets());
    res.json({ ok: true });
  });

  app.post("/groups/:id/requests/:requestId/reject", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const requestId = String(req.params.requestId);
    if (!(await assertOwner(username, groupId))) return res.status(403).json({ error: "owner only" });

    const jr = await prisma.joinRequest.findUnique({ where: { id: requestId } });
    if (!jr || jr.groupId !== groupId) return res.status(404).json({ error: "request not found" });
    if (jr.status !== "pending") return res.status(400).json({ error: "not pending" });

    await prisma.joinRequest.update({ where: { id: requestId }, data: { status: "rejected" } });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.join_rejected",
      data: { requestId, groupId, userId: jr.userId },
    });
    await publishEvent(env, eventTargets());
    res.json({ ok: true });
  });

  app.get("/groups/:id/members", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    if (!(await assertMember(username, groupId))) return res.status(404).json({ error: "group not found" });
    const raw = await prisma.membership.findMany({
      where: { groupId },
    });
    const members = raw.sort((a, b) => roleWeight(a.role) - roleWeight(b.role));
    res.json({ members });
  });

  // Invite links (private by token; do not require auth to resolve).
  app.post("/groups/:id/invite", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });
    if (group.ownerId !== username) return res.status(403).json({ error: "owner only" });

    const existing = await prisma.groupInvite.findFirst({
      where: { groupId, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return res.json({ inviteId: existing.id, status: "existing" });

    const invite = await prisma.groupInvite.create({
      data: { groupId, createdByUserId: username },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.invite_created",
      data: { inviteId: invite.id, groupId, createdByUserId: username },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({ inviteId: invite.id, status: "created" });
  });

  app.post("/groups/:id/invite/rotate", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });
    if (group.ownerId !== username) return res.status(403).json({ error: "owner only" });

    const now = new Date();
    await prisma.groupInvite.updateMany({
      where: { groupId, revokedAt: null },
      data: { revokedAt: now },
    });

    const invite = await prisma.groupInvite.create({
      data: { groupId, createdByUserId: username },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.invite_rotated",
      data: { inviteId: invite.id, groupId, createdByUserId: username },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({ inviteId: invite.id, status: "rotated" });
  });

  app.get("/invites/:inviteId", async (req, res) => {
    const inviteId = String(req.params.inviteId);
    const invite = await prisma.groupInvite.findFirst({ where: { id: inviteId, revokedAt: null } });
    if (!invite) return res.status(404).json({ error: "invite not found" });
    const group = await prisma.group.findUnique({ where: { id: invite.groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });
    res.json({
      invite: { id: invite.id, groupId: invite.groupId, createdAt: invite.createdAt },
      group: { id: group.id, name: group.name, description: group.description },
    });
  });

  app.post("/invites/:inviteId/accept", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const inviteId = String(req.params.inviteId);
    const invite = await prisma.groupInvite.findFirst({ where: { id: inviteId, revokedAt: null } });
    if (!invite) return res.status(404).json({ error: "invite not found" });
    const group = await prisma.group.findUnique({ where: { id: invite.groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });

    const groupId = invite.groupId;
    const alreadyMember = await prisma.membership.findUnique({
      where: { groupId_userId: { groupId, userId: username } },
    });
    if (alreadyMember) return res.json({ status: "already_member", groupId });

    try {
      await prisma.$transaction([
        prisma.joinRequest.deleteMany({ where: { groupId, userId: username, status: "pending" } }),
        prisma.membership.create({ data: { groupId, userId: username, role: "member" } }),
      ]);
    } catch (e: any) {
      // If we raced with another accept/join path, treat as already joined.
      const m = await prisma.membership.findUnique({ where: { groupId_userId: { groupId, userId: username } } });
      if (m) return res.json({ status: "already_member", groupId });
      throw e;
    }

    const env = makeEventEnvelope({
      source: "groups",
      type: "group.invite_accepted",
      data: { inviteId, groupId, userId: username },
    });
    await publishEvent(env, eventTargets());
    res.json({ status: "joined", groupId });
  });

  app.post("/invites/:inviteId/decline", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const inviteId = String(req.params.inviteId);
    const invite = await prisma.groupInvite.findFirst({ where: { id: inviteId, revokedAt: null } });
    if (!invite) return res.status(404).json({ error: "invite not found" });

    const env = makeEventEnvelope({
      source: "groups",
      type: "group.invite_declined",
      data: { inviteId, groupId: invite.groupId, userId: username },
    });
    await publishEvent(env, eventTargets());
    res.json({ status: "declined" });
  });

  app.get("/groups/:id/book-of-month", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    if (!(await assertMember(username, groupId))) return res.status(404).json({ error: "group not found" });
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "group not found" });

    const history = await prisma.groupBookOfMonthSelection.findMany({
      where: { groupId },
      orderBy: { setAt: "desc" },
      take: 24,
    });
    const current = history[0] || null;

    res.json({
      current: current
        ? {
          id: current.id,
          groupId: current.groupId,
          bookId: current.bookId,
          setByUserId: current.setByUserId,
          setAt: current.setAt,
        }
        : null,
      history: history.map((h) => ({
        id: h.id,
        groupId: h.groupId,
        bookId: h.bookId,
        setByUserId: h.setByUserId,
        setAt: h.setAt,
      })),
    });
  });

  app.post("/groups/:id/book-of-month", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const groupId = String(req.params.id);
    if (!(await assertOwner(username, groupId))) return res.status(403).json({ error: "owner only" });

    const input = GroupBookOfMonthSetSchema.parse(req.body);
    const row = await prisma.groupBookOfMonthSelection.create({
      data: { groupId, bookId: input.bookId, setByUserId: username },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "group.book_of_month_set",
      data: { groupId, bookId: input.bookId, setByUserId: username, selectionId: row.id },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({
      current: {
        id: row.id,
        groupId: row.groupId,
        bookId: row.bookId,
        setByUserId: row.setByUserId,
        setAt: row.setAt,
      },
    });
  });

  // Livro do mes (global, sem "grupos"): ClubBooks + chat + artefatos.
  app.get("/club-books", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const city = req.query.city ? String(req.query.city) : undefined;
    const clubBooks = await prisma.clubBook.findMany({
      where: city ? { city } : undefined,
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    res.json({
      clubBooks: clubBooks.map((b) => ({
        id: b.id,
        bookId: b.bookId,
        title: b.title,
        author: b.author,
        coverUrl: b.coverUrl,
        colorKey: b.colorKey,
        city: b.city,
        month: b.month,
        year: b.year,
        createdByUserId: b.createdByUserId,
        createdAt: b.createdAt,
      })),
    });
  });

  app.post("/club-books/resolve", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const input = z
      .object({ ids: z.array(z.string().min(1).max(64)).max(200) })
      .parse(req.body);
    const ids = Array.from(new Set(input.ids.map(String))).filter(Boolean);
    const clubBooks =
      ids.length === 0
        ? []
        : await prisma.clubBook.findMany({
          where: { id: { in: ids } },
        });
    res.json({
      clubBooks: clubBooks.map((b) => ({
        id: b.id,
        bookId: b.bookId,
        title: b.title,
        author: b.author,
        colorKey: b.colorKey,
        isActive: b.isActive,
        createdByUserId: b.createdByUserId,
        createdAt: b.createdAt,
        activatedAt: b.activatedAt,
      })),
    });
  });

  app.get("/club-books/active", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });

    const city = String(req.query.city || "FORTALEZA");
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const active = await prisma.clubBook.findFirst({
      where: { city, month, year },
      orderBy: { createdAt: "desc" },
    });

    // If no exact match for this month, find the most recent one as fallback?
    // User requested "active whenever it is in that month". 
    // If no book for this month, we return null or fallback to last one?
    // Let's stick to the specific month/year/city for now.

    if (!active) return res.json({ clubBook: null });
    res.json({
      clubBook: {
        id: active.id,
        bookId: active.bookId,
        title: active.title,
        author: active.author,
        coverUrl: active.coverUrl,
        colorKey: active.colorKey,
        city: active.city,
        month: active.month,
        year: active.year,
        createdByUserId: active.createdByUserId,
        createdAt: active.createdAt,
      },
    });
  });

  app.post("/club-books", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const input = ClubBookCreateSchema.parse(req.body);

    const clubBook = await prisma.clubBook.create({
      data: {
        bookId: input.bookId,
        title: input.title,
        author: input.author,
        coverUrl: input.coverUrl,
        colorKey: input.colorKey,
        city: input.city,
        month: input.month,
        year: input.year,
        createdByUserId: username,
      },
    });

    const env = makeEventEnvelope({
      source: "groups",
      type: "club_book.created",
      data: { id: clubBook.id, bookId: clubBook.bookId, createdByUserId: username, city: clubBook.city },
    });
    await publishEvent(env, eventTargets());

    res.status(201).json({
      clubBook: {
        id: clubBook.id,
        bookId: clubBook.bookId,
        title: clubBook.title,
        author: clubBook.author,
        colorKey: clubBook.colorKey,
        city: clubBook.city,
        month: clubBook.month,
        year: clubBook.year,
        createdByUserId: clubBook.createdByUserId,
        createdAt: clubBook.createdAt,
      },
    });
  });

  // Manual activation removed, logic is month-based.

  app.get("/club-books/:id/messages", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const clubBookId = String(req.params.id);
    if (!(await assertClubBookExists(clubBookId))) return res.status(404).json({ error: "club book not found" });
    const after = String(req.query.after || "").trim();
    const limitRaw = String(req.query.limit || "").trim();
    const orderRaw = String(req.query.order || "").trim().toLowerCase();

    let afterDate: Date | null = null;
    if (after) {
      const d = new Date(after);
      if (!Number.isNaN(d.valueOf())) afterDate = d;
    }

    const defaultLimit = afterDate ? 200 : 120;
    let limit = defaultLimit;
    if (limitRaw) {
      const n = Number(limitRaw);
      if (Number.isFinite(n)) limit = Math.max(1, Math.min(200, Math.floor(n)));
    }

    const order: "asc" | "desc" = orderRaw === "desc" ? "desc" : "asc";

    const messages = await prisma.clubBookMessage.findMany({
      where: { clubBookId, createdAt: afterDate ? { gt: afterDate } : undefined },
      orderBy: { createdAt: order },
      take: limit,
    });
    res.json({
      messages: messages.map((m) => ({
        id: m.id,
        clubBookId: m.clubBookId,
        userId: m.userId,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  });
  app.post("/club-books/:id/messages", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const clubBookId = String(req.params.id);
    if (!(await assertClubBookExists(clubBookId))) return res.status(404).json({ error: "club book not found" });
    const input = ClubBookMessageCreateSchema.parse(req.body);
    const msg = await prisma.clubBookMessage.create({
      data: { clubBookId, userId: username, text: input.text },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "club_chat.message_created",
      data: { id: msg.id, clubBookId, userId: username },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({
      message: { id: msg.id, clubBookId: msg.clubBookId, userId: msg.userId, text: msg.text, createdAt: msg.createdAt },
    });
  });

  // Channels (Geral, Cities)
  app.get("/channels", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });

    // In a real app we might filter by user.cities, for now return all 
    // and let frontend filter or just return based on query param
    const channels = await (prisma as any).$queryRawUnsafe(`SELECT * FROM "Channel" ORDER BY "createdAt" ASC`);
    res.json({ channels });
  });

  app.get("/channels/:id/messages", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const channelId = String(req.params.id);
    const after = String(req.query.after || "").trim();
    const limitRaw = String(req.query.limit || "").trim();

    let afterDate: Date | null = null;
    if (after) {
      const d = new Date(after);
      if (!Number.isNaN(d.valueOf())) afterDate = d;
    }

    const messages = await (prisma as any).$queryRawUnsafe(
      `SELECT * FROM "ChannelMessage" WHERE "channelId" = $1 ${afterDate ? `AND "createdAt" > $2` : ""} ORDER BY "createdAt" ASC LIMIT $3`,
      channelId,
      afterDate,
      limitRaw ? Math.min(200, Number(limitRaw)) : 100
    );
    res.json({ messages });
  });

  app.post("/channels/:id/messages", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const channelId = String(req.params.id);
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "missing text" });

    const id = `msg_${Math.random().toString(36).slice(2, 11)}`;
    try {
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "ChannelMessage" ("id", "channelId", "userId", "text", "createdAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        id,
        channelId,
        username,
        text
      );
      const msg = { id, channelId, userId: username, text, createdAt: new Date().toISOString() };
      res.status(201).json({ message: msg });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Direct Messages
  app.get("/direct-messages/:userId", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const otherUser = String(req.params.userId);

    const messages = await (prisma as any).$queryRawUnsafe(
      `SELECT * FROM "DirectMessage" WHERE ("fromUserId" = $1 AND "toUserId" = $2) OR ("fromUserId" = $3 AND "toUserId" = $4) ORDER BY "createdAt" ASC LIMIT 100`,
      username,
      otherUser,
      otherUser,
      username
    );
    res.json({ messages });
  });

  app.post("/direct-messages/:userId", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const otherUser = String(req.params.userId);
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "missing text" });

    const id = `dm_${Math.random().toString(36).slice(2, 11)}`;
    try {
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "DirectMessage" ("id", "fromUserId", "toUserId", "text", "createdAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        id,
        username,
        otherUser,
        text
      );
      const msg = { id, fromUserId: username, toUserId: otherUser, text, createdAt: new Date().toISOString() };
      res.status(201).json({ message: msg });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/club-books/:id/artifacts", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const clubBookId = String(req.params.id);
    if (!(await assertClubBookExists(clubBookId))) return res.status(404).json({ error: "club book not found" });
    const artifacts = await prisma.clubBookArtifact.findMany({
      where: { clubBookId },
      orderBy: { createdAt: "desc" },
      take: 120,
    });
    res.json({
      artifacts: artifacts.map((a) => ({
        id: a.id,
        clubBookId: a.clubBookId,
        fileName: a.fileName,
        mimeType: a.mimeType,
        size: a.size,
        url: a.url,
        uploadedByUserId: a.uploadedByUserId,
        createdAt: a.createdAt,
      })),
    });
  });

  app.post("/club-books/:id/artifacts", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const clubBookId = String(req.params.id);
    if (!(await assertClubBookExists(clubBookId))) return res.status(404).json({ error: "club book not found" });
    const input = ClubBookArtifactCreateSchema.parse(req.body);
    const a = await prisma.clubBookArtifact.create({
      data: {
        clubBookId,
        uploadedByUserId: username,
        fileName: input.fileName,
        mimeType: input.mimeType,
        size: Number(input.size || 0),
        url: input.url,
      },
    });
    const env = makeEventEnvelope({
      source: "groups",
      type: "club_artifact.created",
      data: { id: a.id, clubBookId, uploadedByUserId: username },
    });
    await publishEvent(env, eventTargets());
    res.status(201).json({
      artifact: {
        id: a.id,
        clubBookId: a.clubBookId,
        fileName: a.fileName,
        mimeType: a.mimeType,
        size: a.size,
        url: a.url,
        uploadedByUserId: a.uploadedByUserId,
        createdAt: a.createdAt,
      },
    });
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    if (err?.name === "ZodError" || Array.isArray(err?.issues)) {
      return res.status(400).json({ error: "invalid_input", issues: err.issues || [] });
    }
    const status = Number(err?.status || 500);
    res.status(status).json(err?.body || { error: err?.message || "internal error" });
  });
}
