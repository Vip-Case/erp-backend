/*
  Warnings:

  - You are about to drop the `_StockCardToStockCardEFatura` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[documentNo]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockCardId]` on the table `StockCardEFatura` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" DROP CONSTRAINT "_StockCardToStockCardEFatura_A_fkey";

-- DropForeignKey
ALTER TABLE "_StockCardToStockCardEFatura" DROP CONSTRAINT "_StockCardToStockCardEFatura_B_fkey";

-- DropIndex
DROP INDEX "Permission_route_key";

-- AlterTable
ALTER TABLE "InvoiceDetail" ADD COLUMN     "costCode" TEXT,
ADD COLUMN     "costName" TEXT,
ADD COLUMN     "currency" TEXT;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "action" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "resource" TEXT,
ALTER COLUMN "permissionName" SET DATA TYPE TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StockCard" ADD COLUMN     "kdv" DECIMAL(15,4);

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "receiptNo" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastFailedLoginAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- DropTable
DROP TABLE "_StockCardToStockCardEFatura";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "suspiciousReason" TEXT,
    "location" TEXT,
    "userAgent" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "rememberMe" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintQueue" (
    "id" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "printedAt" TIMESTAMP(3),
    "printedBy" TEXT,
    "printerName" TEXT,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_isSuspicious_idx" ON "Session"("isSuspicious");

-- CreateIndex
CREATE INDEX "PrintQueue_status_idx" ON "PrintQueue"("status");

-- CreateIndex
CREATE INDEX "SecurityLog_userId_idx" ON "SecurityLog"("userId");

-- CreateIndex
CREATE INDEX "SecurityLog_adminId_idx" ON "SecurityLog"("adminId");

-- CreateIndex
CREATE INDEX "SecurityLog_action_idx" ON "SecurityLog"("action");

-- CreateIndex
CREATE INDEX "Permission_route_idx" ON "Permission"("route");

-- CreateIndex
CREATE INDEX "Permission_permissionName_idx" ON "Permission"("permissionName");

-- CreateIndex
CREATE INDEX "Permission_resource_action_idx" ON "Permission"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_documentNo_key" ON "Receipt"("documentNo");

-- CreateIndex
CREATE INDEX "Role_roleName_idx" ON "Role"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardEFatura_stockCardId_key" ON "StockCardEFatura"("stockCardId");

-- CreateIndex
CREATE INDEX "StockCardEFatura_stockCardId_idx" ON "StockCardEFatura"("stockCardId");

-- AddForeignKey
ALTER TABLE "StockCardEFatura" ADD CONSTRAINT "StockCardEFatura_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_receiptNo_fkey" FOREIGN KEY ("receiptNo") REFERENCES "Receipt"("documentNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintQueue" ADD CONSTRAINT "PrintQueue_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintQueue" ADD CONSTRAINT "PrintQueue_printedBy_fkey" FOREIGN KEY ("printedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityLog" ADD CONSTRAINT "SecurityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityLog" ADD CONSTRAINT "SecurityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
