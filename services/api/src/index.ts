import express from "express";
import cors from "cors";
import { registerRoutes as registerUserRoutes } from "./modules/users/routes.js";
import { registerRoutes as registerBookRoutes } from "./modules/books/routes.js";
import { registerRoutes as registerGroupRoutes } from "./modules/groups/routes.js";
import { registerRoutes as registerFeedRoutes } from "./modules/feed/routes.js";
import { registerRoutes as registerEventRoutes } from "./modules/events/routes.js";
import { registerRoutes as registerUploadRoutes } from "./modules/uploads/routes.js";
import { registerRoutes as registerAiRoutes } from "./modules/ai/routes.js";
import { getUserIdFromRequest } from "./session.js";
import fs from "node:fs";
import path from "node:path";

// Inline .env loader to avoid ESM/import issues with shared modules
function loadEnv() {
    const rootEnv = path.resolve(process.cwd(), "../../.env");
    const localEnv = path.resolve(process.cwd(), ".env");
    const envPath = fs.existsSync(rootEnv) ? rootEnv : (fs.existsSync(localEnv) ? localEnv : null);
    const preferFileValues = process.env.NODE_ENV !== "production";

    const maskedTail = (value: string | undefined) => {
        if (!value) return "<empty>";
        return `...${value.slice(-4)}`;
    };

    if (envPath) {
        console.log(`Loading env from ${envPath}`);
        const content = fs.readFileSync(envPath, "utf8");
        for (const line of content.split("\n")) {
            const t = line.trim();
            if (!t || t.startsWith("#")) continue;
            const idx = t.indexOf("=");
            if (idx <= 0) continue;
            const key = t.slice(0, idx).trim();
            let val = t.slice(idx + 1).trim();
            if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }

            const previous = process.env[key];
            if (preferFileValues || previous === undefined) {
                if (preferFileValues && previous !== undefined && previous !== val) {
                    console.warn(
                        `[env] Overriding ${key} from process env ${maskedTail(previous)} to file value ${maskedTail(val)}`
                    );
                }
                process.env[key] = val;
            }
        }
    }
}

loadEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Auth Middleware: Populates x-username from session cookie if not present
app.use((req, res, next) => {
    const existing = req.headers["x-username"];
    if (existing) {
        req.headers["x-username"] = String(existing).toLowerCase();
    } else {
        const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-session-secret-change-me");
        const userId = getUserIdFromRequest(req, secret);
        if (userId) {
            req.headers["x-username"] = userId.toLowerCase();
        }
    }
    next();
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Check if we are running behind a proxy that sends /api prefix
const apiRouter = express.Router();

// Express 4 async handler wrapper
const ah = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Wrap router methods to handle async errors automatically
const methods = ["get", "post", "put", "delete", "patch"] as const;
methods.forEach(m => {
    const orig = (apiRouter as any)[m].bind(apiRouter);
    (apiRouter as any)[m] = (path: string, ...handlers: any[]) => {
        const wrapped = handlers.map(h => typeof h === "function" ? ah(h) : h);
        return orig(path, ...wrapped);
    };
});

// Register modules on the router
registerUserRoutes(apiRouter as any);
registerBookRoutes(apiRouter as any);
registerGroupRoutes(apiRouter as any);
registerFeedRoutes(apiRouter as any);
registerUploadRoutes(apiRouter as any);
registerEventRoutes(apiRouter as any);
registerAiRoutes(apiRouter as any);

// Mount at /api
app.use("/api", apiRouter);

// Also mount at / for convenience/compatibility if accessed directly without proxy
app.use("/", apiRouter);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
