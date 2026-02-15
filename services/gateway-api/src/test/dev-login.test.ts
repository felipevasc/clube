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

describe("gateway-api dev login", () => {
  it("allows username login in non-production by default and issues session cookie", async () => {
    const prevEnv = { ...process.env };
    const prevFetch = globalThis.fetch;
    try {
      process.env.NODE_ENV = "test";
      process.env.SESSION_SECRET = "test-secret";
      process.env.SESSION_MAX_AGE_SECONDS = "3600";
      process.env.USERS_URL = "http://users";

      globalThis.fetch = vi.fn(async (url: any, init: any) => {
        const u = String(url);
        const method = String(init?.method || "GET").toUpperCase();
        const usersBase = u.startsWith("http://users")
          ? "http://users"
          : u.startsWith("http://localhost:3001")
            ? "http://localhost:3001"
            : "";
        if (usersBase && u === `${usersBase}/login` && method === "POST") {
          return new Response(JSON.stringify({ token: "bob", user: { id: "bob" } }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: `unhandled fetch ${method} ${u}` }), { status: 500 });
      }) as any;

      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const loginHandler = findRouteHandler(app as any, "post", "/api/login");
      expect(typeof loginHandler).toBe("function");

      const req: any = { body: { username: "bob" }, headers: {} };
      const res = makeMockRes();
      await loginHandler(req, res);

      expect(res.statusCode).toBe(200);
      const setCookies = headerValue(res.headers["Set-Cookie"]);
      expect(pickSetCookie(setCookies, "clube_session")).toBeTruthy();
    } finally {
      restoreEnv(prevEnv);
      globalThis.fetch = prevFetch as any;
    }
  });

  it("lists users via /api/dev/users in non-production", async () => {
    const prevEnv = { ...process.env };
    const prevFetch = globalThis.fetch;
    try {
      process.env.NODE_ENV = "test";
      process.env.USERS_URL = "http://users";

      globalThis.fetch = vi.fn(async (url: any, init: any) => {
        const u = String(url);
        const method = String(init?.method || "GET").toUpperCase();
        const usersBase = u.startsWith("http://users")
          ? "http://users"
          : u.startsWith("http://localhost:3001")
            ? "http://localhost:3001"
            : "";
        if (usersBase && u === `${usersBase}/users` && method === "GET") {
          return new Response(JSON.stringify({ users: [{ id: "bob", name: "Bob" }] }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: `unhandled fetch ${method} ${u}` }), { status: 500 });
      }) as any;

      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const listHandler = findRouteHandler(app as any, "get", "/api/dev/users");
      expect(typeof listHandler).toBe("function");

      const req: any = { query: {}, headers: {} };
      const res = makeMockRes();
      await listHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body?.users)).toBe(true);
      expect(res.body.users[0]?.id).toBe("bob");
    } finally {
      restoreEnv(prevEnv);
      globalThis.fetch = prevFetch as any;
    }
  });

  it("disables dev routes in production", async () => {
    const prevEnv = { ...process.env };
    try {
      process.env.NODE_ENV = "production";
      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const loginHandler = findRouteHandler(app as any, "post", "/api/login");
      const listHandler = findRouteHandler(app as any, "get", "/api/dev/users");
      expect(typeof loginHandler).toBe("function");
      expect(typeof listHandler).toBe("function");

      const loginRes = makeMockRes();
      await loginHandler({ body: { username: "bob" }, headers: {} }, loginRes);
      expect(loginRes.statusCode).toBe(404);

      const listRes = makeMockRes();
      await listHandler({ query: {}, headers: {} }, listRes);
      expect(listRes.statusCode).toBe(404);
    } finally {
      restoreEnv(prevEnv);
    }
  });
});
