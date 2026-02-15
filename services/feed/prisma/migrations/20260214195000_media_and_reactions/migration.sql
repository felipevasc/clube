PRAGMA foreign_keys=OFF;

-- Add optional media to posts.
ALTER TABLE "Post" ADD COLUMN "imageUrl" TEXT;

-- Upgrade Like -> Reaction (keep table name for compatibility).
-- SQLite does not allow adding a column with a non-constant default (CURRENT_TIMESTAMP),
-- so we rebuild the table.
CREATE TABLE "Like_new" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'like',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Like_new_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Like_new" ("id", "postId", "userId", "type", "createdAt")
SELECT "id", "postId", "userId", 'like', CURRENT_TIMESTAMP FROM "Like";

DROP TABLE "Like";
ALTER TABLE "Like_new" RENAME TO "Like";

-- Recreate indexes from the initial migration (+ the new composite index).
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId","userId");
CREATE INDEX "Like_userId_idx" ON "Like"("userId");
CREATE INDEX "Like_postId_type_idx" ON "Like"("postId","type");

PRAGMA foreign_keys=ON;
