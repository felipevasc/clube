import express from "express";
import cors from "cors";

export function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "users" }));

  return app;
}

