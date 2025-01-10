-- AlterTable
ALTER TABLE "InvoiceDetail" ADD COLUMN     "costCode" TEXT;

-- AlterTable
ALTER TABLE "StockCard" ADD COLUMN     "kdv" DECIMAL(15,4);
