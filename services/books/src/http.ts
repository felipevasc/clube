import express from "express";
import cors from "cors";

export function makeApp() {
  const app = express();

  // In some restricted environments (e.g. CI sandboxes), binding to 0.0.0.0 can fail with EPERM.
  // Supertest calls `app.listen(0)` when you pass it an express app, so force localhost for port 0.
  const origListen = app.listen.bind(app);
  (app as any).listen = (...args: any[]) => {
    const port = args[0];
    const hostOrCb = args[1];
    // If host omitted (or second arg is a callback) and port is ephemeral (0), force localhost.
    if (port === 0 && (hostOrCb == null || typeof hostOrCb === "function")) {
      return origListen(port, "127.0.0.1", hostOrCb);
    }
    return origListen(...args);
  };

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.get("/health", (_req, res) => res.json({ ok: true, service: "books" }));
  return app;
}
