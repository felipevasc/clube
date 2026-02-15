PRAGMA foreign_keys=OFF;

-- CreateTable
CREATE TABLE "ClubBook" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "bookId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "colorKey" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "activatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "ClubBookMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clubBookId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClubBookMessage_clubBookId_fkey" FOREIGN KEY ("clubBookId") REFERENCES "ClubBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClubBookArtifact" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clubBookId" TEXT NOT NULL,
  "uploadedByUserId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClubBookArtifact_clubBookId_fkey" FOREIGN KEY ("clubBookId") REFERENCES "ClubBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ClubBook_createdAt_idx" ON "ClubBook"("createdAt");

-- CreateIndex
CREATE INDEX "ClubBook_isActive_idx" ON "ClubBook"("isActive");

-- CreateIndex
CREATE INDEX "ClubBookMessage_clubBookId_createdAt_idx" ON "ClubBookMessage"("clubBookId","createdAt");

-- CreateIndex
CREATE INDEX "ClubBookMessage_userId_idx" ON "ClubBookMessage"("userId");

-- CreateIndex
CREATE INDEX "ClubBookArtifact_clubBookId_createdAt_idx" ON "ClubBookArtifact"("clubBookId","createdAt");

-- CreateIndex
CREATE INDEX "ClubBookArtifact_uploadedByUserId_idx" ON "ClubBookArtifact"("uploadedByUserId");

PRAGMA foreign_keys=ON;

