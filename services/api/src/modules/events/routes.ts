import type { Express } from "express";
import { z } from "zod";
import { prisma } from "../../db.js";
import { makeEventEnvelope, publishEvent } from "@clube/shared";

function getUsername(req: any): string | null {
    const v = req.header("x-username");
    if (!v) return null;
    return String(v);
}

function eventTargets(): string[] {
    const raw = process.env.EVENT_TARGETS || "";
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

async function assertAdmin(username: string): Promise<boolean> {
    const u = await prisma.user.findUnique({ where: { id: username }, select: { isAdmin: true } });
    return !!u?.isAdmin;
}

const ClubEventCreateSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    city: z.enum(["FORTALEZA", "BRASILIA"]),
    location: z.string().min(1),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    startAt: z.string().datetime(), // ISO string
    endAt: z.string().datetime().optional(),
    // coverUrl removed
    locationPhotos: z.array(z.string().min(1)).optional(),
    addressStreet: z.string().optional(),
    addressNumber: z.string().optional(),
    addressDistrict: z.string().optional(),
    addressCity: z.string().optional(),
    addressState: z.string().optional(),
    addressZip: z.string().optional(),
});

const ClubEventPhotoCreateSchema = z.object({
    url: z.string().min(1),
    caption: z.string().optional(),
});

export function registerRoutes(app: Express) {
    // List Events
    app.get("/events", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });

        const city = req.query.city ? String(req.query.city) : undefined;
        const upcomingOnly = req.query.upcoming !== "false";

        const where: any = {};
        if (city) where.city = city;
        if (upcomingOnly) {
            const now = new Date();
            const gracePeriod = new Date();
            gracePeriod.setHours(gracePeriod.getHours() - 24); // 24h grace period for started events

            where.OR = [
                { startAt: { gte: gracePeriod } }, // Started recently or in the future
                { endAt: { gte: now } }           // Still happening (ends in the future)
            ];
        }

        const events = await prisma.clubEvent.findMany({
            where,
            orderBy: { startAt: "asc" },
            include: {
                participants: {
                    select: { userId: true, status: true }
                },
                photos: {
                    where: { type: "LOCATION" },
                    take: 1
                },
                _count: {
                    select: { photos: true }
                }
            }
        });

        // Enrich with user status for the requester
        const result = events.map(e => {
            const myStatus = e.participants.find(p => p.userId === username)?.status || null;
            return {
                ...e,
                myStatus,
                participantsCount: e.participants.filter(p => p.status === 'confirmed').length,
                photosCount: e._count.photos,
                coverUrl: e.photos[0]?.url || null // Use first location photo as virtual coverUrl
            };
        });

        res.json({ events: result });
    });

    // Create Event
    app.post("/events", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });

        try {
            const { locationPhotos, ...inputData } = ClubEventCreateSchema.parse(req.body);

            const event = await prisma.clubEvent.create({
                data: {
                    ...inputData,
                    createdById: username,
                }
            });

            // Save location photos
            if (locationPhotos && locationPhotos.length > 0) {
                await prisma.clubEventPhoto.createMany({
                    data: locationPhotos.map(url => ({
                        eventId: event.id,
                        userId: username,
                        url,
                        type: "LOCATION"
                    }))
                });
            }

            // Auto-confirm creator
            await prisma.clubEventParticipant.create({
                data: { eventId: event.id, userId: username, status: "confirmed" }
            });

            const env = makeEventEnvelope({
                source: "events",
                type: "event.created",
                data: { id: event.id, city: event.city, createdById: username }
            });
            await publishEvent(env, eventTargets());

            res.status(201).json({ event });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    // Get Event Details
    app.get("/events/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const id = req.params.id;

        const event = await prisma.clubEvent.findUnique({
            where: { id },
            include: {
                participants: {
                    orderBy: { createdAt: 'asc' }
                    // In a real app we'd fetch user details (name/avatar) here or from a user service
                    // For now we just return userIds and frontend will resolve them or we fetch them
                },
                photos: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!event) return res.status(404).json({ error: "event not found" });

        const myStatus = event.participants.find(p => p.userId === username)?.status || null;
        const isAdmin = await assertAdmin(username);
        const canEdit = isAdmin || event.createdById === username;

        res.json({
            event: {
                ...event,
                myStatus,
                canEdit
            }
        });
    });

    // Join/Leave/Update Status
    app.post("/events/:id/participate", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const eventId = req.params.id;
        const { status } = req.body; // 'confirmed', 'maybe', 'declined'

        if (!['confirmed', 'maybe', 'declined'].includes(status)) {
            return res.status(400).json({ error: "invalid status" });
        }

        const part = await prisma.clubEventParticipant.upsert({
            where: { eventId_userId: { eventId, userId: username } },
            update: { status },
            create: { eventId, userId: username, status }
        });

        res.json({ participation: part });
    });

    // Upload Photo
    app.post("/events/:id/photos", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const eventId = req.params.id;

        try {
            const input = ClubEventPhotoCreateSchema.parse(req.body);
            const photo = await prisma.clubEventPhoto.create({
                data: {
                    eventId,
                    userId: username,
                    url: input.url,
                    caption: input.caption
                }
            });

            res.status(201).json({ photo });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    // Update Event
    app.put("/events/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const id = req.params.id;

        const event = await prisma.clubEvent.findUnique({ where: { id } });
        if (!event) return res.status(404).json({ error: "event not found" });

        const isAdmin = await assertAdmin(username);
        if (!isAdmin && event.createdById !== username) {
            return res.status(403).json({ error: "forbidden" });
        }

        try {
            const { locationPhotos, ...inputData } = ClubEventCreateSchema.partial().parse(req.body);

            const updated = await prisma.clubEvent.update({
                where: { id },
                data: {
                    ...inputData,
                }
            });

            if (locationPhotos) {
                await prisma.clubEventPhoto.deleteMany({
                    where: { eventId: id, type: "LOCATION" }
                });

                if (locationPhotos.length > 0) {
                    await prisma.clubEventPhoto.createMany({
                        data: locationPhotos.map(url => ({
                            eventId: id,
                            userId: username,
                            url,
                            type: "LOCATION"
                        }))
                    });
                }
            }

            res.json({ event: updated });
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    // Delete Event
    app.delete("/events/:id", async (req, res) => {
        const username = getUsername(req);
        if (!username) return res.status(401).json({ error: "missing x-username" });
        const id = req.params.id;

        const event = await prisma.clubEvent.findUnique({ where: { id } });
        if (!event) return res.status(404).json({ error: "event not found" });

        const isAdmin = await assertAdmin(username);
        if (!isAdmin && event.createdById !== username) {
            return res.status(403).json({ error: "forbidden" });
        }

        await prisma.clubEvent.delete({ where: { id } });
        res.status(204).send();
    });
}
