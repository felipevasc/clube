import type { Express } from "express";
import { BookCreateSchema, BookUpdateSchema, makeEventEnvelope, publishEvent } from "@clube/shared";
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
  app.get("/books", async (req, res) => {
    const q = (req.query.q ? String(req.query.q) : "").trim();
    const books = await prisma.book.findMany({
      where: q
        ? {
          OR: [
            // NOTE: SQLite connector (dev) does not support `mode: "insensitive"`.
            // For now we rely on SQLite's default LIKE/contains behavior.
            { title: { contains: q } },
            { author: { contains: q } },
          ],
        }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ books });
  });

  app.get("/books/:id", async (req, res) => {
    const id = String(req.params.id);
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return res.status(404).json({ error: "book not found" });
    res.json({ book });
  });

  app.put("/books/:id", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const id = String(req.params.id);
    const input = BookUpdateSchema.parse(req.body);
    try {
      const book = await prisma.book.update({
        where: { id },
        data: { title: input.title, author: input.author, coverUrl: input.coverUrl || "" },
      });
      res.json({ book });
    } catch (e: any) {
      // Prisma known errors: P2025 (record not found), P2002 (unique constraint)
      if (String(e?.code || "") === "P2025") return res.status(404).json({ error: "book not found" });
      if (String(e?.code || "") === "P2002") return res.status(409).json({ error: "book already exists" });
      throw e;
    }
  });

  app.post("/books", async (req, res) => {
    const username = getUsername(req);
    if (!username) return res.status(401).json({ error: "missing x-username" });
    const input = BookCreateSchema.parse(req.body);
    const book = await prisma.book.create({ data: { title: input.title, author: input.author, coverUrl: input.coverUrl || "" } });
    const env = makeEventEnvelope({ source: "books", type: "book.created", data: { id: book.id } });
    await publishEvent(env, eventTargets());
    res.status(201).json({ book });
  });
}
