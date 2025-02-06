/*
  Warnings:

  - A unique constraint covering the columns `[documentNo]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "receiptNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_documentNo_key" ON "Receipt"("documentNo");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_receiptNo_fkey" FOREIGN KEY ("receiptNo") REFERENCES "Receipt"("documentNo") ON DELETE SET NULL ON UPDATE CASCADE;
