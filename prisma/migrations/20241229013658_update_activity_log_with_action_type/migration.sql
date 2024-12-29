/*
  Warnings:

  - You are about to drop the column `details` on the `ActivityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "details",
ADD COLUMN     "meta" JSONB;
