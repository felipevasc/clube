import crypto from "node:crypto";

const COOKIE_NAME = "clube_session";
const OAUTH_STATE_COOKIE = "clube_oauth_state";

type SessionPayload = {
  sub: string;
  exp: number; // unix seconds
  v: 1;
};

function b64urlEncode(s: string): string {
  return Buffer.from(s, "utf8").toString("base64url");
}

function b64urlDecodeToString(s: string): string {
  return Buffer.from(s, "base64url").toString("utf8");
}

function signPart(part: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(part).digest("base64url");
}

function safeEq(a: string, b: string): boolean {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = String(header || "");
  if (!raw) return out;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (!k) continue;
    out[k] = decodeURIComponent(v);
  }
  return out;
}

function appendSetCookie(res: any, cookie: string) {
  const prev = res?.getHeader?.("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", [...prev, cookie]);
    return;
  }
  res.setHeader("Set-Cookie", [String(prev), cookie]);
}

export function issueSessionToken(userId: string, secret: string, maxAgeSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: userId, exp: now + maxAgeSeconds, v: 1 };
  const part = b64urlEncode(JSON.stringify(payload));
  const sig = signPart(part, secret);
  return `${part}.${sig}`;
}

export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const t = String(token || "");
  const [part, sig] = t.split(".");
  if (!part || !sig) return null;
  const expected = signPart(part, secret);
  if (!safeEq(sig, expected)) return null;
  let payload: SessionPayload;
  try {
    payload = JSON.parse(b64urlDecodeToString(part));
  } catch {
    return null;
  }
  if (!payload || payload.v !== 1) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) return null;
  if (!payload.sub) return null;
  return payload;
}

export function getUserIdFromRequest(req: any, secret: string | undefined): string | null {
  // Dev/backwards-compat: allow explicit header (used by some tests/clients).
  const headerU = req?.header?.("x-username");
  if (headerU) return String(headerU);

  if (!secret) return null;
  const cookies = parseCookies(req?.headers?.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const payload = verifySessionToken(token, secret);
  return payload?.sub || null;
}

function cookieAttrs(args?: { maxAgeSeconds?: number; path?: string }) {
  const parts = [
    `Path=${String(args?.path || "/")}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (typeof args?.maxAgeSeconds === "number")
    parts.push(`Max-Age=${Math.max(0, Math.floor(args.maxAgeSeconds))}`);
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function setSessionCookie(res: any, token: string, maxAgeSeconds: number) {
  appendSetCookie(res, `${COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieAttrs({ maxAgeSeconds, path: "/" })}`);
}

export function clearSessionCookie(res: any) {
  appendSetCookie(res, `${COOKIE_NAME}=; ${cookieAttrs({ maxAgeSeconds: 0, path: "/" })}`);
}

export function setGoogleOAuthStateCookie(res: any, nonce: string, maxAgeSeconds = 10 * 60) {
  // Bound to the OAuth callback path to reduce accidental leakage.
  appendSetCookie(
    res,
    `${OAUTH_STATE_COOKIE}=${encodeURIComponent(String(nonce || ""))}; ${cookieAttrs({
      maxAgeSeconds,
      path: "/api/auth/google",
    })}`
  );
}

export function readGoogleOAuthStateCookie(req: any): string | null {
  const cookies = parseCookies(req?.headers?.cookie);
  const v = cookies[OAUTH_STATE_COOKIE];
  return v ? String(v) : null;
}

export function clearGoogleOAuthStateCookie(res: any) {
  appendSetCookie(res, `${OAUTH_STATE_COOKIE}=; ${cookieAttrs({ maxAgeSeconds: 0, path: "/api/auth/google" })}`);
}
