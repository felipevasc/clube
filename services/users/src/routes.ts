import type { Express } from "express";
import { LoginSchema, UserProfileSchema, makeEventEnvelope, publishEvent } from "@clube/shared";
import { prisma } from "./db.js";

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
  app.post("/login", async (req, res) => {
    const { username } = LoginSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { id: username } });
    const user =
      existing ??
      (await prisma.user.create({
        data: {
          id: username,
          name: username,
          bio: "",
          avatarUrl: ""
        },
      }));

    if (!existing) {
      const env = makeEventEnvelope({ source: "users", type: "user.created", data: { id: user.id } });
      await publishEvent(env, eventTargets());
    }
    res.json({ token: username, user });
  });

  app.get("/users", async (req, res) => {
    // Dev convenience endpoint (used by the web login screen).
    if (process.env.NODE_ENV === "production") return res.status(404).json({ error: "not found" });

    const q = String(req.query.q || "").trim();
    const rawLimit = Number(req.query.limit || 50);
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(200, Math.floor(rawLimit))) : 50;

    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: q
        ? {
            OR: [
              { id: { contains: q } },
              { name: { contains: q } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ users });
  });

  app.get("/me", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const user = await prisma.user.findUnique({ where: { id: username } });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user });
  });

  app.put("/me", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const profile = UserProfileSchema.parse(req.body);
    const user = await prisma.user.upsert({
      where: { id: username },
      create: { id: username, ...profile },
      update: profile,
    });
    const env = makeEventEnvelope({ source: "users", type: "user.updated", data: { id: user.id } });
    await publishEvent(env, eventTargets());
    res.json({ user });
  });

  app.get("/users/:id", async (req, res) => {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user });
  });
}
