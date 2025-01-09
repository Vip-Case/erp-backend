/*
  Warnings:

  - You are about to drop the column `stockCardIds` on the `StockTake` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentNo]` on the table `StockTake` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchCode` to the `StockTake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentNo` to the `StockTake` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockTakeStatus" AS ENUM ('Draft', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "StockTakeType" AS ENUM ('Full', 'Partial', 'Spot', 'Periodic');

-- AlterTable
ALTER TABLE "StockTake" DROP COLUMN "stockCardIds",
ADD COLUMN     "branchCode" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentNo" VARCHAR(50) NOT NULL,
ADD COLUMN     "reference" VARCHAR(100),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "StockTakeStatus" NOT NULL DEFAULT 'Draft',
ADD COLUMN     "stockTakeType" "StockTakeType" NOT NULL DEFAULT 'Full',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "StockTakeDetail" (
    "id" TEXT NOT NULL,
    "stockTakeId" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,
    "difference" DECIMAL(15,4) NOT NULL,
    "note" TEXT,

    CONSTRAINT "StockTakeDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockTake_documentNo_key" ON "StockTake"("documentNo");

-- AddForeignKey
ALTER TABLE "StockTake" ADD CONSTRAINT "StockTake_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTakeDetail" ADD CONSTRAINT "StockTakeDetail_stockTakeId_fkey" FOREIGN KEY ("stockTakeId") REFERENCES "StockTake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTakeDetail" ADD CONSTRAINT "StockTakeDetail_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
