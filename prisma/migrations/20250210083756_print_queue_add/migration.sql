-- CreateTable
CREATE TABLE "PrintQueue" (
    "id" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "printedAt" TIMESTAMP(3),
    "printedBy" TEXT,
    "printerName" TEXT,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrintQueue_status_idx" ON "PrintQueue"("status");

-- AddForeignKey
ALTER TABLE "PrintQueue" ADD CONSTRAINT "PrintQueue_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintQueue" ADD CONSTRAINT "PrintQueue_printedBy_fkey" FOREIGN KEY ("printedBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
