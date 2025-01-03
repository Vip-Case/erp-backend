/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `StockCardEFatura` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `StockCardEFatura` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `StockCardManufacturer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `StockCardManufacturer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "StockCardEFatura" DROP CONSTRAINT "StockCardEFatura_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "StockCardEFatura" DROP CONSTRAINT "StockCardEFatura_stockCardId_fkey";

-- DropForeignKey
ALTER TABLE "StockCardEFatura" DROP CONSTRAINT "StockCardEFatura_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "StockCardManufacturer" DROP CONSTRAINT "StockCardManufacturer_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "StockCardManufacturer" DROP CONSTRAINT "StockCardManufacturer_updatedBy_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "StockCardEFatura" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "StockCardManufacturer" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- CreateTable
CREATE TABLE "_StockCardToStockCardEFatura" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockCardToStockCardEFatura_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StockCardToStockCardEFatura_B_index" ON "_StockCardToStockCardEFatura"("B");

-- AddForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" ADD CONSTRAINT "_StockCardToStockCardEFatura_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" ADD CONSTRAINT "_StockCardToStockCardEFatura_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardEFatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;
