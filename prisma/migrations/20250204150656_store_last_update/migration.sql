/*
  Warnings:

  - You are about to drop the column `isTempQuantity` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `tempQuantity` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductMatch" ADD COLUMN     "isTempQuantity" BOOLEAN DEFAULT false,
ADD COLUMN     "tempQuantity" INTEGER;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "isTempQuantity",
DROP COLUMN "tempQuantity";
