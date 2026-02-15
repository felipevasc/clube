import { describe, expect, it } from "vitest";
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

describe("users smoke", () => {
  it("health + login", async () => {
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    try {
      const app = makeApp();
      registerRoutes(app as unknown as express.Express);

      const mkRes = () =>
        ({
          statusCode: 200,
          body: null as any,
          status(code: number) {
            this.statusCode = code;
            return this;
          },
          json(v: any) {
            this.body = v;
            return this;
          },
        }) as any;

      const healthHandler = findRouteHandler(app as any, "get", "/health");
      expect(typeof healthHandler).toBe("function");
      const healthRes = mkRes();
      await healthHandler({}, healthRes);
      expect(healthRes.statusCode).toBe(200);
      expect(healthRes.body?.ok).toBe(true);

      const loginHandler = findRouteHandler(app as any, "post", "/login");
      expect(typeof loginHandler).toBe("function");
      const loginRes = mkRes();
      await loginHandler({ body: { username: "bob" }, header: () => null }, loginRes);
      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body?.token).toBe("bob");

      const listHandler = findRouteHandler(app as any, "get", "/users");
      expect(typeof listHandler).toBe("function");
      const listRes = mkRes();
      await listHandler({ query: {}, header: () => null }, listRes);
      expect(listRes.statusCode).toBe(200);
      expect(Array.isArray(listRes.body?.users)).toBe(true);
      expect(listRes.body.users.some((u: any) => u.id === "bob")).toBe(true);
    } finally {
      process.env.NODE_ENV = prevEnv;
    }
  });
});
