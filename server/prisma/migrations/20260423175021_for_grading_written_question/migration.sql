-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "isGraded" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "requiresManualGrading" BOOLEAN NOT NULL DEFAULT false;
