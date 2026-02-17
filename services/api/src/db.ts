import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const databaseUrl = String(process.env.DATABASE_URL || "").trim();
const tursoToken = String(process.env.TURSO_AUTH_TOKEN || "").trim();

const adapter = databaseUrl.startsWith("libsql://")
    ? new PrismaLibSQL({
        url: databaseUrl,
        authToken: tursoToken || undefined,
    })
    : undefined;

export const prisma = new PrismaClient({
    log: ["warn", "error"],
    adapter,
});
