import type { Express } from "express";
import { prisma } from "../../db.js";
import { aiService } from "../../ai.js";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

function getUserId(req: any): string | null {
    const v = req.header("x-username");
    if (!v) return null;
    return String(v);
}

// Utility to find root and upload dir (copied from uploads/routes for consistency)
function findRepoRoot(startDir: string): string {
    let dir = startDir;
    for (let i = 0; i < 12; i++) {
        if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return startDir;
}
const REPO_ROOT = findRepoRoot(process.cwd());
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(REPO_ROOT, "tmp", "uploads"));

export function registerRoutes(app: Express) {
    app.post("/ai/transform", async (req, res) => {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { imageUrl, clubBookId } = req.body;
        if (!imageUrl || !clubBookId) {
            return res.status(400).json({ error: "imageUrl and clubBookId are required" });
        }

        try {
            // Find the ClubBook to get the Book ID and then the style metadata
            const clubBook = await prisma.clubBook.findUnique({
                where: { id: clubBookId }
            });

            if (!clubBook) return res.status(404).json({ error: "Club book not found" });

            const book = await prisma.book.findUnique({
                where: { id: clubBook.bookId },
                include: { styleImages: true }
            });

            if (!book) return res.status(404).json({ error: "Internal book reference not found" });

            // Prepare URLs for AI (they might be local /api/media/ URLs)
            // AI Service will handle fetching them (if they are global or relative)
            // But since this is a monolith, let's fix relative URLs to absolute if needed or pass base64
            // The aiService implementation fetches as base64, so it should handle full URLs if we provide them.
            // For dev, /api/media/... needs to be translated.
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const fullImageUrl = imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
            const fullStyleImageUrls = book.styleImages.map(si =>
                si.url.startsWith("/") ? `${baseUrl}${si.url}` : si.url
            );

            const styledImageUrlData = await aiService.generateStyledImage({
                originalImageUrl: fullImageUrl,
                bookTitle: book.title,
                bookAuthor: book.author,
                bookSynopsis: book.synopsis,
                styleDescription: book.aiStyleDescription,
                referenceImageUrls: fullStyleImageUrls
            });

            // The AI service returns a base64 Data URI or the original URL on failure.
            // If it's a Data URI, let's save it as a file so it has a URL consistent with our system.
            if (styledImageUrlData.startsWith("data:image/")) {
                const [header, base64Data] = styledImageUrlData.split(",");
                const mime = header.split(":")[1].split(";")[0];
                const ext = mime.split("/")[1] || "png";
                const buffer = Buffer.from(base64Data, "base64");

                const key = `ai_${crypto.randomBytes(12).toString("hex")}.${ext}`;
                const dst = path.join(UPLOAD_DIR, key);
                await fsp.writeFile(dst, buffer);

                return res.json({
                    url: `/api/media/${encodeURIComponent(key)}`
                });
            }

            // If it just returned a URL (like the original on failure), return it
            res.json({ url: styledImageUrlData });

        } catch (error: any) {
            console.error("AI Transform Route Error:", error);
            res.status(500).json({ error: error.message || "Failed to transform image" });
        }
    });
}
