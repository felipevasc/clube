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
  // Database Initialization (Workaround for environment Prisma issues)
  (async () => {
    try {
      // Ensure Alice exists
      await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "User" ("id", "name", "bio", "avatarUrl", "updatedAt") 
        VALUES ('alice', 'Alice', 'Leitora voraz.', '', CURRENT_TIMESTAMP)
      `);
      // Ensure UserCity table exists (though it should from migrations, but being safe)
      await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "UserCity" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
        );
      `);
      // Add cities for Alice
      await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "UserCity" ("id", "userId", "city") VALUES 
        ('uc_1', 'alice', 'FORTALEZA'),
        ('uc_2', 'alice', 'BRASILIA')
      `);
    } catch (e) {
      console.error("[users database init error]", e);
    }
  })();

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
        coverUrl: true,
        createdAt: true,
        updatedAt: true,
        cities: { select: { city: true } },
      },
    });

    res.json({ users });
  });

  app.get("/me", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const user = await prisma.user.findUnique({
      where: { id: username },
      include: { cities: true }
    });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user: { ...user, cities: user.cities.map(c => c.city) } });
  });

  app.put("/me", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const result = UserProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid input", details: result.error });
    }
    const { cities, ...profile } = result.data;

    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.upsert({
        where: { id: username },
        create: { id: username, ...profile },
        update: profile,
        include: { cities: true }
      });

      // Update cities: remove old ones and add new ones
      await tx.userCity.deleteMany({ where: { userId: username } });
      if (cities && cities.length > 0) {
        await tx.userCity.createMany({
          data: cities.map(city => ({ userId: username, city }))
        });
      }

      return await tx.user.findUnique({
        where: { id: username },
        include: { cities: true }
      });
    });

    const env = makeEventEnvelope({ source: "users", type: "user.updated", data: { id: user!.id } });
    await publishEvent(env, eventTargets());
    res.json({ user: { ...user, cities: user!.cities.map(c => c.city) } });
  });

  app.get("/users/:id", async (req, res) => {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { cities: true }
    });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ user: { ...user, cities: user.cities.map(c => c.city) } });
  });
}
