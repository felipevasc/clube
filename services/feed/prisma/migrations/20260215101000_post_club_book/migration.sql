PRAGMA foreign_keys=OFF;

-- Add optional reference to the Livro do mes (ClubBook).
ALTER TABLE "Post" ADD COLUMN "clubBookId" TEXT;

-- CreateIndex
CREATE INDEX "Post_clubBookId_idx" ON "Post"("clubBookId");

PRAGMA foreign_keys=ON;

