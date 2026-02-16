PRAGMA foreign_keys=OFF;

-- Enquetes (Polls)
CREATE TABLE "Poll" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clubBookId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "multiChoice" BOOLEAN NOT NULL DEFAULT 0,
  "publicVotes" BOOLEAN NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PollOption" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pollId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "imageUrl" TEXT,
  "index" INTEGER NOT NULL,
  CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PollVote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "pollId" TEXT NOT NULL,
  "optionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PollVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PollVote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PollOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX "Poll_clubBookId_idx" ON "Poll"("clubBookId");
CREATE INDEX "Poll_createdAt_idx" ON "Poll"("createdAt");
CREATE INDEX "PollOption_pollId_idx" ON "PollOption"("pollId");
CREATE INDEX "PollVote_pollId_idx" ON "PollVote"("pollId");
CREATE INDEX "PollVote_optionId_idx" ON "PollVote"("optionId");
CREATE INDEX "PollVote_userId_idx" ON "PollVote"("userId");

-- Keep legacy uniqueness (user cannot vote same option twice)
CREATE UNIQUE INDEX "PollVote_pollId_userId_optionId_key" ON "PollVote"("pollId","userId","optionId");

PRAGMA foreign_keys=ON;

