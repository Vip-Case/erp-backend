/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `MarketPlaceProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ProductMatch" (
    "id" TEXT NOT NULL,
    "productCode" TEXT,
    "barcode" TEXT,

    CONSTRAINT "ProductMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentRequests" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storeId" TEXT,
    "body" TEXT NOT NULL,
    "batchRequestId" TEXT,

    CONSTRAINT "SentRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestResponses" (
    "id" TEXT NOT NULL,
    "sentRequestId" TEXT,
    "batchRequestResult" TEXT NOT NULL,

    CONSTRAINT "RequestResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductMatch_barcode_key" ON "ProductMatch"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPlaceProducts_barcode_key" ON "MarketPlaceProducts"("barcode");

-- AddForeignKey
ALTER TABLE "ProductMatch" ADD CONSTRAINT "ProductMatch_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestResponses" ADD CONSTRAINT "RequestResponses_sentRequestId_fkey" FOREIGN KEY ("sentRequestId") REFERENCES "SentRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
