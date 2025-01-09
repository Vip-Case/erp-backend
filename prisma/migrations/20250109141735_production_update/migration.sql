/*
  Warnings:

  - You are about to drop the column `createdBy` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `MarketPlaceProductMatch` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `MarketPlaceProductMatch` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `MarketPlaceProducts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `MarketPlaceProducts` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `ReceiptDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `ReceiptDetail` table. All the data in the column will be lost.
  - You are about to drop the column `stockCardIds` on the `StockTake` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `MarketPlaceProducts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentNo]` on the table `StockTake` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchCode` to the `StockTake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentNo` to the `StockTake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StockTake` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockTakeStatus" AS ENUM ('Draft', 'InProgress', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "StockTakeType" AS ENUM ('Full', 'Partial', 'Spot', 'Periodic');

-- AlterEnum
ALTER TYPE "StokManagementType" ADD VALUE 'Sayim';

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlaceProducts" DROP CONSTRAINT "MarketPlaceProducts_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlaceProducts" DROP CONSTRAINT "MarketPlaceProducts_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptDetail" DROP CONSTRAINT "ReceiptDetail_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptDetail" DROP CONSTRAINT "ReceiptDetail_updatedBy_fkey";

-- AlterTable
ALTER TABLE "InvoiceDetail" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "MarketPlaceProductMatch" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "MarketPlaceProducts" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentId" TEXT,
ADD COLUMN     "currentMovementId" TEXT;

-- AlterTable
ALTER TABLE "ReceiptDetail" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "StockTake" DROP COLUMN "stockCardIds",
ADD COLUMN     "branchCode" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentNo" VARCHAR(50) NOT NULL,
ADD COLUMN     "reference" VARCHAR(100),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "StockTakeStatus" NOT NULL DEFAULT 'Draft',
ADD COLUMN     "stockTakeType" "StockTakeType" NOT NULL DEFAULT 'Full',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "companyCode" DROP DEFAULT;

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

-- CreateTable
CREATE TABLE "ProductMatch" (
    "id" TEXT NOT NULL,
    "productCode" TEXT,
    "barcode" TEXT,

    CONSTRAINT "ProductMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentRequests" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storeId" TEXT,
    "body" TEXT NOT NULL,
    "batchRequestId" TEXT,

    CONSTRAINT "SentRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestResponses" (
    "id" TEXT NOT NULL,
    "sentRequestId" TEXT,
    "batchRequestResult" TEXT NOT NULL,

    CONSTRAINT "RequestResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPrepareWarehouse" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "warehouseId" TEXT NOT NULL,
    "currentId" TEXT,
    "currentMovementId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPrepareWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductMatch_barcode_key" ON "ProductMatch"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPlaceProducts_barcode_key" ON "MarketPlaceProducts"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "StockTake_documentNo_key" ON "StockTake"("documentNo");

-- AddForeignKey
ALTER TABLE "StockTake" ADD CONSTRAINT "StockTake_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTake" ADD CONSTRAINT "StockTake_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTake" ADD CONSTRAINT "StockTake_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTakeDetail" ADD CONSTRAINT "StockTakeDetail_stockTakeId_fkey" FOREIGN KEY ("stockTakeId") REFERENCES "StockTake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTakeDetail" ADD CONSTRAINT "StockTakeDetail_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Current"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMatch" ADD CONSTRAINT "ProductMatch_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestResponses" ADD CONSTRAINT "RequestResponses_sentRequestId_fkey" FOREIGN KEY ("sentRequestId") REFERENCES "SentRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Current"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
