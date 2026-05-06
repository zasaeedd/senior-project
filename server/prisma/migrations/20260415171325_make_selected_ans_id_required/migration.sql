/*
  Warnings:

  - Made the column `selected_ans_id` on table `StudentAnswer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StudentAnswer" ALTER COLUMN "selected_ans_id" SET NOT NULL;
