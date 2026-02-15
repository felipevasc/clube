import { describe, expect, it, vi } from "vitest";
import express from "express";
import { makeApp } from "../http.js";
import { registerRoutes } from "../routes.js";

function findRouteHandler(app: any, method: string, path: string) {
  const stack = app?._router?.stack || [];
  for (const layer of stack) {
    const route = layer?.route;
    if (!route) continue;
    if (route.path !== path) continue;
    if (!route.methods?.[method.toLowerCase()]) continue;
    const h = route.stack?.[0]?.handle;
    if (typeof h === "function") return h;
  }
  return null;
}

function headerValue(h: any): string[] {
  if (!h) return [];
  if (Array.isArray(h)) return h.map(String);
  return [String(h)];
}

function pickSetCookie(setCookies: string[], name: string): string | null {
  for (const c of setCookies) {
    if (c.startsWith(`${name}=`)) return c;
  }
  return null;
}

function cookieValue(cookie: string, name: string): string {
  const m = cookie.match(new RegExp(`^${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]!) : "";
}

function restoreEnv(prevEnv: Record<string, string | undefined>) {
  for (const k of Object.keys(process.env)) {
    if (!(k in prevEnv)) delete (process.env as any)[k];
  }
  for (const [k, v] of Object.entries(prevEnv)) {
    (process.env as any)[k] = v;
  }
}

function makeMockRes() {
  const headers: Record<string, any> = {};
  const res: any = {
    statusCode: 200,
    headers,
    getHeader(name: string) {
      return headers[name];
    },
    setHeader(name: string, value: any) {
      headers[name] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(v: any) {
      this.body = v;
      return this;
    },
    redirect(url: string) {
      this.statusCode = 302;
      headers.location = url;
      return this;
    },
  };
  return res;
}

describe("gateway-api google oauth", () => {
  it("binds state to a temporary cookie and issues a session on callback", async () => {
    const prevEnv = { ...process.env };
    const prevFetch = globalThis.fetch;
    try {
      process.env.NODE_ENV = "test";
      process.env.SESSION_SECRET = "test-secret";
      process.env.SESSION_MAX_AGE_SECONDS = "3600";
      process.env.GOOGLE_CLIENT_ID = "cid";
      process.env.GOOGLE_CLIENT_SECRET = "csec";
      process.env.GOOGLE_REDIRECT_URI = "http://localhost:5173/api/auth/google/callback";
      process.env.USERS_URL = "http://users";

      globalThis.fetch = vi.fn(async (url: any, init: any) => {
        const u = String(url);
        const method = String(init?.method || "GET").toUpperCase();
        const usersBase = u.startsWith("http://users") ? "http://users" : u.startsWith("http://localhost:3001") ? "http://localhost:3001" : "";

        if (u === "https://oauth2.googleapis.com/token" && method === "POST") {
          return new Response(JSON.stringify({ access_token: "at" }), { status: 200 });
        }
        if (u === "https://openidconnect.googleapis.com/v1/userinfo" && method === "GET") {
          return new Response(JSON.stringify({ sub: "123", name: "Ana", picture: "http://pic" }), { status: 200 });
        }
        if (usersBase && u === `${usersBase}/login` && method === "POST") {
          return new Response(JSON.stringify({ token: "g_123", user: { id: "g_123" } }), { status: 200 });
        }
        if (usersBase && u === `${usersBase}/users/g_123` && method === "GET") {
          return new Response(JSON.stringify({ error: "user not found" }), { status: 404 });
        }
        if (usersBase && u === `${usersBase}/me` && method === "PUT") {
          return new Response(JSON.stringify({ user: { id: "g_123" } }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: `unhandled fetch ${method} ${u}` }), { status: 500 });
      }) as any;

      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const startHandler = findRouteHandler(app as any, "get", "/api/auth/google/start");
      expect(typeof startHandler).toBe("function");

      const startReq: any = { query: { from: "/" }, headers: {} };
      const startRes = makeMockRes();
      await startHandler(startReq, startRes);

      expect(startRes.statusCode).toBe(302);
      const googleUrl = String(startRes.headers.location || "");
      expect(googleUrl).toContain("accounts.google.com");

      const setCookies = headerValue(startRes.headers["Set-Cookie"]);
      const oauthCookie = pickSetCookie(setCookies, "clube_oauth_state");
      expect(oauthCookie).toBeTruthy();

      const state = new URL(googleUrl).searchParams.get("state") || "";
      expect(state).toBeTruthy();

      const nonce = cookieValue(oauthCookie!, "clube_oauth_state");
      const cbHandler = findRouteHandler(app as any, "get", "/api/auth/google/callback");
      expect(typeof cbHandler).toBe("function");

      const cbReq: any = {
        query: { code: "ok", state },
        headers: { cookie: `clube_oauth_state=${encodeURIComponent(nonce)}` },
      };
      const cbRes = makeMockRes();
      await cbHandler(cbReq, cbRes);

      expect(cbRes.statusCode).toBe(302);
      expect(String(cbRes.headers.location || "")).toBe("/");

      const cbCookies = headerValue(cbRes.headers["Set-Cookie"]);
      expect(pickSetCookie(cbCookies, "clube_session")).toBeTruthy();
      const cleared = pickSetCookie(cbCookies, "clube_oauth_state");
      expect(cleared).toBeTruthy();
      expect(String(cleared)).toContain("Max-Age=0");
    } finally {
      restoreEnv(prevEnv);
      globalThis.fetch = prevFetch as any;
    }
  });

  it("rejects callback when the state cookie is missing", async () => {
    const prevEnv = { ...process.env };
    const prevFetch = globalThis.fetch;
    try {
      process.env.NODE_ENV = "test";
      process.env.SESSION_SECRET = "test-secret";
      process.env.GOOGLE_CLIENT_ID = "cid";
      process.env.GOOGLE_CLIENT_SECRET = "csec";
      process.env.GOOGLE_REDIRECT_URI = "http://localhost:5173/api/auth/google/callback";

      // Callback must fail before fetch is used.
      globalThis.fetch = vi.fn(async () => {
        return new Response(JSON.stringify({ error: "unexpected fetch" }), { status: 500 });
      }) as any;

      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const startHandler = findRouteHandler(app as any, "get", "/api/auth/google/start");
      const startReq: any = { query: { from: "/" }, headers: {} };
      const startRes = makeMockRes();
      await startHandler(startReq, startRes);

      const googleUrl = String(startRes.headers.location || "");
      const state = new URL(googleUrl).searchParams.get("state") || "";

      const cbHandler = findRouteHandler(app as any, "get", "/api/auth/google/callback");
      const cbReq: any = { query: { code: "ok", state }, headers: {} };
      const cbRes = makeMockRes();
      await cbHandler(cbReq, cbRes);

      expect(cbRes.statusCode).toBe(302);
      expect(String(cbRes.headers.location || "")).toContain("/login?error=google_invalid_state");

      const cbCookies = headerValue(cbRes.headers["Set-Cookie"]);
      const cleared = pickSetCookie(cbCookies, "clube_oauth_state");
      expect(cleared).toBeTruthy();
      expect(String(cleared)).toContain("Max-Age=0");
    } finally {
      restoreEnv(prevEnv);
      globalThis.fetch = prevFetch as any;
    }
  });
});
