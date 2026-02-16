-- Add coverUrl to users so Prisma's schema matches the SQLite database.
ALTER TABLE "User" ADD COLUMN "coverUrl" TEXT NOT NULL DEFAULT '';

