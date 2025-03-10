/*
  Warnings:

  - Added the required column `orderId` to the `OrderInvoiceAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderInvoiceAddress" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "amount" DECIMAL(15,2),
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "discount" DECIMAL(15,2),
ADD COLUMN     "merchantId" BIGINT,
ADD COLUMN     "merchantSku" TEXT,
ADD COLUMN     "orderLineId" BIGINT,
ADD COLUMN     "orderLineItemStatusName" TEXT,
ADD COLUMN     "productCode" BIGINT NOT NULL,
ADD COLUMN     "productColor" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productOrigin" TEXT,
ADD COLUMN     "productSize" TEXT,
ADD COLUMN     "salesCampaignId" BIGINT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "tyDiscount" DECIMAL(15,2),
ADD COLUMN     "vatBaseAmount" DECIMAL(15,2);

-- AlterTable
ALTER TABLE "ProductMatch" ADD COLUMN     "isTempQuantity" BOOLEAN DEFAULT false,
ADD COLUMN     "tempQuantity" INTEGER;

-- AlterTable
ALTER TABLE "StockCard" ADD COLUMN     "modelCode" VARCHAR(50);

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "warehouseCode" TEXT;

-- CreateTable
CREATE TABLE "OrderItemDiscount" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "lineItemPrice" DECIMAL(15,2) NOT NULL,
    "lineItemDiscount" DECIMAL(15,2) NOT NULL,
    "lineItemTyDiscount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItemDiscount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderInvoiceAddress" ADD CONSTRAINT "OrderInvoiceAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemDiscount" ADD CONSTRAINT "OrderItemDiscount_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES "Warehouse"("warehouseCode") ON DELETE SET NULL ON UPDATE CASCADE;
