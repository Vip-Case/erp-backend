-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "warehouseCode" TEXT;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES "Warehouse"("warehouseCode") ON DELETE SET NULL ON UPDATE CASCADE;
