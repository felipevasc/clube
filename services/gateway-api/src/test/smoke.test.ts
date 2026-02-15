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

describe("gateway-api smoke", () => {
  it("health", async () => {
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
    expect(res.body?.service).toBe("gateway-api");

    // Route registration smoke (invite flow).
    const groupInviteHandler = findRouteHandler(app as any, "post", "/api/groups/:id/invite");
    expect(typeof groupInviteHandler).toBe("function");

    const groupInviteRotateHandler = findRouteHandler(app as any, "post", "/api/groups/:id/invite/rotate");
    expect(typeof groupInviteRotateHandler).toBe("function");

    const resolveInviteHandler = findRouteHandler(app as any, "get", "/api/invites/:inviteId");
    expect(typeof resolveInviteHandler).toBe("function");

    const acceptInviteHandler = findRouteHandler(app as any, "post", "/api/invites/:inviteId/accept");
    expect(typeof acceptInviteHandler).toBe("function");

    const declineInviteHandler = findRouteHandler(app as any, "post", "/api/invites/:inviteId/decline");
    expect(typeof declineInviteHandler).toBe("function");

    const bookOfMonthGetHandler = findRouteHandler(app as any, "get", "/api/groups/:id/book-of-month");
    expect(typeof bookOfMonthGetHandler).toBe("function");

    const bookOfMonthSetHandler = findRouteHandler(app as any, "post", "/api/groups/:id/book-of-month");
    expect(typeof bookOfMonthSetHandler).toBe("function");

    const bookHandler = findRouteHandler(app as any, "get", "/api/books/:id");
    expect(typeof bookHandler).toBe("function");

    const bookUpdateHandler = findRouteHandler(app as any, "put", "/api/books/:id");
    expect(typeof bookUpdateHandler).toBe("function");

    const clubBooksHandler = findRouteHandler(app as any, "get", "/api/club-books");
    expect(typeof clubBooksHandler).toBe("function");

    const clubBooksActiveHandler = findRouteHandler(app as any, "get", "/api/club-books/active");
    expect(typeof clubBooksActiveHandler).toBe("function");

    const clubBooksCreateHandler = findRouteHandler(app as any, "post", "/api/club-books");
    expect(typeof clubBooksCreateHandler).toBe("function");

    const clubBooksActivateHandler = findRouteHandler(app as any, "post", "/api/club-books/:id/activate");
    expect(typeof clubBooksActivateHandler).toBe("function");
  });
});
