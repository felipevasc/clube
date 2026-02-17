import type { Express } from "express";
import { BookCreateSchema, BookUpdateSchema, makeEventEnvelope, publishEvent } from "@clube/shared";
import { prisma } from "../../db.js";

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

// Category Seeding & Migration
(async () => {
    try {
        let suspense = await prisma.category.findUnique({ where: { name: "SUSPENSE" } });
        if (!suspense) {
            suspense = await prisma.category.create({ data: { name: "SUSPENSE" } });
            console.log("Category created: SUSPENSE");
        }

        const romance = await prisma.category.findUnique({ where: { name: "ROMANCE" } });
        if (!romance) {
            await prisma.category.create({ data: { name: "ROMANCE" } });
            console.log("Category created: ROMANCE");
        }

        // Migration: Find books with no categories and move to SUSPENSE
        const uncategorizedBooks = await prisma.book.findMany({
            where: {
                categories: { none: {} }
            }
        });

        if (uncategorizedBooks.length > 0) {
            console.log(`Migrating ${uncategorizedBooks.length} uncategorized books to SUSPENSE...`);
            for (const book of uncategorizedBooks) {
                await prisma.book.update({
                    where: { id: book.id },
                    data: {
                        categories: {
                            connect: { id: suspense.id }
                        }
                    }
                });
            }
            console.log("Migration complete.");
        }
    } catch (e) {
        console.error("Error during seeding/migration:", e);
    }
})();

export function registerRoutes(app: Express) {
    app.get("/books", async (req, res) => {
        const q = (req.query.q ? String(req.query.q) : "").trim();
        const category = req.query.category ? String(req.query.category) : (req.query.genre ? String(req.query.genre) : undefined);
        const books = await prisma.book.findMany({
            where: {
                AND: [
                    category ? { categories: { some: { name: category.toUpperCase() } } } : {},
                    q
                        ? {
                            OR: [
                                { title: { contains: q } },
                                { author: { contains: q } },
                            ],
                        }
                        : {},
                ],
            },
            include: {
                categories: true,
                styleImages: true,
                createdByUser: { select: { id: true, name: true, avatarUrl: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        res.json({ books });
    });

    app.get("/books/search-covers", async (req, res) => {
        const title = String(req.query.title || "").trim();
        const author = String(req.query.author || "").trim();

        if (!title && !author) {
            return res.json({ covers: [] });
        }

        const q = [
            title ? `intitle:${title}` : "",
            author ? `inauthor:${author}` : ""
        ].filter(Boolean).join("+");

        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10`;
            const response = await fetch(url);
            const data: any = await response.json();

            const covers = (data.items || []).map((item: any) => {
                const info = item.volumeInfo || {};
                const imageLinks = info.imageLinks || {};
                // Prefer thumbnail or smallThumbnail. Google sometimes provides larger ones if available.
                return imageLinks.thumbnail || imageLinks.smallThumbnail || null;
            }).filter(Boolean);

            // Deduplicate
            const uniqueCovers = Array.from(new Set(covers));

            res.json({ covers: uniqueCovers });
        } catch (e) {
            console.error("Error searching covers:", e);
            res.status(500).json({ error: "Failed to search covers" });
        }
    });

    app.get("/books/:id", async (req, res) => {
        const id = String(req.params.id);
        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                categories: true,
                styleImages: true,
                createdByUser: { select: { id: true, name: true, avatarUrl: true } }
            }
        });
        if (!book) return res.status(404).json({ error: "book not found" });
        res.json({ book });
    });

    app.put("/books/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const id = String(req.params.id);
        const input = BookUpdateSchema.parse(req.body);
        try {
            // Check if user is admin or creator
            const user = await prisma.user.findUnique({ where: { id: username } });
            const book = await prisma.book.findUnique({ where: { id } });

            if (!book) return res.status(404).json({ error: "book not found" });

            const isCreator = book.createdByUserId === username;
            if (!user?.isAdmin && !isCreator) {
                return res.status(403).json({ error: "permission denied" });
            }

            const updated = await prisma.book.update({
                where: { id },
                data: {
                    title: input.title,
                    author: input.author,
                    coverUrl: input.coverUrl || "",
                    synopsis: input.synopsis || "",
                    aiStyleDescription: input.aiStyleDescription || "",
                    indicationComment: input.indicationComment || "",
                    categories: {
                        set: input.categoryIds.map(id => ({ id }))
                    },
                    styleImages: {
                        deleteMany: {},
                        create: (input.aiStyleImageUrls || []).map(url => ({ url }))
                    }
                },
                include: { categories: true, styleImages: true }
            });
            res.json({ book: updated });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    app.post("/books", async (req, res) => {
        const username = getUsername(req);
        // We allow creating books without user context if publicly accessible, but better to require login
        // For now, if username exists, we link it.
        const input = BookCreateSchema.parse(req.body);
        const { categoryIds, aiStyleImageUrls, ...data } = input;

        const book = await prisma.book.create({
            data: {
                ...data,
                createdByUserId: username || undefined,
                categories: {
                    connect: categoryIds?.map((id: string) => ({ id })) || []
                },
                styleImages: {
                    create: (aiStyleImageUrls || []).map(url => ({ url }))
                }
            },
            include: { categories: true, styleImages: true }
        });
        const env = makeEventEnvelope({ source: "books", type: "book.created", data: { id: book.id } });
        await publishEvent(env, eventTargets());
        res.status(201).json({ book });
    });

    app.get("/categories", async (req, res) => {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });
        res.json({ categories });
    });

    app.delete("/books/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });

        const user = await prisma.user.findUnique({ where: { id: username } });
        if (!user?.isAdmin) return res.status(403).json({ error: "admin only" });

        const id = String(req.params.id);

        try {
            await prisma.book.delete({ where: { id } });
            res.json({ ok: true });
        } catch (e: any) {
            if (String(e?.code || "") === "P2025") return res.status(404).json({ error: "book not found" });
            throw e;
        }
    });
}
