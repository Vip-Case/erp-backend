/*
  Warnings:

  - Added the required column `orderId` to the `OrderInvoiceAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderInvoiceAddress" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderInvoiceAddress" ADD CONSTRAINT "OrderInvoiceAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
