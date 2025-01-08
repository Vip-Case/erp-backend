/*
  Warnings:

  - You are about to drop the column `createdBy` on the `MarketPlaceProductMatch` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `MarketPlaceProductMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarketPlaceProductMatch" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";
