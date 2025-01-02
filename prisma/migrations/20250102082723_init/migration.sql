/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CurrentAddress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `CurrentAddress` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CurrentBranch` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `CurrentBranch` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CurrentFinancial` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `CurrentFinancial` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CurrentOfficials` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `CurrentOfficials` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `CurrentRisk` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `CurrentRisk` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `StockCardEFatura` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `StockCardEFatura` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `StockCardManufacturer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `StockCardManufacturer` table. All the data in the column will be lost.
  - You are about to drop the `_OrderToStore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storeId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `companyCode` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_stockCardId_fkey";

-- DropForeignKey
ALTER TABLE "StockCardEFatura" DROP CONSTRAINT "StockCardEFatura_stockCardId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyCode_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToStore" DROP CONSTRAINT "_OrderToStore_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToStore" DROP CONSTRAINT "_OrderToStore_B_fkey";

-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "BankMovement" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "CurrentAddress" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "CurrentBranch" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "CurrentFinancial" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "CurrentOfficials" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "CurrentRisk" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "MarketPlace" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "MarketPlaceProductMatch" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "MarketPlaceProducts" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isInvoiceCreated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "stockCardId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pos" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "PosMovement" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "StockCard" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StockCardEFatura" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "StockCardManufacturer" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "autoInvoiceCreation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "storeUrl" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "companyCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vault" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "VaultMovement" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- DropTable
DROP TABLE "_OrderToStore";

-- CreateTable
CREATE TABLE "_StockCardToStockCardEFatura" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockCardToStockCardEFatura_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StockCardToStockCardEFatura_B_index" ON "_StockCardToStockCardEFatura"("B");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCard" ADD CONSTRAINT "StockCard_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCard" ADD CONSTRAINT "StockCard_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDetail" ADD CONSTRAINT "ReceiptDetail_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDetail" ADD CONSTRAINT "ReceiptDetail_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Current" ADD CONSTRAINT "Current_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Current" ADD CONSTRAINT "Current_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProducts" ADD CONSTRAINT "MarketPlaceProducts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProducts" ADD CONSTRAINT "MarketPlaceProducts_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" ADD CONSTRAINT "_StockCardToStockCardEFatura_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" ADD CONSTRAINT "_StockCardToStockCardEFatura_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardEFatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;
