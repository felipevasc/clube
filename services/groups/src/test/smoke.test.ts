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

describe("groups smoke", () => {
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
    expect(res.body?.service).toBe("groups");

    // Only assert route registration here; calling it would require DB and a real HTTP server.
    const groupsHandler = findRouteHandler(app as any, "get", "/groups");
    expect(typeof groupsHandler).toBe("function");

    const groupHandler = findRouteHandler(app as any, "get", "/groups/:id");
    expect(typeof groupHandler).toBe("function");

    const membersHandler = findRouteHandler(app as any, "get", "/groups/:id/members");
    expect(typeof membersHandler).toBe("function");

    const meHandler = findRouteHandler(app as any, "get", "/groups/:id/me");
    expect(typeof meHandler).toBe("function");

    const joinHandler = findRouteHandler(app as any, "post", "/groups/:id/join");
    expect(typeof joinHandler).toBe("function");

    const leaveHandler = findRouteHandler(app as any, "post", "/groups/:id/leave");
    expect(typeof leaveHandler).toBe("function");

    const inviteHandler = findRouteHandler(app as any, "post", "/groups/:id/invite");
    expect(typeof inviteHandler).toBe("function");

    const rotateInviteHandler = findRouteHandler(app as any, "post", "/groups/:id/invite/rotate");
    expect(typeof rotateInviteHandler).toBe("function");

    const resolveInviteHandler = findRouteHandler(app as any, "get", "/invites/:inviteId");
    expect(typeof resolveInviteHandler).toBe("function");

    const acceptInviteHandler = findRouteHandler(app as any, "post", "/invites/:inviteId/accept");
    expect(typeof acceptInviteHandler).toBe("function");

    const declineInviteHandler = findRouteHandler(app as any, "post", "/invites/:inviteId/decline");
    expect(typeof declineInviteHandler).toBe("function");

    const bookOfMonthGetHandler = findRouteHandler(app as any, "get", "/groups/:id/book-of-month");
    expect(typeof bookOfMonthGetHandler).toBe("function");

    const bookOfMonthSetHandler = findRouteHandler(app as any, "post", "/groups/:id/book-of-month");
    expect(typeof bookOfMonthSetHandler).toBe("function");

    const clubBooksListHandler = findRouteHandler(app as any, "get", "/club-books");
    expect(typeof clubBooksListHandler).toBe("function");

    const clubBooksActiveHandler = findRouteHandler(app as any, "get", "/club-books/active");
    expect(typeof clubBooksActiveHandler).toBe("function");

    const clubBooksCreateHandler = findRouteHandler(app as any, "post", "/club-books");
    expect(typeof clubBooksCreateHandler).toBe("function");

    const clubBooksActivateHandler = findRouteHandler(app as any, "post", "/club-books/:id/activate");
    expect(typeof clubBooksActivateHandler).toBe("function");

    const clubBooksMessagesGetHandler = findRouteHandler(app as any, "get", "/club-books/:id/messages");
    expect(typeof clubBooksMessagesGetHandler).toBe("function");

    const clubBooksMessagesPostHandler = findRouteHandler(app as any, "post", "/club-books/:id/messages");
    expect(typeof clubBooksMessagesPostHandler).toBe("function");

    const clubBooksArtifactsGetHandler = findRouteHandler(app as any, "get", "/club-books/:id/artifacts");
    expect(typeof clubBooksArtifactsGetHandler).toBe("function");

    const clubBooksArtifactsPostHandler = findRouteHandler(app as any, "post", "/club-books/:id/artifacts");
    expect(typeof clubBooksArtifactsPostHandler).toBe("function");
  });
});
