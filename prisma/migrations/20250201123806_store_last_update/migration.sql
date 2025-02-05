-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "isTempQuantity" BOOLEAN DEFAULT false,
ADD COLUMN     "tempQuantity" INTEGER;
