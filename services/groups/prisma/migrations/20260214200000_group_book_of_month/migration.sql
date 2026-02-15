PRAGMA foreign_keys=OFF;

-- CreateTable
CREATE TABLE "GroupBookOfMonthSelection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "setByUserId" TEXT NOT NULL,
  "setAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GroupBookOfMonthSelection_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GroupBookOfMonthSelection_groupId_setAt_idx" ON "GroupBookOfMonthSelection"("groupId","setAt");

-- CreateIndex
CREATE INDEX "GroupBookOfMonthSelection_bookId_idx" ON "GroupBookOfMonthSelection"("bookId");

PRAGMA foreign_keys=ON;

