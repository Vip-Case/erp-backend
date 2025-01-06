-- AlterTable
ALTER TABLE "OrderPrepareWarehouse" ADD COLUMN     "currentId" TEXT,
ADD COLUMN     "currentMovementId" TEXT;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Current"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPrepareWarehouse" ADD CONSTRAINT "OrderPrepareWarehouse_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
