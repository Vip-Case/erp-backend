-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Fatura', 'Sevk', 'Teslimat');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('Purchase', 'Sales', 'Return', 'Cancel', 'Other');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Invoice', 'Order', 'Waybill', 'Other');

-- CreateEnum
CREATE TYPE "StokManagementType" AS ENUM ('Devir', 'DepolarArasiTransfer', 'Uretim', 'Muhtelif', 'Maliyet', 'Konsinye', 'Teshir', 'AlisFaturasi', 'SatisFaturasi', 'HizliSatis');

-- CreateEnum
CREATE TYPE "GCCode" AS ENUM ('Giris', 'Cikis');

-- CreateEnum
CREATE TYPE "CurrentMovementType" AS ENUM ('Borc', 'Alacak');

-- CreateEnum
CREATE TYPE "CurrentMovementDocumentType" AS ENUM ('Devir', 'Fatura', 'IadeFatura', 'Kasa', 'MusteriSeneti', 'BorcSeneti', 'MusteriCeki', 'BorcCeki', 'KarsiliksizCek', 'Muhtelif');

-- CreateEnum
CREATE TYPE "CurrentPaymentType" AS ENUM ('ÇokluÖdeme', 'Kasa', 'POS', 'Banka', 'Cek', 'Senet', 'Diger');

-- CreateEnum
CREATE TYPE "ReceiptType" AS ENUM ('Devir', 'Sayim', 'Nakil', 'Giris', 'Cikis', 'Fire');

-- CreateEnum
CREATE TYPE "StockUnits" AS ENUM ('Adet', 'Kg', 'Lt', 'M', 'M2', 'M3', 'Paket', 'Kutu', 'Koli', 'Ton', 'Dolar', 'Euro', 'TL');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('BasitUrun', 'VaryasyonluUrun', 'VaryasyonUrun', 'DijitalUrun', 'Hizmet');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('Sirket', 'Sahis');

-- CreateEnum
CREATE TYPE "CurrentType" AS ENUM ('AliciSatici', 'Alici', 'Satici', 'Personel', 'SanalPazar', 'Kurum', 'AnaGrupSirketi', 'Ithalat', 'Ihracat', 'IthalatIhracat', 'Musteri', 'Tedarikci', 'Diger');

-- CreateEnum
CREATE TYPE "VaultDirection" AS ENUM ('Introduction', 'Exit', 'ReceivedVirement');

-- CreateEnum
CREATE TYPE "VaultType" AS ENUM ('DebtTransfer', 'ServiceChargeCollection', 'CompanyCreditCardWithdrawals', 'BuyingForeignCurrency', 'InputReceipt', 'PurchaseInvoicePayment', 'BankWithdrawals', 'ReceivingValuableAssets', 'ReceivableTransfer', 'ServiceChargePayment', 'CompanyCreditCardDeposit', 'CurrencyExchange', 'LoanPayment', 'LoanWithdrawal', 'ExitReceipt', 'SalesInvoicePayment', 'PaymentToBank', 'PreciousMetalExchange', 'ReceivedVirement', 'OutgoingVirement', 'InGoingVirement', 'POSWithdrawals', 'CashCollection', 'BankCollection', 'POSCollection');

-- CreateEnum
CREATE TYPE "VaultDocumentType" AS ENUM ('General', 'Accounting', 'Official');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "roleName" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "groupId" TEXT,
    "permissionName" VARCHAR(50) NOT NULL,
    "route" TEXT,
    "description" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionGroup" (
    "id" TEXT NOT NULL,
    "groupName" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCard" (
    "id" TEXT NOT NULL,
    "productCode" VARCHAR(100) NOT NULL,
    "productName" VARCHAR(150) NOT NULL,
    "unit" "StockUnits" NOT NULL DEFAULT 'Adet',
    "shortDescription" VARCHAR(150),
    "description" VARCHAR(250),
    "companyCode" VARCHAR(50),
    "branchCode" VARCHAR(50),
    "brandId" VARCHAR(100),
    "productType" "ProductType" NOT NULL DEFAULT 'BasitUrun',
    "gtip" VARCHAR(50),
    "pluCode" VARCHAR(50),
    "desi" DECIMAL(15,4),
    "adetBoleni" DECIMAL(15,4),
    "siraNo" VARCHAR(50),
    "raf" VARCHAR(50),
    "karMarji" DECIMAL(15,4),
    "riskQuantities" DECIMAL(15,4),
    "maliyet" DECIMAL(15,4),
    "maliyetDoviz" VARCHAR(3),
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
CREATE TABLE "StockCardEFatura" (
    "id" TEXT NOT NULL,
    "productCode" VARCHAR(100) NOT NULL,
    "productName" VARCHAR(150) NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "StockCardEFatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardManufacturer" (
    "id" TEXT NOT NULL,
    "productCode" VARCHAR(100) NOT NULL,
    "productName" VARCHAR(150) NOT NULL,
    "barcode" VARCHAR(100) NOT NULL,
    "brandId" VARCHAR(100),
    "stockCardId" TEXT NOT NULL,
    "currentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "StockCardManufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "brandName" VARCHAR(100) NOT NULL,
    "brandCode" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardPriceList" (
    "id" TEXT NOT NULL,
    "priceListName" VARCHAR(100) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "isVatIncluded" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StockCardPriceList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardPriceListItems" (
    "id" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "price" DECIMAL(15,4) NOT NULL,
    "vatRate" DECIMAL(15,4),
    "barcode" VARCHAR(100),

    CONSTRAINT "StockCardPriceListItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardBarcode" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "barcode" VARCHAR(100) NOT NULL,

    CONSTRAINT "StockCardBarcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardMarketNames" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "marketName" VARCHAR(100) NOT NULL,

    CONSTRAINT "StockCardMarketNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardCategory" (
    "id" TEXT NOT NULL,
    "categoryName" VARCHAR(100) NOT NULL,
    "categoryCode" VARCHAR(100) NOT NULL,
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
    "stockCardId" TEXT,
    "taxName" VARCHAR(100) NOT NULL,
    "taxRate" DECIMAL(15,4) NOT NULL,

    CONSTRAINT "StockCardTaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardAttribute" (
    "id" TEXT NOT NULL,
    "attributeName" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "StockCardAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardAttributeItems" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,

    CONSTRAINT "StockCardAttributeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardVariation" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "variationName" VARCHAR(100) NOT NULL,
    "variationCode" VARCHAR(100) NOT NULL,
    "variationValue" VARCHAR(100) NOT NULL,

    CONSTRAINT "StockCardVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "warehouseCode" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "currentCode" TEXT,
    "documentType" "DocumentType",
    "invoiceType" "InvoiceType",
    "movementType" "StokManagementType" NOT NULL,
    "documentNo" TEXT,
    "gcCode" "GCCode",
    "type" TEXT,
    "description" TEXT,
    "quantity" DECIMAL(15,4),
    "unitPrice" DECIMAL(15,4),
    "totalPrice" DECIMAL(15,4),
    "unitOfMeasure" VARCHAR(50),
    "outWarehouseCode" TEXT,
    "priceListId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),
    "surname" VARCHAR(100),
    "companyCode" VARCHAR(50),
    "taxNumber" VARCHAR(50),
    "taxOffice" VARCHAR(50),
    "kepAddress" VARCHAR(50),
    "mersisNo" VARCHAR(50),
    "sicilNo" VARCHAR(50),
    "address" VARCHAR(300),
    "countryCode" VARCHAR(3),
    "city" VARCHAR(50),
    "district" VARCHAR(50),
    "postalCode" VARCHAR(10),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "website" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branchName" VARCHAR(100) NOT NULL,
    "branchCode" VARCHAR(50) NOT NULL,
    "address" VARCHAR(250) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "website" VARCHAR(100) NOT NULL,
    "companyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "warehouseName" VARCHAR(100) NOT NULL,
    "warehouseCode" VARCHAR(50) NOT NULL,
    "address" VARCHAR(250) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "companyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchWarehouse" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "BranchWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCardWarehouse" (
    "id" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,

    CONSTRAINT "StockCardWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTake" (
    "id" TEXT NOT NULL,
    "stockCardIds" TEXT[],
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "StockTake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "receiptType" "ReceiptType" NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentNo" VARCHAR(50) NOT NULL,
    "branchCode" VARCHAR(50) NOT NULL,
    "isTransfer" BOOLEAN NOT NULL DEFAULT false,
    "outWarehouse" TEXT,
    "inWarehouse" TEXT,
    "description" TEXT,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptDetail" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,
    "unitPrice" DECIMAL(15,4) NOT NULL,
    "totalPrice" DECIMAL(15,4) NOT NULL,
    "vatRate" DECIMAL(15,4) NOT NULL,
    "discount" DECIMAL(15,4) NOT NULL,
    "netPrice" DECIMAL(15,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "ReceiptDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Current" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "currentName" VARCHAR(100) NOT NULL,
    "currentType" "CurrentType" NOT NULL DEFAULT 'AliciSatici',
    "institution" "InstitutionType" NOT NULL DEFAULT 'Sahis',
    "identityNo" VARCHAR(50),
    "taxNumber" VARCHAR(50),
    "taxOffice" VARCHAR(50),
    "title" VARCHAR(100),
    "name" VARCHAR(50),
    "surname" VARCHAR(50),
    "webSite" VARCHAR(100),
    "birthOfDate" TIMESTAMP(3),
    "kepAddress" VARCHAR(50),
    "mersisNo" VARCHAR(50),
    "sicilNo" VARCHAR(50),
    "priceListId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Current_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentBranch" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "branchCode" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentAddress" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "addressName" VARCHAR(50) NOT NULL,
    "addressType" "AddressType" NOT NULL DEFAULT 'Fatura',
    "address" VARCHAR(250) NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "postalCode" VARCHAR(10) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "phone2" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "email2" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentFinancial" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "bankName" VARCHAR(50) NOT NULL,
    "bankBranch" VARCHAR(50) NOT NULL,
    "bankBranchCode" VARCHAR(50) NOT NULL,
    "iban" VARCHAR(100) NOT NULL,
    "accountNo" DECIMAL(15,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentFinancial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentRisk" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "teminatYerelTutar" DECIMAL(15,4),
    "acikHesapYerelLimit" DECIMAL(15,4),
    "hesapKesimGunu" INTEGER,
    "vadeGun" INTEGER,
    "gecikmeLimitGunu" INTEGER,
    "varsayilanAlisIskontosu" DECIMAL(15,4),
    "varsayilanSatisIskontosu" DECIMAL(15,4),
    "ekstreGonder" BOOLEAN DEFAULT false,
    "limitKontrol" BOOLEAN DEFAULT false,
    "acikHesap" BOOLEAN DEFAULT false,
    "posKullanim" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentOfficials" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "note" VARCHAR(250) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentOfficials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentMovement" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50),
    "dueDate" TIMESTAMP(3),
    "description" VARCHAR(250),
    "debtAmount" DECIMAL(15,4),
    "creditAmount" DECIMAL(15,4),
    "priceListId" TEXT,
    "movementType" "CurrentMovementType" NOT NULL,
    "documentType" "CurrentMovementDocumentType",
    "paymentType" "CurrentPaymentType",
    "documentNo" TEXT,
    "companyCode" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "CurrentMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentCategory" (
    "id" TEXT NOT NULL,
    "categoryName" VARCHAR(100) NOT NULL,
    "categoryCode" VARCHAR(100) NOT NULL,
    "parentCategoryId" TEXT,

    CONSTRAINT "CurrentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentCategoryItem" (
    "id" TEXT NOT NULL,
    "currentCode" VARCHAR(50) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CurrentCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "address" VARCHAR(250) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNo" VARCHAR(50) NOT NULL,
    "gibInvoiceNo" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "invoiceType" "InvoiceType",
    "documentType" "DocumentType",
    "currentCode" TEXT,
    "companyCode" TEXT,
    "branchCode" TEXT NOT NULL,
    "outBranchCode" TEXT,
    "warehouseCode" TEXT NOT NULL,
    "description" TEXT,
    "genelIskontoTutar" DECIMAL(15,4),
    "genelIskontoOran" DECIMAL(15,4),
    "paymentDate" TIMESTAMP(3),
    "paymentDay" INTEGER,
    "priceListId" TEXT,
    "totalAmount" DECIMAL(15,4),
    "totalVat" DECIMAL(15,4),
    "totalDiscount" DECIMAL(15,4),
    "totalNet" DECIMAL(15,4),
    "totalPaid" DECIMAL(15,4),
    "totalDebt" DECIMAL(15,4),
    "totalBalance" DECIMAL(15,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceDetail" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "quantity" DECIMAL(15,4) NOT NULL,
    "unitPrice" DECIMAL(15,4) NOT NULL,
    "totalPrice" DECIMAL(15,4) NOT NULL,
    "vatRate" DECIMAL(15,4) NOT NULL,
    "discount" DECIMAL(15,4) NOT NULL,
    "netPrice" DECIMAL(15,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vault" (
    "id" TEXT NOT NULL,
    "vaultName" VARCHAR(50) NOT NULL,
    "branchCode" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultMovement" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptId" TEXT,
    "description" TEXT NOT NULL,
    "entering" DECIMAL(15,2) NOT NULL,
    "emerging" DECIMAL(15,2) NOT NULL,
    "vaultDirection" "VaultDirection" NOT NULL,
    "vaultType" "VaultType" NOT NULL,
    "vaultDocumentType" "VaultDocumentType" NOT NULL,
    "currentMovementId" TEXT,

    CONSTRAINT "VaultMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "bankName" VARCHAR(50) NOT NULL,
    "branchCode" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankMovement" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptId" TEXT,
    "description" TEXT NOT NULL,
    "entering" DECIMAL(15,2) NOT NULL,
    "emerging" DECIMAL(15,2) NOT NULL,
    "bankDirection" "VaultDirection" NOT NULL,
    "bankType" "VaultType" NOT NULL,
    "bankDocumentType" "VaultDocumentType" NOT NULL,
    "currentMovementId" TEXT,

    CONSTRAINT "BankMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pos" (
    "id" TEXT NOT NULL,
    "posName" VARCHAR(50) NOT NULL,
    "branchCode" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Pos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosMovement" (
    "id" TEXT NOT NULL,
    "posId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptId" TEXT,
    "description" TEXT NOT NULL,
    "entering" DECIMAL(15,2) NOT NULL,
    "emerging" DECIMAL(15,2) NOT NULL,
    "posDirection" "VaultDirection" NOT NULL,
    "posType" "VaultType" NOT NULL,
    "posDocumentType" "VaultDocumentType" NOT NULL,
    "currentMovementId" TEXT,

    CONSTRAINT "PosMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "platformOrderId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "deliveryType" TEXT,
    "cargoCompany" TEXT,
    "shippingAddressId" TEXT,
    "billingAddressId" TEXT,
    "timeSlot" TIMESTAMP(3),
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderInvoiceAddress" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderInvoiceAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCargo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "deliveryNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderCargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stockCardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(15,4) NOT NULL,
    "totalPrice" DECIMAL(15,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiBaseUrl" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "companyCode" TEXT,

    CONSTRAINT "MarketPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketPlaceId" TEXT NOT NULL,
    "apiCredentials" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceCategories" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT,
    "marketPlaceCategoryId" TEXT,
    "marketPlaceCategoryParentId" TEXT,

    CONSTRAINT "MarketPlaceCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceBrands" (
    "id" TEXT NOT NULL,
    "marketPlaceBrandId" TEXT,
    "brandName" TEXT,

    CONSTRAINT "MarketPlaceBrands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceAttributes" (
    "id" TEXT NOT NULL,
    "marketPlaceId" TEXT,
    "MarketPlaceCategoriesId" TEXT,
    "attributeName" TEXT,
    "attributeMarketPlaceId" TEXT,
    "valueName" TEXT,
    "valueMarketPlaceId" TEXT,
    "required" BOOLEAN,
    "allowCustom" BOOLEAN,

    CONSTRAINT "MarketPlaceAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceProductImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "marketPlaceProductId" TEXT,

    CONSTRAINT "MarketPlaceProductImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceProducts" (
    "id" TEXT NOT NULL,
    "productType" TEXT,
    "parentProductId" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "productSku" TEXT,
    "description" TEXT,
    "shortDescription" TEXT,
    "listPrice" DECIMAL(15,4),
    "salePrice" DECIMAL(15,4),
    "barcode" TEXT,
    "storeId" TEXT,
    "marketPlaceAttributesId" TEXT,
    "marketPlaceCategoriesId" TEXT,
    "marketPlaceBrandsId" TEXT,

    CONSTRAINT "MarketPlaceProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlaceProductMatch" (
    "id" TEXT NOT NULL,
    "storeId" TEXT,
    "marketPlaceProductId" TEXT,
    "platformProductId" TEXT,
    "platformVariationId" TEXT,
    "marketPlaceSKU" TEXT,

    CONSTRAINT "MarketPlaceProductMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "readBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PermissionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StockCardToStore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockCardToStore_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StockCardPriceListItemsToStockCardVariation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StockCardBarcodeToStockCardVariation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockCardBarcodeToStockCardVariation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderToStore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToStore_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductsOnCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductsOnCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MarketPlaceAttributesToMarketPlaceProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleName_key" ON "Role"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permissionName_key" ON "Permission"("permissionName");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_route_key" ON "Permission"("route");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionGroup_groupName_key" ON "PermissionGroup"("groupName");

-- CreateIndex
CREATE UNIQUE INDEX "StockCard_productCode_key" ON "StockCard"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardEFatura_productCode_key" ON "StockCardEFatura"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardManufacturer_barcode_key" ON "StockCardManufacturer"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brandName_key" ON "Brand"("brandName");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brandCode_key" ON "Brand"("brandCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardPriceList_priceListName_key" ON "StockCardPriceList"("priceListName");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardBarcode_barcode_key" ON "StockCardBarcode"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardCategory_categoryName_key" ON "StockCardCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardCategory_categoryCode_key" ON "StockCardCategory"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardVariation_variationCode_key" ON "StockCardVariation"("variationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyName_key" ON "Company"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyCode_key" ON "Company"("companyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Company_taxNumber_key" ON "Company"("taxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branchName_key" ON "Branch"("branchName");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branchCode_key" ON "Branch"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_warehouseName_key" ON "Warehouse"("warehouseName");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_warehouseCode_key" ON "Warehouse"("warehouseCode");

-- CreateIndex
CREATE UNIQUE INDEX "BranchWarehouse_branchId_warehouseId_key" ON "BranchWarehouse"("branchId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "StockCardWarehouse_stockCardId_warehouseId_key" ON "StockCardWarehouse"("stockCardId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Current_currentCode_key" ON "Current"("currentCode");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentRisk_currentCode_key" ON "CurrentRisk"("currentCode");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentCategory_categoryCode_key" ON "CurrentCategory"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE INDEX "_PermissionToUser_B_index" ON "_PermissionToUser"("B");

-- CreateIndex
CREATE INDEX "_StockCardToStore_B_index" ON "_StockCardToStore"("B");

-- CreateIndex
CREATE INDEX "_StockCardPriceListItemsToStockCardVariation_B_index" ON "_StockCardPriceListItemsToStockCardVariation"("B");

-- CreateIndex
CREATE INDEX "_StockCardBarcodeToStockCardVariation_B_index" ON "_StockCardBarcodeToStockCardVariation"("B");

-- CreateIndex
CREATE INDEX "_OrderToStore_B_index" ON "_OrderToStore"("B");

-- CreateIndex
CREATE INDEX "_ProductsOnCategories_B_index" ON "_ProductsOnCategories"("B");

-- CreateIndex
CREATE INDEX "_MarketPlaceAttributesToMarketPlaceProducts_B_index" ON "_MarketPlaceAttributesToMarketPlaceProducts"("B");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PermissionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCard" ADD CONSTRAINT "StockCard_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCard" ADD CONSTRAINT "StockCard_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCard" ADD CONSTRAINT "StockCard_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardEFatura" ADD CONSTRAINT "StockCardEFatura_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardManufacturer" ADD CONSTRAINT "StockCardManufacturer_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardManufacturer" ADD CONSTRAINT "StockCardManufacturer_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Current"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardManufacturer" ADD CONSTRAINT "StockCardManufacturer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardPriceListItems" ADD CONSTRAINT "StockCardPriceListItems_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardPriceListItems" ADD CONSTRAINT "StockCardPriceListItems_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "StockCardPriceList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardBarcode" ADD CONSTRAINT "StockCardBarcode_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardMarketNames" ADD CONSTRAINT "StockCardMarketNames_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategory" ADD CONSTRAINT "StockCardCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "StockCardCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategoryItem" ADD CONSTRAINT "StockCardCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StockCardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardCategoryItem" ADD CONSTRAINT "StockCardCategoryItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardTaxRate" ADD CONSTRAINT "StockCardTaxRate_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardAttributeItems" ADD CONSTRAINT "StockCardAttributeItems_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "StockCardAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardAttributeItems" ADD CONSTRAINT "StockCardAttributeItems_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardVariation" ADD CONSTRAINT "StockCardVariation_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES "Warehouse"("warehouseCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_outWarehouseCode_fkey" FOREIGN KEY ("outWarehouseCode") REFERENCES "Warehouse"("warehouseCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "StockCardPriceList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_documentNo_fkey" FOREIGN KEY ("documentNo") REFERENCES "Invoice"("invoiceNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWarehouse" ADD CONSTRAINT "BranchWarehouse_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWarehouse" ADD CONSTRAINT "BranchWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardWarehouse" ADD CONSTRAINT "StockCardWarehouse_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCardWarehouse" ADD CONSTRAINT "StockCardWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTake" ADD CONSTRAINT "StockTake_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_outWarehouse_fkey" FOREIGN KEY ("outWarehouse") REFERENCES "Warehouse"("warehouseCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_inWarehouse_fkey" FOREIGN KEY ("inWarehouse") REFERENCES "Warehouse"("warehouseCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDetail" ADD CONSTRAINT "ReceiptDetail_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDetail" ADD CONSTRAINT "ReceiptDetail_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Current" ADD CONSTRAINT "Current_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "StockCardPriceList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBranch" ADD CONSTRAINT "CurrentBranch_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentBranch" ADD CONSTRAINT "CurrentBranch_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentAddress" ADD CONSTRAINT "CurrentAddress_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentFinancial" ADD CONSTRAINT "CurrentFinancial_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentRisk" ADD CONSTRAINT "CurrentRisk_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentOfficials" ADD CONSTRAINT "CurrentOfficials_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "StockCardPriceList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentMovement" ADD CONSTRAINT "CurrentMovement_documentNo_fkey" FOREIGN KEY ("documentNo") REFERENCES "Invoice"("invoiceNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCategory" ADD CONSTRAINT "CurrentCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "CurrentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCategoryItem" ADD CONSTRAINT "CurrentCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CurrentCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCategoryItem" ADD CONSTRAINT "CurrentCategoryItem_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES "Current"("currentCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES "Warehouse"("warehouseCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "StockCardPriceList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_outBranchCode_fkey" FOREIGN KEY ("outBranchCode") REFERENCES "Branch"("branchCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES "StockCard"("productCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultMovement" ADD CONSTRAINT "VaultMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankMovement" ADD CONSTRAINT "BankMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pos" ADD CONSTRAINT "Pos_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Pos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosMovement" ADD CONSTRAINT "PosMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES "CurrentMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "OrderInvoiceAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "OrderInvoiceAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCargo" ADD CONSTRAINT "OrderCargo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES "StockCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_marketPlaceId_fkey" FOREIGN KEY ("marketPlaceId") REFERENCES "MarketPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceCategories" ADD CONSTRAINT "MarketPlaceCategories_marketPlaceCategoryParentId_fkey" FOREIGN KEY ("marketPlaceCategoryParentId") REFERENCES "MarketPlaceCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceAttributes" ADD CONSTRAINT "MarketPlaceAttributes_marketPlaceId_fkey" FOREIGN KEY ("marketPlaceId") REFERENCES "MarketPlace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProductImages" ADD CONSTRAINT "MarketPlaceProductImages_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProducts" ADD CONSTRAINT "MarketPlaceProducts_marketPlaceBrandsId_fkey" FOREIGN KEY ("marketPlaceBrandsId") REFERENCES "MarketPlaceBrands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProducts" ADD CONSTRAINT "MarketPlaceProducts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProducts" ADD CONSTRAINT "MarketPlaceProducts_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "MarketPlaceProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProductMatch" ADD CONSTRAINT "MarketPlaceProductMatch_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProductMatch" ADD CONSTRAINT "MarketPlaceProductMatch_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_readBy_fkey" FOREIGN KEY ("readBy") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToUser" ADD CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardToStore" ADD CONSTRAINT "_StockCardToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardToStore" ADD CONSTRAINT "_StockCardToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardPriceListItemsToStockCardVariation" ADD CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCardPriceListItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardPriceListItemsToStockCardVariation" ADD CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardBarcodeToStockCardVariation" ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "StockCardBarcode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockCardBarcodeToStockCardVariation" ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "StockCardVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToStore" ADD CONSTRAINT "_OrderToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToStore" ADD CONSTRAINT "_OrderToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsOnCategories" ADD CONSTRAINT "_ProductsOnCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketPlaceCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsOnCategories" ADD CONSTRAINT "_ProductsOnCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketPlaceProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketPlaceAttributesToMarketPlaceProducts" ADD CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketPlaceAttributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketPlaceAttributesToMarketPlaceProducts" ADD CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketPlaceProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
