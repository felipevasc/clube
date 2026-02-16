import express from "express";
import cors from "cors";
import { registerRoutes as registerUserRoutes } from "./modules/users/routes.js";
import { registerRoutes as registerBookRoutes } from "./modules/books/routes.js";
import { registerRoutes as registerGroupRoutes } from "./modules/groups/routes.js";
import { registerRoutes as registerFeedRoutes } from "./modules/feed/routes.js";
import { registerRoutes as registerUploadRoutes } from "./modules/uploads/routes.js";
import { getUserIdFromRequest } from "./session.js";

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
    if (!req.headers["x-username"]) {
        const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-session-secret-change-me");
        const userId = getUserIdFromRequest(req, secret);
        if (userId) {
            req.headers["x-username"] = userId;
        }
    }
    next();
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Check if we are running behind a proxy that sends /api prefix
const apiRouter = express.Router();

// Register modules on the router
registerUserRoutes(apiRouter as any);
registerBookRoutes(apiRouter as any);
registerGroupRoutes(apiRouter as any);
registerFeedRoutes(apiRouter as any);
registerUploadRoutes(apiRouter as any);

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
