-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "currentId" TEXT,
ADD COLUMN     "currentMovementId" TEXT;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Current"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
