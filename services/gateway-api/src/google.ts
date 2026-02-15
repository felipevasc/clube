import crypto from "node:crypto";

type GoogleTokens = {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  refresh_token?: string;
  scope?: string;
};

export type GoogleUserInfo = {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
};

function sign(part: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(part).digest("base64url");
}

function safeEq(a: string, b: string): boolean {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function makeStateToken(data: any, secret: string): string {
  const part = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  const sig = sign(part, secret);
  return `${part}.${sig}`;
}

export function readStateToken(token: string, secret: string): any | null {
  const [part, sig] = String(token || "").split(".");
  if (!part || !sig) return null;
  const expected = sign(part, secret);
  if (!safeEq(sig, expected)) return null;
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function buildGoogleAuthUrl(args: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: args.clientId,
    redirect_uri: args.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: args.state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(args: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<GoogleTokens> {
  const body = new URLSearchParams({
    code: args.code,
    client_id: args.clientId,
    client_secret: args.clientSecret,
    redirect_uri: args.redirectUri,
    grant_type: "authorization_code",
  });

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await resp.text();
  const json = text ? JSON.parse(text) : {};
  if (!resp.ok) {
    const msg = String(json?.error_description || json?.error || resp.statusText || "oauth error");
    const err: any = new Error(msg);
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json as GoogleTokens;
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const resp = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  const text = await resp.text();
  const json = text ? JSON.parse(text) : {};
  if (!resp.ok) {
    const msg = String(json?.error_description || json?.error || resp.statusText || "userinfo error");
    const err: any = new Error(msg);
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json as GoogleUserInfo;
}

