import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import path from "node:path";

const databaseUrl = String(process.env.DATABASE_URL || "").trim();
const tursoToken = String(process.env.TURSO_AUTH_TOKEN || "").trim();

const useLibSql = databaseUrl.startsWith("libsql://");

const adapter = useLibSql
    ? new PrismaLibSQL({
        url: databaseUrl,
        authToken: tursoToken || undefined,
    })
    : null;

const datasourceUrl = !useLibSql
    ? (databaseUrl || `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`)
    : undefined;

export const prisma = new PrismaClient({
    log: ["warn", "error"],
    adapter,
    ...(datasourceUrl ? { datasourceUrl } : {}),
});
