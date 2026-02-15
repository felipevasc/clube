import type { Express } from "express";
import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { ClubBookCreateInputSchema, makeEventEnvelope, publishEvent } from "@clube/shared";
import { httpJson } from "./client.js";
import { BOOKS_URL, EVENT_TARGETS, FEED_URL, GROUPS_URL, USERS_URL } from "./env.js";
import {
  clearGoogleOAuthStateCookie,
  clearSessionCookie,
  getUserIdFromRequest,
  issueSessionToken,
  readGoogleOAuthStateCookie,
  setGoogleOAuthStateCookie,
  setSessionCookie,
} from "./session.js";
import {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  makeStateToken,
  readStateToken,
} from "./google.js";

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-session-secret-change-me");
}

function getSessionMaxAgeSeconds(): number {
  return Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 30); // 30 days
}

function authHeaders(req: any): Record<string, string> {
  const secret = getSessionSecret();
  const u = getUserIdFromRequest(req, secret || undefined);
  return u ? { "x-username": String(u) } : {};
}

function safeFromPath(v: unknown): string {
  const s = String(v || "").trim();
  if (!s) return "/";
  if (!s.startsWith("/")) return "/";
  if (s.startsWith("//")) return "/";
  if (s.includes("\\")) return "/";
  return s;
}

function isDisabled(v: string | undefined): boolean {
  const t = String(v || "").trim().toLowerCase();
  return t === "0" || t === "false" || t === "no" || t === "off";
}

function allowDevUsernameLogin(): boolean {
  // Default: enabled in non-production; can be explicitly disabled via env.
  return process.env.NODE_ENV !== "production" && !isDisabled(process.env.ALLOW_DEV_USERNAME_LOGIN);
}

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
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function safeFileName(v: unknown): string {
  const raw = String(v || "").trim();
  if (!raw) return "arquivo";
  const base = path.basename(raw).replace(/[^\w.\- ()[\]]+/g, "_").trim();
  return base.slice(0, 120) || "arquivo";
}

function mimeToExt(mime: string): string | null {
  const m = String(mime || "").toLowerCase();
  if (m === "image/jpeg") return "jpg";
  if (m === "image/png") return "png";
  if (m === "image/webp") return "webp";
  if (m === "image/gif") return "gif";
  if (m === "application/pdf") return "pdf";
  if (m === "application/zip") return "zip";
  if (m === "application/x-zip-compressed") return "zip";
  if (m === "text/plain") return "txt";
  if (m === "text/markdown") return "md";
  return null;
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

  app.post("/api/login", async (req, res) => {
    // Dev-only login by username. Never enable this in production.
    if (!allowDevUsernameLogin()) {
      return res.status(404).json({ error: "not found" });
    }
    const out = await httpJson("POST", `${USERS_URL}/login`, req.body);
    const secret = getSessionSecret();
    const maxAge = getSessionMaxAgeSeconds();
    if (!secret) return res.status(500).json({ error: "SESSION_SECRET not configured" });
    const token = issueSessionToken(String(out?.token || ""), secret, maxAge);
    setSessionCookie(res, token, maxAge);
    res.json(out);
  });

  app.get("/api/dev/users", async (req, res) => {
    // Dev-only: list users for quick local login UX.
    if (!allowDevUsernameLogin()) {
      return res.status(404).json({ error: "not found" });
    }
    const q = String(req.query.q || "").trim();
    const limit = String(req.query.limit || "").trim();
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (limit) qs.set("limit", limit);
    const url = `${USERS_URL}/users${qs.toString() ? `?${qs.toString()}` : ""}`;
    const out = await httpJson("GET", url);
    res.json(out);
  });

  app.post("/api/logout", async (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  // Media upload (stores on disk; returns a same-origin URL under /api/media/*).
  app.post(
    "/api/uploads",
    express.raw({ type: "*/*", limit: "25mb" }),
    async (req, res) => {
    const secret = getSessionSecret();
    const userId = getUserIdFromRequest(req, secret || undefined);
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const mime = String(req.headers["content-type"] || "");
    const buf: any = (req as any).body;
    if (!buf || !(buf instanceof Buffer) || buf.length === 0) return res.status(400).json({ error: "missing body" });

    const ext = mimeToExt(mime) || "bin";
    const key = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
    const dst = path.join(UPLOAD_DIR, key);
    await fsp.writeFile(dst, buf);

    const fileName = safeFileName(req.headers["x-file-name"] || "");
    res.status(201).json({
      key,
      url: `/api/media/${encodeURIComponent(key)}`,
      mime,
      size: Number(buf.length || 0),
      fileName,
    });
    }
  );

  app.get("/api/media/:key", async (req, res) => {
    const key = path.basename(String(req.params.key || ""));
    if (!key) return res.status(404).end();
    const p = path.join(UPLOAD_DIR, key);
    if (!fs.existsSync(p)) return res.status(404).end();

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    const download = String(req.query.download || "") === "1";
    const name = safeFileName(req.query.name || "");
    if (download) {
      res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    } else {
      res.setHeader("Content-Disposition", "inline");
    }
    res.sendFile(p);
  });

  app.get("/api/auth/google/start", async (req, res) => {
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

  app.get("/api/auth/google/callback", async (req, res) => {
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

      // Ensure user exists, then enrich profile (without overwriting existing bio).
      await httpJson("POST", `${USERS_URL}/login`, { username: userId });
      let existing: any = null;
      try {
        existing = await httpJson("GET", `${USERS_URL}/users/${encodeURIComponent(userId)}`);
      } catch {
        existing = null;
      }

      const currentUser = existing?.user || {};
      const name = String(info.name || currentUser.name || userId).trim() || userId;
      const avatarUrl = String(info.picture || currentUser.avatarUrl || "").trim();
      const bio = String(currentUser.bio || "").trim();
      await httpJson("PUT", `${USERS_URL}/me`, { name, bio, avatarUrl }, { "x-username": userId });

      const token = issueSessionToken(userId, secret, maxAge);
      setSessionCookie(res, token, maxAge);
      res.redirect(from);
    } catch (e: any) {
      const msg = encodeURIComponent(String(e?.message || "google_oauth_error"));
      res.redirect(`/login?error=${msg}&from=${encodeURIComponent(from)}`);
    }
  });

  app.get("/api/me", async (req, res) => {
    const out = await httpJson("GET", `${USERS_URL}/me`, undefined, authHeaders(req));
    res.json(out);
  });

  app.put("/api/me", async (req, res) => {
    const out = await httpJson("PUT", `${USERS_URL}/me`, req.body, authHeaders(req));
    res.json(out);
  });

  app.get("/api/users/:id", async (req, res) => {
    const out = await httpJson("GET", `${USERS_URL}/users/${encodeURIComponent(String(req.params.id))}`);
    res.json(out);
  });

  app.get("/api/books", async (req, res) => {
    const q = req.query.q ? `?q=${encodeURIComponent(String(req.query.q))}` : "";
    const out = await httpJson("GET", `${BOOKS_URL}/books${q}`);
    res.json(out);
  });

  app.get("/api/books/:id", async (req, res) => {
    const out = await httpJson("GET", `${BOOKS_URL}/books/${encodeURIComponent(String(req.params.id))}`);
    res.json(out);
  });

  app.post("/api/books", async (req, res) => {
    const out = await httpJson("POST", `${BOOKS_URL}/books`, req.body, authHeaders(req));
    res.status(201).json(out);
  });

  app.put("/api/books/:id", async (req, res) => {
    const out = await httpJson(
      "PUT",
      `${BOOKS_URL}/books/${encodeURIComponent(String(req.params.id))}`,
      req.body,
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/groups", async (_req, res) => {
    const req = _req;
    const out = await httpJson("GET", `${GROUPS_URL}/groups`, undefined, authHeaders(req));
    res.json(out);
  });

  app.post("/api/groups", async (req, res) => {
    const out = await httpJson("POST", `${GROUPS_URL}/groups`, req.body, authHeaders(req));
    res.status(201).json(out);
  });

  app.get("/api/groups/:id", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/groups/:id/me", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/me`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/join", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/join`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/leave", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/leave`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/groups/:id/members", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/members`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/groups/:id/requests", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/requests`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/requests/:requestId/approve", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/requests/${encodeURIComponent(
        String(req.params.requestId)
      )}/approve`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/requests/:requestId/reject", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/requests/${encodeURIComponent(
        String(req.params.requestId)
      )}/reject`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/invite", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/invite`,
      {},
      authHeaders(req)
    );
    const status = Number(out?.status === "created" ? 201 : 200);
    res.status(status).json(out);
  });

  app.post("/api/groups/:id/invite/rotate", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/invite/rotate`,
      {},
      authHeaders(req)
    );
    res.status(201).json(out);
  });

  app.get("/api/invites/:inviteId", async (req, res) => {
    const out = await httpJson("GET", `${GROUPS_URL}/invites/${encodeURIComponent(String(req.params.inviteId))}`);
    res.json(out);
  });

  app.post("/api/invites/:inviteId/accept", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/invites/${encodeURIComponent(String(req.params.inviteId))}/accept`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/invites/:inviteId/decline", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/invites/${encodeURIComponent(String(req.params.inviteId))}/decline`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/groups/:id/book-of-month", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/book-of-month`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/groups/:id/book-of-month", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/groups/${encodeURIComponent(String(req.params.id))}/book-of-month`,
      req.body,
      authHeaders(req)
    );
    res.status(201).json(out);
  });

  // Livro do mes (club books)
  app.get("/api/club-books", async (req, res) => {
    const out = await httpJson("GET", `${GROUPS_URL}/club-books`, undefined, authHeaders(req));
    res.json(out);
  });

  app.get("/api/club-books/active", async (req, res) => {
    const out = await httpJson("GET", `${GROUPS_URL}/club-books/active`, undefined, authHeaders(req));
    res.json(out);
  });

  app.post("/api/club-books", async (req, res) => {
    const usernameHeaders = authHeaders(req);
    const input = ClubBookCreateInputSchema.parse(req.body);
    const bOut = await httpJson("GET", `${BOOKS_URL}/books/${encodeURIComponent(String(input.bookId))}`);
    const b = bOut?.book;
    if (!b) return res.status(404).json({ error: "book not found" });

    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/club-books`,
      {
        bookId: String(input.bookId),
        title: String(b.title || ""),
        author: String(b.author || ""),
        colorKey: String(input.colorKey),
        isActive: !!input.isActive,
      },
      usernameHeaders
    );
    res.status(201).json(out);
  });

  app.post("/api/club-books/:id/activate", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/club-books/${encodeURIComponent(String(req.params.id))}/activate`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.get("/api/club-books/:id/messages", async (req, res) => {
    const qs = new URLSearchParams();
    if (req.query.after) qs.set("after", String(req.query.after));
    if (req.query.limit) qs.set("limit", String(req.query.limit));
    if (req.query.order) qs.set("order", String(req.query.order));
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/club-books/${encodeURIComponent(String(req.params.id))}/messages${qs.toString() ? `?${qs.toString()}` : ""}`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/club-books/:id/messages", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/club-books/${encodeURIComponent(String(req.params.id))}/messages`,
      req.body,
      authHeaders(req)
    );
    res.status(201).json(out);
  });

  app.get("/api/club-books/:id/artifacts", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${GROUPS_URL}/club-books/${encodeURIComponent(String(req.params.id))}/artifacts`,
      undefined,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/club-books/:id/artifacts", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${GROUPS_URL}/club-books/${encodeURIComponent(String(req.params.id))}/artifacts`,
      req.body,
      authHeaders(req)
    );
    res.status(201).json(out);
  });

  // Feed (agregado: anexa perfis basicos).
  app.get("/api/feed", async (_req, res) => {
    const req = _req as any;
    const qs = new URLSearchParams();
    if (req.query?.clubBookId) qs.set("clubBookId", String(req.query.clubBookId));
    const out = await httpJson("GET", `${FEED_URL}/feed${qs.toString() ? `?${qs.toString()}` : ""}`, undefined, authHeaders(req));
    const posts = out.posts || [];
    const userIds = Array.from(
      new Set(
        posts
          .flatMap((p: any) => [p.userId, ...(Array.isArray(p.comments) ? p.comments.map((c: any) => c.userId) : [])])
          .filter(Boolean)
      )
    );
    const usersEntries = await Promise.all(
      userIds.map(async (id: string) => {
        try {
          const u = await httpJson("GET", `${USERS_URL}/users/${encodeURIComponent(id)}`);
          return [id, u.user] as const;
        } catch {
          return [id, null] as const;
        }
      })
    );
    const usersById = Object.fromEntries(usersEntries);

    const clubBookIds = Array.from(new Set(posts.map((p: any) => String(p.clubBookId || "")).filter(Boolean)));
    const clubBooksOut =
      clubBookIds.length === 0
        ? { clubBooks: [] }
        : await httpJson("POST", `${GROUPS_URL}/club-books/resolve`, { ids: clubBookIds }, authHeaders(req));
    const clubBooksById = Object.fromEntries(
      (clubBooksOut?.clubBooks || []).map((b: any) => [
        String(b.id),
        { id: String(b.id), title: String(b.title || ""), author: String(b.author || ""), colorKey: String(b.colorKey || "") },
      ])
    );
    res.json({
      posts: posts.map((p: any) => ({
        ...p,
        user: usersById[p.userId] || { id: p.userId, name: p.userId },
        clubBook: p.clubBookId ? clubBooksById[String(p.clubBookId)] || null : null,
        comments: Array.isArray(p.comments)
          ? p.comments.map((c: any) => ({ ...c, user: usersById[c.userId] || { id: c.userId, name: c.userId } }))
          : [],
      })),
    });
  });

  app.get("/api/posts/:id", async (req, res) => {
    const out = await httpJson(
      "GET",
      `${FEED_URL}/posts/${encodeURIComponent(String(req.params.id))}`,
      undefined,
      authHeaders(req)
    );
    const post = out.post;
    if (!post) return res.status(404).json({ error: "post not found" });

    const commentUserIds = Array.isArray(post.comments) ? post.comments.map((c: any) => c.userId) : [];
    const userIds = Array.from(new Set([post.userId, ...commentUserIds])).filter(Boolean);
    const usersEntries = await Promise.all(
      userIds.map(async (id: string) => {
        try {
          const u = await httpJson("GET", `${USERS_URL}/users/${encodeURIComponent(id)}`);
          return [id, u.user] as const;
        } catch {
          return [id, null] as const;
        }
      })
    );
    const usersById = Object.fromEntries(usersEntries);

    const cbId = String(post.clubBookId || "");
    const clubBookOut =
      cbId
        ? await httpJson("POST", `${GROUPS_URL}/club-books/resolve`, { ids: [cbId] }, authHeaders(req)).catch(() => null)
        : null;
    const cb = clubBookOut?.clubBooks?.[0]
      ? {
          id: String(clubBookOut.clubBooks[0].id),
          title: String(clubBookOut.clubBooks[0].title || ""),
          author: String(clubBookOut.clubBooks[0].author || ""),
          colorKey: String(clubBookOut.clubBooks[0].colorKey || ""),
        }
      : null;

    res.json({
      post: {
        ...post,
        user: usersById[post.userId] || { id: post.userId, name: post.userId },
        clubBook: cbId ? cb : null,
        comments: Array.isArray(post.comments)
          ? post.comments.map((c: any) => ({ ...c, user: usersById[c.userId] || { id: c.userId, name: c.userId } }))
          : [],
      },
    });
  });

  app.post("/api/posts", async (req, res) => {
    const headers = authHeaders(req);
    const body: any = req.body || {};
    const hasClubBookId = String(body?.clubBookId || "").trim().length > 0;
    if (!hasClubBookId) {
      try {
        const active = await httpJson("GET", `${GROUPS_URL}/club-books/active`, undefined, headers);
        const cb = active?.clubBook;
        if (cb?.id) body.clubBookId = String(cb.id);
      } catch {
        // If club service is down or no active book, keep it empty.
      }
    }
    const out = await httpJson("POST", `${FEED_URL}/posts`, body, headers);
    res.status(201).json(out);
  });

  app.post("/api/posts/:id/like", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${FEED_URL}/posts/${encodeURIComponent(String(req.params.id))}/like`,
      {},
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/posts/:id/react", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${FEED_URL}/posts/${encodeURIComponent(String(req.params.id))}/react`,
      req.body,
      authHeaders(req)
    );
    res.json(out);
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    const out = await httpJson(
      "POST",
      `${FEED_URL}/posts/${encodeURIComponent(String(req.params.id))}/comments`,
      req.body,
      authHeaders(req)
    );
    res.status(201).json(out);
  });

  app.post("/internal/events/publish", async (req, res) => {
    const env = makeEventEnvelope({ source: "gateway-api", type: String(req.body?.type || "event"), data: req.body?.data });
    await publishEvent(env, EVENT_TARGETS);
    res.json({ ok: true, targets: EVENT_TARGETS.length });
  });

  // Basic error mapper for httpJson
  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = Number(err?.status || 500);
    res.status(status).json(err?.body || { error: err?.message || "internal error" });
  });
}
