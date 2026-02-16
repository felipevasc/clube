import type { Express } from "express";
import { LoginSchema, UserProfileSchema, makeEventEnvelope, publishEvent } from "@clube/shared";
import { prisma } from "../../db.js";
import {
    clearGoogleOAuthStateCookie,
    clearSessionCookie,
    getUserIdFromRequest,
    issueSessionToken,
    readGoogleOAuthStateCookie,
    setGoogleOAuthStateCookie,
    setSessionCookie,
    verifySessionToken
} from "../../session.js";
import {
    buildGoogleAuthUrl,
    exchangeCodeForTokens,
    fetchGoogleUserInfo,
    makeStateToken,
    readStateToken
} from "../../google.js";
import crypto from "node:crypto";

function getSessionSecret(): string {
    return process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-session-secret-change-me");
}

function getSessionMaxAgeSeconds(): number {
    return Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 30); // 30 days
}

function getUsername(req: any): string | null {
    // Try reading from header (set by middleware or client)
    const v = req.header("x-username");
    if (v) return String(v);

    // Try reading from cookie directly
    const secret = getSessionSecret();
    return getUserIdFromRequest(req, secret || undefined);
}

function eventTargets(): string[] {
    const raw = process.env.EVENT_TARGETS || "";
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function isDisabled(v: string | undefined): boolean {
    const t = String(v || "").trim().toLowerCase();
    return t === "0" || t === "false" || t === "no" || t === "off";
}

function allowDevUsernameLogin(): boolean {
    return process.env.NODE_ENV !== "production" && !isDisabled(process.env.ALLOW_DEV_USERNAME_LOGIN);
}

function safeFromPath(v: unknown): string {
    const s = String(v || "").trim();
    if (!s) return "/";
    if (!s.startsWith("/")) return "/";
    if (s.startsWith("//")) return "/";
    if (s.includes("\\")) return "/";
    return s;
}

export function registerRoutes(app: Express) {
    // Database Initialization (Alice & Initial Data)
    (async () => {
        try {
            await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "User" ("id", "name", "bio", "avatarUrl", "updatedAt") 
        VALUES ('alice', 'Alice', 'Leitora voraz.', '', CURRENT_TIMESTAMP)
      `);
            await (prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "UserCity" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
        );
      `);
            await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "UserCity" ("id", "userId", "city") VALUES 
        ('uc_1', 'alice', 'FORTALEZA'),
        ('uc_2', 'alice', 'BRASILIA')
      `);
        } catch (e) {
            console.error("[users database init error]", e);
        }
    })();

    // --- Auth Routes ---

    app.post("/login", async (req, res) => {
        // Dev-only login by username
        if (!allowDevUsernameLogin()) {
            return res.status(404).json({ error: "not found" });
        }

        const { username, cities } = LoginSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { id: username } });

        let user: any = existing;
        if (!existing) {
            user = await prisma.user.create({
                data: {
                    id: username,
                    name: username,
                    bio: "",
                    avatarUrl: "",
                    cities: {
                        create: (cities || []).map((city: string) => ({ city }))
                    }
                },
                include: { cities: true }
            });
        }

        if (!existing) {
            const env = makeEventEnvelope({ source: "users", type: "user.created", data: { id: user.id } });
            await publishEvent(env, eventTargets());
        }

        const secret = getSessionSecret();
        const maxAge = getSessionMaxAgeSeconds();
        if (secret) {
            const token = issueSessionToken(username, secret, maxAge);
            setSessionCookie(res, token, maxAge);
        }

        res.json({ token: username, user });
    });

    app.post("/logout", async (_req, res) => {
        clearSessionCookie(res);
        res.json({ ok: true });
    });

    // Google OAuth
    app.get("/auth/google/start", async (req, res) => {
        const clientId = String(process.env.GOOGLE_CLIENT_ID || "");
        const redirectUri = String(process.env.GOOGLE_REDIRECT_URI || "");
        if (!clientId || !redirectUri) {
            const from = safeFromPath(req.query.from);
            return res.redirect(`/login?error=google_not_configured&from=${encodeURIComponent(from)}`);
        }
        const secret = getSessionSecret();
        if (!secret) return res.redirect("/login?error=session_not_configured");

        const from = safeFromPath(req.query.from);
        const nonce = crypto.randomBytes(16).toString("base64url");
        setGoogleOAuthStateCookie(res, nonce, 10 * 60);
        const state = makeStateToken({ from, ts: Date.now(), nonce }, secret);
        res.redirect(buildGoogleAuthUrl({ clientId, redirectUri, state }));
    });

    app.get("/auth/google/callback", async (req, res) => {
        const clientId = String(process.env.GOOGLE_CLIENT_ID || "");
        const clientSecret = String(process.env.GOOGLE_CLIENT_SECRET || "");
        const redirectUri = String(process.env.GOOGLE_REDIRECT_URI || "");
        const code = String(req.query.code || "");
        const stateToken = String(req.query.state || "");
        const oauthErr = String(req.query.error || "");

        if (!clientId || !clientSecret || !redirectUri) return res.redirect("/login?error=google_not_configured");
        const secret = getSessionSecret();
        const maxAge = getSessionMaxAgeSeconds();
        if (!secret) return res.redirect("/login?error=session_not_configured");
        if (oauthErr) return res.redirect(`/login?error=${encodeURIComponent(`google_${oauthErr}`)}`);
        if (!code) return res.redirect("/login?error=google_missing_code");

        const state = readStateToken(stateToken, secret);
        const from = safeFromPath(state?.from);
        const cookieNonce = readGoogleOAuthStateCookie(req);
        clearGoogleOAuthStateCookie(res);
        const ts = Number(state?.ts || 0);
        const nonce = String(state?.nonce || "");
        const deltaMs = Date.now() - ts;
        if (!state || !ts || deltaMs < 0 || deltaMs > 10 * 60 * 1000) {
            return res.redirect("/login?error=google_invalid_state");
        }
        if (!cookieNonce || !nonce || cookieNonce !== nonce) {
            return res.redirect("/login?error=google_invalid_state");
        }

        try {
            const tokens = await exchangeCodeForTokens({ code, clientId, clientSecret, redirectUri });
            if (!tokens.access_token) return res.redirect(`/login?error=google_missing_access_token&from=${encodeURIComponent(from)}`);

            const info = await fetchGoogleUserInfo(tokens.access_token);
            if (!info?.sub) return res.redirect(`/login?error=google_missing_sub&from=${encodeURIComponent(from)}`);

            const userId = `g_${String(info.sub).replace(/[^a-zA-Z0-9_]/g, "")}`.slice(0, 32);
            if (userId.length < 3) return res.redirect(`/login?error=google_invalid_user_id&from=${encodeURIComponent(from)}`);

            // Ensure user exists (Upsert logic)
            let user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: userId,
                        name: String(info.name || userId).trim() || userId,
                        avatarUrl: String(info.picture || "").trim(),
                        bio: "",
                    }
                });
                const env = makeEventEnvelope({ source: "users", type: "user.created", data: { id: user.id } });
                await publishEvent(env, eventTargets());
            } else {
                // Only fill missing avatar, never overwrite valid existing one
                const googleAvatar = String(info.picture || "").trim();
                const newName = String(info.name || userId).trim() || userId;

                const updateData: any = {};
                // Only update avatar if the user currently has NO avatar
                if (googleAvatar && !user.avatarUrl) {
                    updateData.avatarUrl = googleAvatar;
                }

                // Only update name if it hasn't been changed from the default ID
                if (user.name === userId && newName !== userId) {
                    updateData.name = newName;
                }

                if (Object.keys(updateData).length > 0) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: updateData
                    });
                }
            }

            const token = issueSessionToken(userId, secret, maxAge);
            setSessionCookie(res, token, maxAge);
            res.redirect(from);
        } catch (e: any) {
            console.error(e);
            const msg = encodeURIComponent(String(e?.message || "google_oauth_error"));
            res.redirect(`/login?error=${msg}&from=${encodeURIComponent(from)}`);
        }
    });

    // --- User Routes ---

    app.get("/users", async (req, res) => {
        // Dev convenience endpoint (used by the web login screen).
        if (!allowDevUsernameLogin()) {
            return res.status(404).json({ error: "not found" });
        }

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

    // Alias for /dev/users to match legacy gateway route
    app.get("/dev/users", async (req, res) => {
        // Reuse the /users logic since it's the same handler ID essentially
        if (!allowDevUsernameLogin()) return res.status(404).json({ error: "not found" });
        // Delegate to the same logic as /users
        const q = String(req.query.q || "").trim();
        const users = await prisma.user.findMany({
            take: 50,
            orderBy: { updatedAt: "desc" },
            where: q ? { OR: [{ id: { contains: q } }, { name: { contains: q } }] } : undefined,
            select: { id: true, name: true, avatarUrl: true, coverUrl: true, createdAt: true, updatedAt: true, cities: { select: { city: true } } },
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
