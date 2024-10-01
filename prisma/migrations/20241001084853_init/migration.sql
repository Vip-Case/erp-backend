-- CreateTable
CREATE TABLE "StockCard" (
    "id" TEXT NOT NULL,
    "productCode" VARCHAR(100) NOT NULL,
    "productName" VARCHAR(150) NOT NULL,
    "invoiceName" VARCHAR(150),
    "shortDescription" VARCHAR(150),
    "description" TEXT,
    "warehouseCode" VARCHAR(50) NOT NULL,
    "manufacturerCode" VARCHAR(50),
    "companyCode" VARCHAR(50) NOT NULL,
    "branchCode" VARCHAR(50) NOT NULL,
    "brand" VARCHAR(100),
    "unitOfMeasure" VARCHAR(50),
    "productType" VARCHAR(50) NOT NULL,
    "riskQuantities" DECIMAL(15,4) NOT NULL,
    "stockStatus" BOOLEAN NOT NULL DEFAULT true,
    "hasExpirationDate" BOOLEAN NOT NULL DEFAULT false,
    "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "StockCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardPriceList" (
    "id" TEXT NOT NULL,
    "priceListName" VARCHAR(100) NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "price" DECIMAL(15,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StockCardPriceList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardBarcode" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "barcode" VARCHAR(100) NOT NULL,

    CONSTRAINT "StockCardBarcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardCategory" (
    "id" TEXT NOT NULL,
    "categoryName" VARCHAR(100) NOT NULL,
    "parentCategoryId" TEXT,

    CONSTRAINT "StockCardCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardCategoryItem" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "StockCardCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardTaxRate" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "taxName" VARCHAR(100) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "StockCardTaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardAttribute" (
    "id" TEXT NOT NULL,
    "attributeName" VARCHAR(100) NOT NULL,
    "values" TEXT[],
    "stockCardId" TEXT NOT NULL,

    CONSTRAINT "StockCardAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardVariation" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "productCode" VARCHAR(100) NOT NULL,
    "productName" VARCHAR(150) NOT NULL,
    "invoiceName" VARCHAR(150),
    "shortDescription" VARCHAR(150),
    "description" TEXT,
    "riskQuantities" DECIMAL(15,4) NOT NULL,
    "hasExpirationDate" BOOLEAN NOT NULL DEFAULT false,
    "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(15,4) NOT NULL,
    "stockCode" VARCHAR(100) NOT NULL,

    CONSTRAINT "StockCardVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StockCardPriceListToStockCardVariation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StockCardBarcodeToStockCardVariation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StockCardAttributeToStockCardVariation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StockCard_productCode_key" ON "StockCard"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardBarcode_barcode_key" ON "StockCardBarcode"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardVariation_stockCode_key" ON "StockCardVariation"("stockCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_StockCardPriceListToStockCardVariation_AB_unique" ON "_StockCardPriceListToStockCardVariation"("A", "B");

-- CreateIndex
CREATE INDEX "_StockCardPriceListToStockCardVariation_B_index" ON "_StockCardPriceListToStockCardVariation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StockCardBarcodeToStockCardVariation_AB_unique" ON "_StockCardBarcodeToStockCardVariation"("A", "B");

-- CreateIndex
CREATE INDEX "_StockCardBarcodeToStockCardVariation_B_index" ON "_StockCardBarcodeToStockCardVariation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StockCardAttributeToStockCardVariation_AB_unique" ON "_StockCardAttributeToStockCardVariation"("A", "B");

-- CreateIndex
CREATE INDEX "_StockCardAttributeToStockCardVariation_B_index" ON "_StockCardAttributeToStockCardVariation"("B");

-- AddForeignKey
ALTER TABLE "StockCardPriceList" ADD CONSTRAINT "StockCardPriceList_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardBarcode" ADD CONSTRAINT "StockCardBarcode_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategory" ADD CONSTRAINT "StockCardCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "StockCardCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategoryItem" ADD CONSTRAINT "StockCardCategoryItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategoryItem" ADD CONSTRAINT "StockCardCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StockCardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardTaxRate" ADD CONSTRAINT "StockCardTaxRate_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardAttribute" ADD CONSTRAINT "StockCardAttribute_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardVariation" ADD CONSTRAINT "StockCardVariation_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardPriceListToStockCardVariation" ADD CONSTRAINT "_StockCardPriceListToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCardPriceList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardPriceListToStockCardVariation" ADD CONSTRAINT "_StockCardPriceListToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardBarcodeToStockCardVariation" ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCardBarcode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardBarcodeToStockCardVariation" ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardAttributeToStockCardVariation" ADD CONSTRAINT "_StockCardAttributeToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCardAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardAttributeToStockCardVariation" ADD CONSTRAINT "_StockCardAttributeToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
