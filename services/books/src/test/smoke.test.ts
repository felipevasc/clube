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

describe("books smoke", () => {
  it("health + list", async () => {
    const app = makeApp();
    registerRoutes(app as unknown as express.Express);

    const healthHandler = findRouteHandler(app as any, "get", "/health");
    expect(typeof healthHandler).toBe("function");

    const res: any = {
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
    };
    await healthHandler({}, res);
    expect(res.statusCode).toBe(200);
    expect(res.body?.service).toBe("books");

    // Only assert route registration here; calling it would require DB and a real HTTP server.
    const booksHandler = findRouteHandler(app as any, "get", "/books");
    expect(typeof booksHandler).toBe("function");

    const bookHandler = findRouteHandler(app as any, "get", "/books/:id");
    expect(typeof bookHandler).toBe("function");

    const bookUpdateHandler = findRouteHandler(app as any, "put", "/books/:id");
    expect(typeof bookUpdateHandler).toBe("function");
  });
});
