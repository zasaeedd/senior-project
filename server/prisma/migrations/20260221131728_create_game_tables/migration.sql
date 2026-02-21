/*
  Warnings:

  - The primary key for the `StudentBadge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentPowerUp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[studentID,badgeID]` on the table `StudentBadge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentID,powerupID]` on the table `StudentPowerUp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StudentBadge" DROP CONSTRAINT "StudentBadge_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudentPowerUp" DROP CONSTRAINT "StudentPowerUp_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StudentPowerUp_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBadge_studentID_badgeID_key" ON "StudentBadge"("studentID", "badgeID");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPowerUp_studentID_powerupID_key" ON "StudentPowerUp"("studentID", "powerupID");
