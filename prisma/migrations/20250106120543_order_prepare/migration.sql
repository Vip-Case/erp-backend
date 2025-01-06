-- CreateTable
CREATE TABLE "OrderPrepareWarehouse" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPrepareWarehouse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
