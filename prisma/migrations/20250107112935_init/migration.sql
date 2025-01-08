/*
  Warnings:

  - You are about to drop the column `createdBy` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `MarketPlaceProducts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `MarketPlaceProducts` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `ReceiptDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `ReceiptDetail` table. All the data in the column will be lost.

*/
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
ALTER TABLE "MarketPlaceProducts" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "ReceiptDetail" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";
