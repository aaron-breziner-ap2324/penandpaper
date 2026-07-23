/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `TutorProfile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TutorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,
    "yearsExp" INTEGER NOT NULL DEFAULT 0,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "city" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TutorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TutorProfile" ("bio", "city", "createdAt", "headline", "id", "online", "userId", "yearsExp") SELECT "bio", "city", "createdAt", "headline", "id", "online", "userId", "yearsExp" FROM "TutorProfile";
DROP TABLE "TutorProfile";
ALTER TABLE "new_TutorProfile" RENAME TO "TutorProfile";
CREATE UNIQUE INDEX "TutorProfile_userId_key" ON "TutorProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
