PRAGMA foreign_keys=OFF;

-- Add missing columns required by the API/schema.
ALTER TABLE "ClubBook" ADD COLUMN "coverUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ClubBook" ADD COLUMN "city" TEXT NOT NULL DEFAULT 'FORTALEZA';
ALTER TABLE "ClubBook" ADD COLUMN "month" INTEGER NOT NULL DEFAULT 2;
ALTER TABLE "ClubBook" ADD COLUMN "year" INTEGER NOT NULL DEFAULT 2026;

-- CreateIndex
CREATE INDEX "ClubBook_year_month_city_idx" ON "ClubBook"("year", "month", "city");

PRAGMA foreign_keys=ON;

