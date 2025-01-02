--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.6 (Debian 16.6-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddressType" AS ENUM (
    'Fatura',
    'Sevk',
    'Teslimat'
);


ALTER TYPE public."AddressType" OWNER TO postgres;

--
-- Name: CurrentMovementDocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CurrentMovementDocumentType" AS ENUM (
    'Devir',
    'Fatura',
    'IadeFatura',
    'Kasa',
    'MusteriSeneti',
    'BorcSeneti',
    'MusteriCeki',
    'BorcCeki',
    'KarsiliksizCek',
    'Muhtelif'
);


ALTER TYPE public."CurrentMovementDocumentType" OWNER TO postgres;

--
-- Name: CurrentMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CurrentMovementType" AS ENUM (
    'Borc',
    'Alacak'
);


ALTER TYPE public."CurrentMovementType" OWNER TO postgres;

--
-- Name: CurrentPaymentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CurrentPaymentType" AS ENUM (
    'ÇokluÖdeme',
    'Kasa',
    'POS',
    'Banka',
    'Cek',
    'Senet',
    'Diger'
);


ALTER TYPE public."CurrentPaymentType" OWNER TO postgres;

--
-- Name: CurrentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CurrentType" AS ENUM (
    'AliciSatici',
    'Alici',
    'Satici',
    'Personel',
    'SanalPazar',
    'Kurum',
    'AnaGrupSirketi',
    'Ithalat',
    'Ihracat',
    'IthalatIhracat',
    'Musteri',
    'Tedarikci',
    'Diger'
);


ALTER TYPE public."CurrentType" OWNER TO postgres;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentType" AS ENUM (
    'Invoice',
    'Order',
    'Waybill',
    'Other'
);


ALTER TYPE public."DocumentType" OWNER TO postgres;

--
-- Name: GCCode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GCCode" AS ENUM (
    'Giris',
    'Cikis'
);


ALTER TYPE public."GCCode" OWNER TO postgres;

--
-- Name: InstitutionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InstitutionType" AS ENUM (
    'Sirket',
    'Sahis'
);


ALTER TYPE public."InstitutionType" OWNER TO postgres;

--
-- Name: InvoiceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceType" AS ENUM (
    'Purchase',
    'Sales',
    'Return',
    'Cancel',
    'Other'
);


ALTER TYPE public."InvoiceType" OWNER TO postgres;

--
-- Name: ProductType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductType" AS ENUM (
    'BasitUrun',
    'VaryasyonluUrun',
    'VaryasyonUrun',
    'DijitalUrun',
    'Hizmet'
);


ALTER TYPE public."ProductType" OWNER TO postgres;

--
-- Name: ReceiptType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReceiptType" AS ENUM (
    'Devir',
    'Sayim',
    'Nakil',
    'Giris',
    'Cikis',
    'Fire'
);


ALTER TYPE public."ReceiptType" OWNER TO postgres;

--
-- Name: StockUnits; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StockUnits" AS ENUM (
    'Adet',
    'Kg',
    'Lt',
    'M',
    'M2',
    'M3',
    'Paket',
    'Kutu',
    'Koli',
    'Ton',
    'Dolar',
    'Euro',
    'TL'
);


ALTER TYPE public."StockUnits" OWNER TO postgres;

--
-- Name: StokManagementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StokManagementType" AS ENUM (
    'Devir',
    'DepolarArasiTransfer',
    'Uretim',
    'Muhtelif',
    'Maliyet',
    'Konsinye',
    'Teshir',
    'AlisFaturasi',
    'SatisFaturasi',
    'HizliSatis'
);


ALTER TYPE public."StokManagementType" OWNER TO postgres;

--
-- Name: VaultDirection; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VaultDirection" AS ENUM (
    'Introduction',
    'Exit',
    'ReceivedVirement'
);


ALTER TYPE public."VaultDirection" OWNER TO postgres;

--
-- Name: VaultDocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VaultDocumentType" AS ENUM (
    'General',
    'Accounting',
    'Official'
);


ALTER TYPE public."VaultDocumentType" OWNER TO postgres;

--
-- Name: VaultType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VaultType" AS ENUM (
    'DebtTransfer',
    'ServiceChargeCollection',
    'CompanyCreditCardWithdrawals',
    'BuyingForeignCurrency',
    'InputReceipt',
    'PurchaseInvoicePayment',
    'BankWithdrawals',
    'ReceivingValuableAssets',
    'ReceivableTransfer',
    'ServiceChargePayment',
    'CompanyCreditCardDeposit',
    'CurrencyExchange',
    'LoanPayment',
    'LoanWithdrawal',
    'ExitReceipt',
    'SalesInvoicePayment',
    'PaymentToBank',
    'PreciousMetalExchange',
    'ReceivedVirement',
    'OutgoingVirement',
    'InGoingVirement',
    'POSWithdrawals',
    'CashCollection',
    'BankCollection',
    'POSCollection'
);


ALTER TYPE public."VaultType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Bank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bank" (
    id text NOT NULL,
    "bankName" character varying(50) NOT NULL,
    "branchCode" text NOT NULL,
    balance numeric(15,2) NOT NULL,
    currency text NOT NULL
);


ALTER TABLE public."Bank" OWNER TO postgres;

--
-- Name: BankMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankMovement" (
    id text NOT NULL,
    "bankId" text NOT NULL,
    "invoiceId" text,
    "receiptId" text,
    description text NOT NULL,
    entering numeric(15,2) NOT NULL,
    emerging numeric(15,2) NOT NULL,
    "bankDirection" public."VaultDirection" NOT NULL,
    "bankType" public."VaultType" NOT NULL,
    "bankDocumentType" public."VaultDocumentType" NOT NULL,
    "currentMovementId" text
);


ALTER TABLE public."BankMovement" OWNER TO postgres;

--
-- Name: Branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Branch" (
    id text NOT NULL,
    "branchName" character varying(100) NOT NULL,
    "branchCode" character varying(50) NOT NULL,
    address character varying(250) NOT NULL,
    "countryCode" character varying(3) NOT NULL,
    city character varying(50) NOT NULL,
    district character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    website character varying(100) NOT NULL,
    "companyCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Branch" OWNER TO postgres;

--
-- Name: BranchWarehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BranchWarehouse" (
    id text NOT NULL,
    "branchId" text NOT NULL,
    "warehouseId" text NOT NULL
);


ALTER TABLE public."BranchWarehouse" OWNER TO postgres;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brand" (
    id text NOT NULL,
    "brandName" character varying(100) NOT NULL,
    "brandCode" character varying(50) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Brand" OWNER TO postgres;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id text NOT NULL,
    "companyName" character varying(100) NOT NULL,
    name character varying(100),
    surname character varying(100),
    "companyCode" character varying(50),
    "taxNumber" character varying(50),
    "taxOffice" character varying(50),
    "kepAddress" character varying(50),
    "mersisNo" character varying(50),
    "sicilNo" character varying(50),
    address character varying(300),
    "countryCode" character varying(3),
    city character varying(50),
    district character varying(50),
    "postalCode" character varying(10),
    phone character varying(50),
    email character varying(100),
    website character varying(100),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: Current; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Current" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    "currentName" character varying(100) NOT NULL,
    "currentType" public."CurrentType" DEFAULT 'AliciSatici'::public."CurrentType" NOT NULL,
    institution public."InstitutionType" DEFAULT 'Sahis'::public."InstitutionType" NOT NULL,
    "identityNo" character varying(50),
    "taxNumber" character varying(50),
    "taxOffice" character varying(50),
    title character varying(100),
    name character varying(50),
    surname character varying(50),
    "webSite" character varying(100),
    "birthOfDate" timestamp(3) without time zone,
    "kepAddress" character varying(50),
    "mersisNo" character varying(50),
    "sicilNo" character varying(50),
    "priceListId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Current" OWNER TO postgres;

--
-- Name: CurrentAddress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentAddress" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    "addressName" character varying(50) NOT NULL,
    "addressType" public."AddressType" DEFAULT 'Fatura'::public."AddressType" NOT NULL,
    address character varying(250) NOT NULL,
    "countryCode" character varying(3) NOT NULL,
    city character varying(50) NOT NULL,
    district character varying(50) NOT NULL,
    "postalCode" character varying(10) NOT NULL,
    phone character varying(50) NOT NULL,
    phone2 character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    email2 character varying(100) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentAddress" OWNER TO postgres;

--
-- Name: CurrentBranch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentBranch" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    "branchCode" character varying(50) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentBranch" OWNER TO postgres;

--
-- Name: CurrentCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentCategory" (
    id text NOT NULL,
    "categoryName" character varying(100) NOT NULL,
    "categoryCode" character varying(100) NOT NULL,
    "parentCategoryId" text
);


ALTER TABLE public."CurrentCategory" OWNER TO postgres;

--
-- Name: CurrentCategoryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentCategoryItem" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."CurrentCategoryItem" OWNER TO postgres;

--
-- Name: CurrentFinancial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentFinancial" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    "bankName" character varying(50) NOT NULL,
    "bankBranch" character varying(50) NOT NULL,
    "bankBranchCode" character varying(50) NOT NULL,
    iban character varying(100) NOT NULL,
    "accountNo" numeric(15,4),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentFinancial" OWNER TO postgres;

--
-- Name: CurrentMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentMovement" (
    id text NOT NULL,
    "currentCode" character varying(50),
    "dueDate" timestamp(3) without time zone,
    description character varying(250),
    "debtAmount" numeric(15,4),
    "creditAmount" numeric(15,4),
    "priceListId" text,
    "movementType" public."CurrentMovementType" NOT NULL,
    "documentType" public."CurrentMovementDocumentType",
    "paymentType" public."CurrentPaymentType",
    "documentNo" text,
    "companyCode" text NOT NULL,
    "branchCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentMovement" OWNER TO postgres;

--
-- Name: CurrentOfficials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentOfficials" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    title character varying(100) NOT NULL,
    name character varying(50) NOT NULL,
    surname character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    note character varying(250) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentOfficials" OWNER TO postgres;

--
-- Name: CurrentRisk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CurrentRisk" (
    id text NOT NULL,
    "currentCode" character varying(50) NOT NULL,
    currency character varying(3) NOT NULL,
    "teminatYerelTutar" numeric(15,4),
    "acikHesapYerelLimit" numeric(15,4),
    "hesapKesimGunu" integer,
    "vadeGun" integer,
    "gecikmeLimitGunu" integer,
    "varsayilanAlisIskontosu" numeric(15,4),
    "varsayilanSatisIskontosu" numeric(15,4),
    "ekstreGonder" boolean DEFAULT false,
    "limitKontrol" boolean DEFAULT false,
    "acikHesap" boolean DEFAULT false,
    "posKullanim" boolean DEFAULT false,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."CurrentRisk" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceNo" character varying(50) NOT NULL,
    "gibInvoiceNo" text,
    "invoiceDate" timestamp(3) without time zone,
    "invoiceType" public."InvoiceType",
    "documentType" public."DocumentType",
    "currentCode" text,
    "companyCode" text,
    "branchCode" text NOT NULL,
    "outBranchCode" text,
    "warehouseCode" text NOT NULL,
    description text,
    "genelIskontoTutar" numeric(15,4),
    "genelIskontoOran" numeric(15,4),
    "paymentDate" timestamp(3) without time zone,
    "paymentDay" integer,
    "priceListId" text,
    "totalAmount" numeric(15,4),
    "totalVat" numeric(15,4),
    "totalDiscount" numeric(15,4),
    "totalNet" numeric(15,4),
    "totalPaid" numeric(15,4),
    "totalDebt" numeric(15,4),
    "totalBalance" numeric(15,4),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "canceledAt" timestamp(3) without time zone,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: InvoiceDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InvoiceDetail" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "productCode" text NOT NULL,
    quantity numeric(15,4) NOT NULL,
    "unitPrice" numeric(15,4) NOT NULL,
    "totalPrice" numeric(15,4) NOT NULL,
    "vatRate" numeric(15,4) NOT NULL,
    discount numeric(15,4) NOT NULL,
    "netPrice" numeric(15,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."InvoiceDetail" OWNER TO postgres;

--
-- Name: MarketPlace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlace" (
    id text NOT NULL,
    name text NOT NULL,
    "apiBaseUrl" text NOT NULL,
    "logoUrl" text NOT NULL,
    "companyCode" text
);


ALTER TABLE public."MarketPlace" OWNER TO postgres;

--
-- Name: MarketPlaceAttributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceAttributes" (
    id text NOT NULL,
    "marketPlaceId" text,
    "MarketPlaceCategoriesId" text,
    "attributeName" text,
    "attributeMarketPlaceId" text,
    "valueName" text,
    "valueMarketPlaceId" text,
    required boolean,
    "allowCustom" boolean
);


ALTER TABLE public."MarketPlaceAttributes" OWNER TO postgres;

--
-- Name: MarketPlaceBrands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceBrands" (
    id text NOT NULL,
    "marketPlaceBrandId" text,
    "brandName" text
);


ALTER TABLE public."MarketPlaceBrands" OWNER TO postgres;

--
-- Name: MarketPlaceCategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceCategories" (
    id text NOT NULL,
    "categoryName" text,
    "marketPlaceCategoryId" text,
    "marketPlaceCategoryParentId" text
);


ALTER TABLE public."MarketPlaceCategories" OWNER TO postgres;

--
-- Name: MarketPlaceProductImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceProductImages" (
    id text NOT NULL,
    "imageUrl" text,
    "marketPlaceProductId" text
);


ALTER TABLE public."MarketPlaceProductImages" OWNER TO postgres;

--
-- Name: MarketPlaceProductMatch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceProductMatch" (
    id text NOT NULL,
    "storeId" text,
    "marketPlaceProductId" text,
    "platformProductId" text,
    "platformVariationId" text,
    "marketPlaceSKU" text
);


ALTER TABLE public."MarketPlaceProductMatch" OWNER TO postgres;

--
-- Name: MarketPlaceProducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketPlaceProducts" (
    id text NOT NULL,
    "productType" text,
    "parentProductId" text,
    "productId" text,
    "productName" text,
    "productSku" text,
    description text,
    "shortDescription" text,
    "listPrice" numeric(15,4),
    "salePrice" numeric(15,4),
    barcode text,
    "storeId" text,
    "marketPlaceAttributesId" text,
    "marketPlaceCategoriesId" text,
    "marketPlaceBrandsId" text
);


ALTER TABLE public."MarketPlaceProducts" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    severity text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "readBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "platformOrderId" text NOT NULL,
    platform text NOT NULL,
    "customerId" text NOT NULL,
    status text NOT NULL,
    currency text NOT NULL,
    "orderDate" timestamp(3) without time zone NOT NULL,
    "deliveryType" text,
    "cargoCompany" text,
    "shippingAddressId" text,
    "billingAddressId" text,
    "timeSlot" timestamp(3) without time zone,
    "totalPrice" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderCargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderCargo" (
    id text NOT NULL,
    name text NOT NULL,
    "shortName" text NOT NULL,
    "trackingNumber" text NOT NULL,
    "orderId" text NOT NULL,
    "deliveredAt" timestamp(3) without time zone,
    "deliveryNote" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderCargo" OWNER TO postgres;

--
-- Name: OrderInvoiceAddress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderInvoiceAddress" (
    id text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    "postalCode" text NOT NULL,
    country text NOT NULL,
    "fullName" text NOT NULL,
    email text,
    "paymentMethod" text,
    "transactionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderInvoiceAddress" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "stockCardId" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(15,4) NOT NULL,
    "totalPrice" numeric(15,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    "groupId" text,
    "permissionName" character varying(50) NOT NULL,
    route text,
    description character varying(100) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: PermissionGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PermissionGroup" (
    id text NOT NULL,
    "groupName" character varying(50) NOT NULL,
    description character varying(100),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PermissionGroup" OWNER TO postgres;

--
-- Name: Pos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pos" (
    id text NOT NULL,
    "posName" character varying(50) NOT NULL,
    "branchCode" text NOT NULL,
    balance numeric(15,2) NOT NULL,
    currency text NOT NULL
);


ALTER TABLE public."Pos" OWNER TO postgres;

--
-- Name: PosMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PosMovement" (
    id text NOT NULL,
    "posId" text NOT NULL,
    "invoiceId" text,
    "receiptId" text,
    description text NOT NULL,
    entering numeric(15,2) NOT NULL,
    emerging numeric(15,2) NOT NULL,
    "posDirection" public."VaultDirection" NOT NULL,
    "posType" public."VaultType" NOT NULL,
    "posDocumentType" public."VaultDocumentType" NOT NULL,
    "currentMovementId" text
);


ALTER TABLE public."PosMovement" OWNER TO postgres;

--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Receipt" (
    id text NOT NULL,
    "receiptType" public."ReceiptType" NOT NULL,
    "receiptDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "documentNo" character varying(50) NOT NULL,
    "branchCode" character varying(50) NOT NULL,
    "isTransfer" boolean DEFAULT false NOT NULL,
    "outWarehouse" text,
    "inWarehouse" text,
    description text
);


ALTER TABLE public."Receipt" OWNER TO postgres;

--
-- Name: ReceiptDetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReceiptDetail" (
    id text NOT NULL,
    "receiptId" text NOT NULL,
    "stockCardId" text NOT NULL,
    quantity numeric(15,4) NOT NULL,
    "unitPrice" numeric(15,4) NOT NULL,
    "totalPrice" numeric(15,4) NOT NULL,
    "vatRate" numeric(15,4) NOT NULL,
    discount numeric(15,4) NOT NULL,
    "netPrice" numeric(15,4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."ReceiptDetail" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    "roleName" character varying(50) NOT NULL,
    description character varying(100) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: StockCard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCard" (
    id text NOT NULL,
    "productCode" character varying(100) NOT NULL,
    "productName" character varying(150) NOT NULL,
    unit public."StockUnits" DEFAULT 'Adet'::public."StockUnits" NOT NULL,
    "shortDescription" character varying(150),
    description character varying(250),
    "companyCode" character varying(50),
    "branchCode" character varying(50),
    "brandId" character varying(100),
    "productType" public."ProductType" DEFAULT 'BasitUrun'::public."ProductType" NOT NULL,
    gtip character varying(50),
    "pluCode" character varying(50),
    desi numeric(15,4),
    "adetBoleni" numeric(15,4),
    "siraNo" character varying(50),
    raf character varying(50),
    "karMarji" numeric(15,4),
    "riskQuantities" numeric(15,4),
    maliyet numeric(15,4),
    "maliyetDoviz" character varying(3),
    "stockStatus" boolean DEFAULT true NOT NULL,
    "hasExpirationDate" boolean DEFAULT false NOT NULL,
    "allowNegativeStock" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."StockCard" OWNER TO postgres;

--
-- Name: StockCardAttribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardAttribute" (
    id text NOT NULL,
    "attributeName" character varying(100) NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."StockCardAttribute" OWNER TO postgres;

--
-- Name: StockCardAttributeItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardAttributeItems" (
    id text NOT NULL,
    "attributeId" text NOT NULL,
    "stockCardId" text NOT NULL
);


ALTER TABLE public."StockCardAttributeItems" OWNER TO postgres;

--
-- Name: StockCardBarcode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardBarcode" (
    id text NOT NULL,
    "stockCardId" text NOT NULL,
    barcode character varying(100) NOT NULL
);


ALTER TABLE public."StockCardBarcode" OWNER TO postgres;

--
-- Name: StockCardCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardCategory" (
    id text NOT NULL,
    "categoryName" character varying(100) NOT NULL,
    "categoryCode" character varying(100) NOT NULL,
    "parentCategoryId" text
);


ALTER TABLE public."StockCardCategory" OWNER TO postgres;

--
-- Name: StockCardCategoryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardCategoryItem" (
    id text NOT NULL,
    "stockCardId" text NOT NULL,
    "categoryId" text NOT NULL
);


ALTER TABLE public."StockCardCategoryItem" OWNER TO postgres;

--
-- Name: StockCardEFatura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardEFatura" (
    id text NOT NULL,
    "productCode" character varying(100) NOT NULL,
    "productName" character varying(150) NOT NULL,
    "stockCardId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."StockCardEFatura" OWNER TO postgres;

--
-- Name: StockCardManufacturer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardManufacturer" (
    id text NOT NULL,
    "productCode" character varying(100) NOT NULL,
    "productName" character varying(150) NOT NULL,
    barcode character varying(100) NOT NULL,
    "brandId" character varying(100),
    "stockCardId" text NOT NULL,
    "currentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."StockCardManufacturer" OWNER TO postgres;

--
-- Name: StockCardMarketNames; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardMarketNames" (
    id text NOT NULL,
    "stockCardId" text NOT NULL,
    "marketName" character varying(100) NOT NULL
);


ALTER TABLE public."StockCardMarketNames" OWNER TO postgres;

--
-- Name: StockCardPriceList; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardPriceList" (
    id text NOT NULL,
    "priceListName" character varying(100) NOT NULL,
    currency character varying(3) NOT NULL,
    "isVatIncluded" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."StockCardPriceList" OWNER TO postgres;

--
-- Name: StockCardPriceListItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardPriceListItems" (
    id text NOT NULL,
    "priceListId" text NOT NULL,
    "stockCardId" text NOT NULL,
    price numeric(15,4) NOT NULL,
    "vatRate" numeric(15,4),
    barcode character varying(100)
);


ALTER TABLE public."StockCardPriceListItems" OWNER TO postgres;

--
-- Name: StockCardTaxRate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardTaxRate" (
    id text NOT NULL,
    "stockCardId" text,
    "taxName" character varying(100) NOT NULL,
    "taxRate" numeric(15,4) NOT NULL
);


ALTER TABLE public."StockCardTaxRate" OWNER TO postgres;

--
-- Name: StockCardVariation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardVariation" (
    id text NOT NULL,
    "stockCardId" text NOT NULL,
    "variationName" character varying(100) NOT NULL,
    "variationCode" character varying(100) NOT NULL,
    "variationValue" character varying(100) NOT NULL
);


ALTER TABLE public."StockCardVariation" OWNER TO postgres;

--
-- Name: StockCardWarehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockCardWarehouse" (
    id text NOT NULL,
    "stockCardId" text NOT NULL,
    "warehouseId" text NOT NULL,
    quantity numeric(15,4) NOT NULL
);


ALTER TABLE public."StockCardWarehouse" OWNER TO postgres;

--
-- Name: StockMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockMovement" (
    id text NOT NULL,
    "productCode" text NOT NULL,
    "warehouseCode" text NOT NULL,
    "branchCode" text NOT NULL,
    "currentCode" text,
    "documentType" public."DocumentType",
    "invoiceType" public."InvoiceType",
    "movementType" public."StokManagementType" NOT NULL,
    "documentNo" text,
    "gcCode" public."GCCode",
    type text,
    description text,
    quantity numeric(15,4),
    "unitPrice" numeric(15,4),
    "totalPrice" numeric(15,4),
    "unitOfMeasure" character varying(50),
    "outWarehouseCode" text,
    "priceListId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "updatedAt" timestamp(3) without time zone,
    "updatedBy" text
);


ALTER TABLE public."StockMovement" OWNER TO postgres;

--
-- Name: StockTake; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockTake" (
    id text NOT NULL,
    "stockCardIds" text[],
    "warehouseId" text NOT NULL
);


ALTER TABLE public."StockTake" OWNER TO postgres;

--
-- Name: Store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Store" (
    id text NOT NULL,
    name text NOT NULL,
    "marketPlaceId" text NOT NULL,
    "apiCredentials" text NOT NULL
);


ALTER TABLE public."Store" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    address character varying(250) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "companyCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vault; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vault" (
    id text NOT NULL,
    "vaultName" character varying(50) NOT NULL,
    "branchCode" text NOT NULL,
    balance numeric(15,2) NOT NULL,
    currency text NOT NULL
);


ALTER TABLE public."Vault" OWNER TO postgres;

--
-- Name: VaultMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VaultMovement" (
    id text NOT NULL,
    "vaultId" text NOT NULL,
    "invoiceId" text,
    "receiptId" text,
    description text NOT NULL,
    entering numeric(15,2) NOT NULL,
    emerging numeric(15,2) NOT NULL,
    "vaultDirection" public."VaultDirection" NOT NULL,
    "vaultType" public."VaultType" NOT NULL,
    "vaultDocumentType" public."VaultDocumentType" NOT NULL,
    "currentMovementId" text
);


ALTER TABLE public."VaultMovement" OWNER TO postgres;

--
-- Name: Warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Warehouse" (
    id text NOT NULL,
    "warehouseName" character varying(100) NOT NULL,
    "warehouseCode" character varying(50) NOT NULL,
    address character varying(250) NOT NULL,
    "countryCode" character varying(3) NOT NULL,
    city character varying(50) NOT NULL,
    district character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    "companyCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Warehouse" OWNER TO postgres;

--
-- Name: _MarketPlaceAttributesToMarketPlaceProducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_MarketPlaceAttributesToMarketPlaceProducts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_MarketPlaceAttributesToMarketPlaceProducts" OWNER TO postgres;

--
-- Name: _OrderToStore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_OrderToStore" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_OrderToStore" OWNER TO postgres;

--
-- Name: _PermissionToRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_PermissionToRole" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_PermissionToRole" OWNER TO postgres;

--
-- Name: _PermissionToUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_PermissionToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_PermissionToUser" OWNER TO postgres;

--
-- Name: _ProductsOnCategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProductsOnCategories" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductsOnCategories" OWNER TO postgres;

--
-- Name: _RoleToUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_RoleToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_RoleToUser" OWNER TO postgres;

--
-- Name: _StockCardBarcodeToStockCardVariation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_StockCardBarcodeToStockCardVariation" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_StockCardBarcodeToStockCardVariation" OWNER TO postgres;

--
-- Name: _StockCardPriceListItemsToStockCardVariation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_StockCardPriceListItemsToStockCardVariation" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_StockCardPriceListItemsToStockCardVariation" OWNER TO postgres;

--
-- Name: _StockCardToStore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_StockCardToStore" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_StockCardToStore" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Bank; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bank" (id, "bankName", "branchCode", balance, currency) FROM stdin;
cm5857y23005epa40blz985e5	İş Bankası Ali Rıza SELÇUK	ETC	691.00	TRY
cm5dhz3hi006kqp4786nzja9q	İş Bankası Vipcase Teknoloji Aksesuar	ETC	57995.74	TRY
\.


--
-- Data for Name: BankMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankMovement" (id, "bankId", "invoiceId", "receiptId", description, entering, emerging, "bankDirection", "bankType", "bankDocumentType", "currentMovementId") FROM stdin;
cm5dqwxal0067oa405gy2aavc	cm5dhz3hi006kqp4786nzja9q	\N	\N	Bank payment to 20-T001 - 25.12.2024 Tarihinde Ödeme Yapıldı	22289.26	0.00	Exit	ReceivableTransfer	General	cm5dqwx7a0066oa40za5muwqe
\.


--
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Branch" (id, "branchName", "branchCode", address, "countryCode", city, district, phone, email, website, "companyCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580xfs6005jqo495x69jzw5	E-Ticaret	ETC	15 Mayıs Mahallesi 559/2 Sokak Kızılelma İş Merkezi No: 8A	TR	Denizli	Pamukkale	05387018419	info@alirizaselcuk.com	https://vipcase.com.tr	VIP	2024-12-28 10:13:31.302	2024-12-28 10:13:31.302	\N	\N
\.


--
-- Data for Name: BranchWarehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BranchWarehouse" (id, "branchId", "warehouseId") FROM stdin;
cm580xfs9005kqo49kqqr5oyi	cm580xfs6005jqo495x69jzw5	cm580wneu005iqo493rmbwzp0
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brand" (id, "brandName", "brandCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580sag20008qo5zjtuucjpu	VipCase	VPCS	2024-12-28 10:09:31.106	2024-12-28 10:14:13.334	admin_user	\N
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" (id, "companyName", name, surname, "companyCode", "taxNumber", "taxOffice", "kepAddress", "mersisNo", "sicilNo", address, "countryCode", city, district, "postalCode", phone, email, website, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580vn07005hqo4901b2dgey	VİPCASE TEKNOLOJİ AKSESUAR SANAYİ VE TİCARET LİMİTED ŞİRKETİ	Ali Rıza	Selçuk	VIP	7590596655	SARAYLAR VERGİ DAİRESİ MÜD.	vip.case@hs03.kep.tr	0925-1228-6660-0001		15 Mayıs Mahallesi 559/2 Sokak Kızılelma İş Merkezi No: 8A	TR	Denizli	Pamukkale	20160	05387018419	info@alirizaselcuk.com	https://vipcase.com.tr	2024-12-28 10:12:07.351	2024-12-28 10:12:07.351	\N	\N
\.


--
-- Data for Name: Current; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Current" (id, "currentCode", "currentName", "currentType", institution, "identityNo", "taxNumber", "taxOffice", title, name, surname, "webSite", "birthOfDate", "kepAddress", "mersisNo", "sicilNo", "priceListId", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm5cah5m9005lnp3zi02zdbn2	20-M001	Çınar Bilgisayar 	AliciSatici	Sahis					\N	\N		\N				cm580tr1n005cqo497o75j33g	2024-12-31 09:51:52.498	2024-12-31 09:52:36.227	\N	\N
cm5dhw9st006jqp476pupa9ua	20-T001	CEYPLAST PLASTİK AMBALAJ SAN. VE TİC.A.Ş	Tedarikci	Sirket					\N	\N		\N				cm580ucjs005gqo49kt2dd9xy	2025-01-01 06:07:21.245	2025-01-01 06:07:21.245	\N	\N
\.


--
-- Data for Name: CurrentAddress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentAddress" (id, "currentCode", "addressName", "addressType", address, "countryCode", city, district, "postalCode", phone, phone2, email, email2, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm5cai3d9005nnp3zx55vznv7	20-M001	İş Yeri	Teslimat	Sırakapılar Mah. Gazi M.Kemal Bul. Anıthan İş Hanı No:88/20		Denizli	Pamukkale						2024-12-31 09:52:36.237	2024-12-31 09:52:36.237	\N	\N
\.


--
-- Data for Name: CurrentBranch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentBranch" (id, "currentCode", "branchCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: CurrentCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentCategory" (id, "categoryName", "categoryCode", "parentCategoryId") FROM stdin;
\.


--
-- Data for Name: CurrentCategoryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentCategoryItem" (id, "currentCode", "categoryId") FROM stdin;
\.


--
-- Data for Name: CurrentFinancial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentFinancial" (id, "currentCode", "bankName", "bankBranch", "bankBranchCode", iban, "accountNo", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: CurrentMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentMovement" (id, "currentCode", "dueDate", description, "debtAmount", "creditAmount", "priceListId", "movementType", "documentType", "paymentType", "documentNo", "companyCode", "branchCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm5dqtrqt0065oa40vwnw7591	20-T001	2024-09-30 21:00:00	PUR2025000000001 no'lu alış faturası için cari hareket	22289.2600	0.0000	cm580ucjs005gqo49kt2dd9xy	Borc	Fatura	ÇokluÖdeme	PUR2025000000001	VIP	ETC	2025-01-01 10:17:21.077	2025-01-01 10:17:21.077	\N	\N
cm5dqwx7a0066oa40za5muwqe	20-T001	2024-12-25 00:00:00	25.12.2024 Tarihinde Ödeme Yapıldı	22289.2600	0.0000	\N	Borc	Devir	Banka	\N	VIP	ETC	2025-01-01 10:19:48.118	2025-01-01 10:34:17.147	\N	\N
cm5c6m9oi005yqx3xqdq0trdm	\N	2024-12-31 08:03:52.577	QRS2024000000003 no'lu satış faturası için cari hareket	1.6000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:03:52.578	2024-12-31 08:03:52.578	\N	\N
cm5c6m9ok0060qx3xs4dho66f	\N	2024-12-31 08:03:52.58	QRS2024000000003 no'lu satış faturası için cari hareket	0.0000	1.6000	\N	Alacak	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:03:52.581	2024-12-31 08:03:52.581	\N	\N
cm5c6mywm0066qx3x7zeevhhi	\N	2024-12-31 08:04:25.27	QRS2024000000004 no'lu satış faturası için cari hareket	2.4000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:04:25.271	2024-12-31 08:04:25.271	\N	\N
cm5c6mywp0068qx3xj3s8vhzg	\N	2024-12-31 08:04:25.272	QRS2024000000004 no'lu satış faturası için cari hareket	0.0000	2.4000	\N	Alacak	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:04:25.273	2024-12-31 08:04:25.273	\N	\N
cm5c2m670005ope3xggy0bgws	\N	2024-12-31 06:11:49.594	QRS2024000000001 no'lu satış faturası için cari hareket	0.8000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 06:11:49.597	2024-12-31 06:11:49.597	\N	\N
cm5c2m673005qpe3xhlsvuig7	\N	2024-12-31 06:11:49.598	QRS2024000000001 no'lu satış faturası için cari hareket	0.0000	0.8000	\N	Alacak	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 06:11:49.599	2024-12-31 06:11:49.599	\N	\N
cm5c6krew005oqx3xq70vf3x6	\N	2024-12-31 08:02:42.248	QRS2024000000002 no'lu satış faturası için cari hareket	1.6000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:02:42.249	2024-12-31 08:02:42.249	\N	\N
cm5c6krey005qqx3xg7wiqdyn	\N	2024-12-31 08:02:42.25	QRS2024000000002 no'lu satış faturası için cari hareket	0.0000	1.6000	\N	Alacak	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 08:02:42.251	2024-12-31 08:02:42.251	\N	\N
cm5ce5wxn005vnp3z2sy9bc4q	\N	2024-12-31 11:35:06.488	QRS2024000000001 no'lu satış faturası için cari hareket	0.8000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 11:35:06.492	2024-12-31 11:35:06.492	\N	\N
cm5ce5wxq005xnp3zgep6r9k0	\N	2024-12-31 11:35:06.494	QRS2024000000001 no'lu satış faturası için cari hareket	0.0000	0.8000	\N	Alacak	Fatura	ÇokluÖdeme	\N	VIP	ETC	2024-12-31 11:35:06.495	2024-12-31 11:35:06.495	\N	\N
cm5ce6dsk0063np3zymw7lhao	\N	2024-12-31 11:35:28.34	QRS2024000000001 no'lu satış faturası için cari hareket	0.8000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	QRS2024000000002	VIP	ETC	2024-12-31 11:35:28.34	2024-12-31 11:35:28.34	\N	\N
cm5ceb42e005nnv3sabm1m0kh	\N	2024-12-31 11:39:09.014	QRS2024000000002 no'lu satış faturası için cari hareket	1.6000	0.0000	\N	Borc	Fatura	ÇokluÖdeme	QRS2024000000002	VIP	ETC	2024-12-31 11:39:09.014	2024-12-31 11:39:09.014	\N	\N
\.


--
-- Data for Name: CurrentOfficials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentOfficials" (id, "currentCode", title, name, surname, phone, email, note, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: CurrentRisk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CurrentRisk" (id, "currentCode", currency, "teminatYerelTutar", "acikHesapYerelLimit", "hesapKesimGunu", "vadeGun", "gecikmeLimitGunu", "varsayilanAlisIskontosu", "varsayilanSatisIskontosu", "ekstreGonder", "limitKontrol", "acikHesap", "posKullanim", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, "invoiceNo", "gibInvoiceNo", "invoiceDate", "invoiceType", "documentType", "currentCode", "companyCode", "branchCode", "outBranchCode", "warehouseCode", description, "genelIskontoTutar", "genelIskontoOran", "paymentDate", "paymentDay", "priceListId", "totalAmount", "totalVat", "totalDiscount", "totalNet", "totalPaid", "totalDebt", "totalBalance", "createdAt", "updatedAt", "canceledAt", "createdBy", "updatedBy") FROM stdin;
cm5dqtrq5005zoa40toagruf4	PUR2025000000001		2024-09-30 21:00:00	Purchase	Invoice	20-T001	VIP	ETC	\N	ETC	200 KG Vipcase Baskılı Kargo Poşeti	\N	\N	2024-09-30 21:00:00	0	cm580ucjs005gqo49kt2dd9xy	22289.2600	0.0000	0.0000	22289.2600	0.0000	22289.2600	22289.2600	2025-01-01 10:17:21.054	2025-01-01 10:17:21.054	\N	\N	\N
cm5ce6drz005ynp3z9xxl1hav	QRS2024000000002	\N	2024-12-31 11:39:08.804	Sales	Order	\N	\N	ETC	\N	ETC	QRS2024000000002 no'lu hızlı satış faturası	\N	\N	\N	\N	\N	1.6000	0.0000	0.0000	1.6000	1.6000	1.6000	\N	2024-12-31 11:35:28.32	2024-12-31 11:39:08.995	\N	\N	\N
cm5b3nqfe008bmm3yugfrhfyz	PUR2024000000001		2024-12-30 13:52:49.735	Cancel	Invoice	\N	VIP	ETC	\N	ETC		\N	\N	2024-12-30 13:52:49.735	0	cm580u7tw005fqo493osdadwm	6.4000	0.0000	0.0000	6.4000	0.0000	6.4000	6.4000	2024-12-30 13:53:15.915	2024-12-31 06:08:54.806	\N	\N	\N
cm5cei96o005onv3s6mhzqel9	QRS2024000000003		2024-12-31 11:44:23.635	Cancel	Invoice	\N	VIP	ETC	\N	ETC		\N	\N	2024-12-31 11:44:23.635	0	cm580u7tw005fqo493osdadwm	6.4000	0.0000	0.0000	6.4000	0.0000	6.4000	6.4000	2024-12-31 11:44:42.24	2024-12-31 11:51:17.457	\N	\N	\N
\.


--
-- Data for Name: InvoiceDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InvoiceDetail" (id, "invoiceId", "productCode", quantity, "unitPrice", "totalPrice", "vatRate", discount, "netPrice", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm5ceb424005jnv3s2ricr0jt	cm5ce6drz005ynp3z9xxl1hav	REMA/iP-11/AçıkMavi	2.0000	0.8000	1.6000	0.0000	0.0000	1.6000	2024-12-31 11:39:09.005	2024-12-31 11:39:09.005	\N	\N
cm5cei96v005qnv3st0bk9abg	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/AçıkMavi	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.248	2024-12-31 11:44:42.248	\N	\N
cm5cei970005snv3sk2phsbtd	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/DerinMor	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.253	2024-12-31 11:44:42.253	\N	\N
cm5cei972005unv3snb281u87	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/Kırmızı	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.254	2024-12-31 11:44:42.254	\N	\N
cm5cei974005wnv3swkdhcqno	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/KoyuKırmızı	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.256	2024-12-31 11:44:42.256	\N	\N
cm5cei976005ynv3s9jzdrjtu	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/KoyuMavi	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.258	2024-12-31 11:44:42.258	\N	\N
cm5cei9780060nv3s28g1rga2	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/Pembe	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.26	2024-12-31 11:44:42.26	\N	\N
cm5cei97a0062nv3sshkpfm8o	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/Siyah	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.263	2024-12-31 11:44:42.263	\N	\N
cm5cei97d0064nv3sp75yuhnu	cm5cei96o005onv3s6mhzqel9	REMA/iP-11/Yeşil	1.0000	0.8000	0.8000	0.0000	0.0000	0.8000	2024-12-31 11:44:42.266	2024-12-31 11:44:42.266	\N	\N
cm5dqtrqf0061oa40ehxlqv4o	cm5dqtrq5005zoa40toagruf4	KARGOPOSETI/BASKILI	2.0000	11144.6300	22289.2600	0.0000	0.0000	22289.2600	2025-01-01 10:17:21.064	2025-01-01 10:17:21.064	\N	\N
\.


--
-- Data for Name: MarketPlace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlace" (id, name, "apiBaseUrl", "logoUrl", "companyCode") FROM stdin;
\.


--
-- Data for Name: MarketPlaceAttributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceAttributes" (id, "marketPlaceId", "MarketPlaceCategoriesId", "attributeName", "attributeMarketPlaceId", "valueName", "valueMarketPlaceId", required, "allowCustom") FROM stdin;
\.


--
-- Data for Name: MarketPlaceBrands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceBrands" (id, "marketPlaceBrandId", "brandName") FROM stdin;
\.


--
-- Data for Name: MarketPlaceCategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceCategories" (id, "categoryName", "marketPlaceCategoryId", "marketPlaceCategoryParentId") FROM stdin;
\.


--
-- Data for Name: MarketPlaceProductImages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceProductImages" (id, "imageUrl", "marketPlaceProductId") FROM stdin;
\.


--
-- Data for Name: MarketPlaceProductMatch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceProductMatch" (id, "storeId", "marketPlaceProductId", "platformProductId", "platformVariationId", "marketPlaceSKU") FROM stdin;
\.


--
-- Data for Name: MarketPlaceProducts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketPlaceProducts" (id, "productType", "parentProductId", "productId", "productName", "productSku", description, "shortDescription", "listPrice", "salePrice", barcode, "storeId", "marketPlaceAttributesId", "marketPlaceCategoriesId", "marketPlaceBrandsId") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, title, message, type, severity, read, "readAt", "readBy", "createdAt", "updatedAt") FROM stdin;
cm5f7sh7r005xp91j8so7qlp7	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Kırmızı (REMA/iP-11/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 34 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.407	2025-01-02 11:00:00.424
cm5f7sh83005yp91j0fojnp5l	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Koyu Kırmızı (REMA/iP-11/KoyuKırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 48 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.433	2025-01-02 11:00:00.436
cm5f7sh87005zp91jy2zbtd7a	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Koyu Mavi (REMA/iP-11/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 48 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.438	2025-01-02 11:00:00.439
cm5f7sh8g0060p91j4xe8650c	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pembe (REMA/iP-11/Pembe) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 48 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.446	2025-01-02 11:00:00.448
cm5f7sh8j0061p91jb8qdq9pm	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Siyah (REMA/iP-11/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 48 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.45	2025-01-02 11:00:00.452
cm5f7sh8m0062p91jaiokhr8g	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Yeşil (REMA/iP-11/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 48 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.454	2025-01-02 11:00:00.455
cm5f7sh8r0063p91j67ux9fy3	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Derin Mor (REMA/iP-11Pro/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.458	2025-01-02 11:00:00.46
cm5f7sh8v0064p91j6sonv0y1	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Kırmızı (REMA/iP-11Pro/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.462	2025-01-02 11:00:00.463
cm5f7sh8x0065p91jnawdh0ma	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Mavi (REMA/iP-11Pro/Mavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.464	2025-01-02 11:00:00.465
cm5f7sh900066p91jmc3lahxf	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Siyah (REMA/iP-11Pro/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.467	2025-01-02 11:00:00.468
cm5f7sh920067p91jqnhb0cjt	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Derin Mor (REMA/iP-11ProMax/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.47	2025-01-02 11:00:00.471
cm5f7sh960068p91j33heseav	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Kırmızı (REMA/iP-11ProMax/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.473	2025-01-02 11:00:00.475
cm5f7sh9a0069p91ja9ramn54	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Koyu Kırmızı (REMA/iP-11ProMax/KoyuKırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.478	2025-01-02 11:00:00.479
cm5f7sh9d006ap91jau8trbyp	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Mavi (REMA/iP-11ProMax/Mavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.48	2025-01-02 11:00:00.482
cm5f7sh9g006bp91jegbiawrc	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Siyah (REMA/iP-11ProMax/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.484	2025-01-02 11:00:00.485
cm5f7sh9h006cp91jf1lp738x	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Pro Max Yeşil (REMA/iP-11ProMax/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.485	2025-01-02 11:00:00.486
cm5f7sh9j006dp91j3kyoe2pk	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Derin Mor (REMA/iP-12-12Pro/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.487	2025-01-02 11:00:00.488
cm5f7sh9m006ep91jd9u1d4e0	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Kırmızı (REMA/iP-12-12Pro/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.49	2025-01-02 11:00:00.491
cm5f7sh9o006fp91j5ls79u7l	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Koyu Kırmızı (REMA/iP-12-12Pro/KoyuKırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.491	2025-01-02 11:00:00.492
cm5f7sh9p006gp91jeitet3j6	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Yeşil (REMA/iP-12-12Pro/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.493	2025-01-02 11:00:00.493
cm5f7sh9q006hp91j6i50khkt	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12 Pro Max Siyah (REMA/iP-12ProMax/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.494	2025-01-02 11:00:00.494
cm5f7sh9r006ip91jxmbd228j	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Kırmızı (REMA/iP-13-14/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.495	2025-01-02 11:00:00.495
cm5f7sh9s006jp91jcuebbzan	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Mavi (REMA/iP-13Pro/Mavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.496	2025-01-02 11:00:00.496
cm5f7sh9v006kp91j3b8gfngf	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Yeşil (REMA/iP-13Pro/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.498	2025-01-02 11:00:00.499
cm5f7sh9w006lp91jpp522le9	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Max Yeşil (REMA/iP-13ProMax/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.5	2025-01-02 11:00:00.501
cm5f7sh9y006mp91jthhu7fcq	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Derin Mor (REMA/iP-14Pro/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.502	2025-01-02 11:00:00.503
cm5f7sha0006np91jjxdr7gll	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Max Derin Mor (REMA/iP-14ProMax/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.504	2025-01-02 11:00:00.505
cm5f7sha4006op91j346b1koo	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Max Koyu Mavi (REMA/iP-14ProMax/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.507	2025-01-02 11:00:00.508
cm5f7sha7006pp91jy7gv8iwb	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Plus Beyaz (REMA/iP-15Plus/Beyaz) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.511	2025-01-02 11:00:00.511
cm5f7sha9006qp91jc8vv7ng7	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Beyaz (REMA/iP-15Pro/Beyaz) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.512	2025-01-02 11:00:00.513
cm5f7shab006rp91j9xj6szmu	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Gri (REMA/iP-15Pro/Gri) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.515	2025-01-02 11:00:00.515
cm5f7shac006sp91jye59b4oo	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Siyah (REMA/iP-15Pro/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.516	2025-01-02 11:00:00.517
cm5f7shaf006tp91j9luqfw04	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Max Siyah (REMA/iP-15ProMax/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.519	2025-01-02 11:00:00.52
cm5f7shah006up91jyy18710v	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Mavi (REMA/iP-12-12Pro/Mavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.52	2025-01-02 11:00:00.522
cm5f7sham006vp91jvnhugr6x	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Derin Mor (REMA/iP-13Pro/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.525	2025-01-02 11:00:00.526
cm5f7shao006wp91j0ltljbat	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Kırmızı (REMA/iP-13Pro/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.527	2025-01-02 11:00:00.528
cm5f7shar006xp91jopdr2weq	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Siyah (REMA/iP-14Pro/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.53	2025-01-02 11:00:00.531
cm5f7shat006yp91j20smsg9l	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Yeşil (REMA/iP-14Pro/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.532	2025-01-02 11:00:00.533
cm5f7shav006zp91j7re5s0xo	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Max Siyah (REMA/iP-14ProMax/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.535	2025-01-02 11:00:00.536
cm5f7shax0070p91jk8ogbume	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Koyu Mavi (REMA/iP-15/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.537	2025-01-02 11:00:00.538
cm5f7shb00071p91j9mst8q03	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Siyah (REMA/iP-15/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.54	2025-01-02 11:00:00.541
cm5f7shb20072p91jjmh4ojrc	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Plus Siyah (REMA/iP-15Plus/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.542	2025-01-02 11:00:00.543
cm5f7shb30073p91j3dbnn55y	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Plus Yeşil (REMA/iP-15Plus/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.543	2025-01-02 11:00:00.544
cm5f7shb70074p91j0t0n6laq	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Koyu Mavi (REMA/iP-15Pro/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.544	2025-01-02 11:00:00.547
cm5f7shb90075p91jrl0q4dw5	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12-12 Pro Siyah (REMA/iP-12-12Pro/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.548	2025-01-02 11:00:00.55
cm5f7shbb0076p91jr7vwh85v	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Siyah (REMA/iP-13-14/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.551	2025-01-02 11:00:00.552
cm5f7shbd0077p91jvokta9cb	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Yeşil (REMA/iP-13-14/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.552	2025-01-02 11:00:00.553
cm5f7shbi0078p91jh3ypkdp4	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Siyah (REMA/iP-13Pro/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.557	2025-01-02 11:00:00.558
cm5f7shbj0079p91jm531e6b1	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Koyu Mavi (REMA/iP-14Pro/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.559	2025-01-02 11:00:00.559
cm5f7shbk007ap91jymlc1kht	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Max Kırmızı (REMA/iP-14ProMax/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.56	2025-01-02 11:00:00.56
cm5f7shbl007bp91jtlueodpx	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Beyaz (REMA/iP-15/Beyaz) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.561	2025-01-02 11:00:00.562
cm5f7shbn007cp91jf7cu3ek8	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Max Gri (REMA/iP-15ProMax/Gri) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.562	2025-01-02 11:00:00.563
cm5f7shbn007dp91jj44bljsh	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12 Pro Max Derin Mor (REMA/iP-12ProMax/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.563	2025-01-02 11:00:00.564
cm5f7shbo007ep91jzuutv63j	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12 Pro Max Yeşil (REMA/iP-12ProMax/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.564	2025-01-02 11:00:00.565
cm5f7shbp007fp91juvwd2fih	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Derin Mor (REMA/iP-13-14/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.565	2025-01-02 11:00:00.566
cm5f7shbq007gp91jbi80yy5s	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Koyu Kırmızı (REMA/iP-13-14/KoyuKırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.566	2025-01-02 11:00:00.567
cm5f7shbs007hp91j1zu2wv5c	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13-14 Mavi (REMA/iP-13-14/Mavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.567	2025-01-02 11:00:00.568
cm5f7shbu007ip91j102r74ik	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Max Kırmızı (REMA/iP-13ProMax/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.569	2025-01-02 11:00:00.57
cm5f7shbw007jp91j4ph8lxeu	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Max Koyu Mavi (REMA/iP-13ProMax/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.571	2025-01-02 11:00:00.572
cm5f7shbx007kp91js9oitpxz	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 14 Pro Max Yeşil (REMA/iP-14ProMax/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.572	2025-01-02 11:00:00.573
cm5f7shbx007lp91jkvig162o	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Yeşil (REMA/iP-15/Yeşil) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.573	2025-01-02 11:00:00.574
cm5f7shby007mp91jrsxjmwax	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Plus Koyu Mavi (REMA/iP-15Plus/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.574	2025-01-02 11:00:00.575
cm5f7shbz007np91jmkd2ikdn	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Max Beyaz (REMA/iP-15ProMax/Beyaz) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.575	2025-01-02 11:00:00.576
cm5f7shc1007op91j6n7igds4	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pro Max Koyu Mavi (REMA/iP-15ProMax/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.577	2025-01-02 11:00:00.578
cm5f7shc3007pp91jgun4y7ar	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12 Pro Max Kırmızı (REMA/iP-12ProMax/Kırmızı) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.578	2025-01-02 11:00:00.579
cm5f7shc4007qp91j1ct1jz4m	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 12 Pro Max Koyu Mavi (REMA/iP-12ProMax/KoyuMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.579	2025-01-02 11:00:00.58
cm5f7shc4007rp91j2unk8dm3	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Max Derin Mor (REMA/iP-13ProMax/DerinMor) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.58	2025-01-02 11:00:00.581
cm5f7shc5007sp91j78m4jgnv	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 13 Pro Max Siyah (REMA/iP-13ProMax/Siyah) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.581	2025-01-02 11:00:00.582
cm5f7shc6007tp91jk1ujtwfz	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Pembe (REMA/iP-15/Pembe) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.582	2025-01-02 11:00:00.583
cm5f7shc8007up91jf5788z92	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 15 Plus Pembe (REMA/iP-15Plus/Pembe) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 50 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.583	2025-01-02 11:00:00.584
cm5f7shcc007vp91jvfocwl24	Düşük Stok Uyarısı	Stok Uyarısı: REMA iPhone 11 Açık Mavi (REMA/iP-11/AçıkMavi) - Depo: cm580wneu005iqo493rmbwzp0 stok seviyesi 49 adete düşmüştür.	STOCK_ALERT	WARNING	f	\N	\N	2025-01-02 11:00:00.586	2025-01-02 11:00:00.588
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "platformOrderId", platform, "customerId", status, currency, "orderDate", "deliveryType", "cargoCompany", "shippingAddressId", "billingAddressId", "timeSlot", "totalPrice", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderCargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderCargo" (id, name, "shortName", "trackingNumber", "orderId", "deliveredAt", "deliveryNote", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderInvoiceAddress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderInvoiceAddress" (id, address, city, district, "postalCode", country, "fullName", email, "paymentMethod", "transactionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "stockCardId", quantity, "unitPrice", "totalPrice", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, "groupId", "permissionName", route, description, "createdAt", "updatedAt") FROM stdin;
cm580rpgn0000qo49s8m3sxee	\N	_	/	Permission for /	2024-12-28 10:09:03.911	2024-12-28 10:09:03.911
cm580rph20001qo493s9kmyd7	\N	_*	/*	Permission for /*	2024-12-28 10:09:03.927	2024-12-28 10:09:03.927
cm580rph50002qo49hdz315hm	\N	_secure_data	/secure/data	Permission for /secure/data	2024-12-28 10:09:03.93	2024-12-28 10:09:03.93
cm580rphr0004qo49fprmc2rz	\N	_sync-products_woocommerce	/sync-products/woocommerce	Permission for /sync-products/woocommerce	2024-12-28 10:09:03.952	2024-12-28 10:09:03.952
cm580rpi10005qo49lyqtd7ry	\N	_add-to-stockcard	/add-to-stockcard	Permission for /add-to-stockcard	2024-12-28 10:09:03.962	2024-12-28 10:09:03.962
cm580rpi60006qo4953o64798	\N	_add-to-stockcard-warehouse	/add-to-stockcard-warehouse	Permission for /add-to-stockcard-warehouse	2024-12-28 10:09:03.967	2024-12-28 10:09:03.967
cm580rpic0007qo49loiph85h	\N	_sync-stockcard-woocommerce	/sync-stockcard-woocommerce	Permission for /sync-stockcard-woocommerce	2024-12-28 10:09:03.972	2024-12-28 10:09:03.972
cm580rpie0008qo490rjlunch	\N	_stockcards_createStockCard	/stockcards/createStockCard	Permission for /stockcards/createStockCard	2024-12-28 10:09:03.974	2024-12-28 10:09:03.974
cm580rpig0009qo49knmlz5u6	\N	_stockcards_create	/stockcards/create	Permission for /stockcards/create	2024-12-28 10:09:03.976	2024-12-28 10:09:03.976
cm580rpik000aqo497olcryl3	\N	_stockcards_:id	/stockcards/:id	Permission for /stockcards/:id	2024-12-28 10:09:03.98	2024-12-28 10:09:03.98
cm580rpja000dqo496eofen1z	\N	_stockcards_	/stockcards/	Permission for /stockcards/	2024-12-28 10:09:04.006	2024-12-28 10:09:04.006
cm580rpjd000eqo49iox2b37a	\N	_stockcards_updateStockCardsWithRelations_:id	/stockcards/updateStockCardsWithRelations/:id	Permission for /stockcards/updateStockCardsWithRelations/:id	2024-12-28 10:09:04.009	2024-12-28 10:09:04.009
cm580rpje000fqo4947ctyx9z	\N	_stockcards_deleteStockCardsWithRelations_:id	/stockcards/deleteStockCardsWithRelations/:id	Permission for /stockcards/deleteStockCardsWithRelations/:id	2024-12-28 10:09:04.011	2024-12-28 10:09:04.011
cm580rpjk000gqo49ip7zsyjs	\N	_stockcards_deleteManyStockCardsWithRelations	/stockcards/deleteManyStockCardsWithRelations	Permission for /stockcards/deleteManyStockCardsWithRelations	2024-12-28 10:09:04.017	2024-12-28 10:09:04.017
cm580rpjn000hqo49ly5ig10w	\N	_stockcards_stockCardsWithRelations	/stockcards/stockCardsWithRelations	Permission for /stockcards/stockCardsWithRelations	2024-12-28 10:09:04.019	2024-12-28 10:09:04.019
cm580rpju000iqo493bdf9w3v	\N	_stockcards_stockCardsWithRelations_:id	/stockcards/stockCardsWithRelations/:id	Permission for /stockcards/stockCardsWithRelations/:id	2024-12-28 10:09:04.027	2024-12-28 10:09:04.027
cm580rpjz000jqo49yf89y5nb	\N	_stockcards_search	/stockcards/search	Permission for /stockcards/search	2024-12-28 10:09:04.032	2024-12-28 10:09:04.032
cm580rpk2000kqo49yd8g1dzl	\N	_stockcards_byWarehouse_:id	/stockcards/byWarehouse/:id	Permission for /stockcards/byWarehouse/:id	2024-12-28 10:09:04.034	2024-12-28 10:09:04.034
cm580rpk7000lqo49bw5gnrv0	\N	_stockcards_byWarehouse_search_:id	/stockcards/byWarehouse/search/:id	Permission for /stockcards/byWarehouse/search/:id	2024-12-28 10:09:04.04	2024-12-28 10:09:04.04
cm580rpkh000mqo492h0mtmu2	\N	_priceLists_	/priceLists/	Permission for /priceLists/	2024-12-28 10:09:04.05	2024-12-28 10:09:04.05
cm580rpll000oqo49jgqo0bl3	\N	_priceLists_:id	/priceLists/:id	Permission for /priceLists/:id	2024-12-28 10:09:04.089	2024-12-28 10:09:04.089
cm580rplq000rqo491nf9jg46	\N	_attributes_	/attributes/	Permission for /attributes/	2024-12-28 10:09:04.095	2024-12-28 10:09:04.095
cm580rplv000tqo49f3byqk8j	\N	_attributes_createMany	/attributes/createMany	Permission for /attributes/createMany	2024-12-28 10:09:04.099	2024-12-28 10:09:04.099
cm580rplx000uqo49et17x637	\N	_attributes_:id	/attributes/:id	Permission for /attributes/:id	2024-12-28 10:09:04.102	2024-12-28 10:09:04.102
cm580rpm9000xqo49p8nblhck	\N	_stockMovements_	/stockMovements/	Permission for /stockMovements/	2024-12-28 10:09:04.113	2024-12-28 10:09:04.113
cm580rpmq000zqo496dmzbpmt	\N	_stockMovements_:id	/stockMovements/:id	Permission for /stockMovements/:id	2024-12-28 10:09:04.131	2024-12-28 10:09:04.131
cm580rpn10012qo49h28qoqpv	\N	_stockMovements_orders	/stockMovements/orders	Permission for /stockMovements/orders	2024-12-28 10:09:04.142	2024-12-28 10:09:04.142
cm580rpn90013qo49s5kfbh98	\N	_stockMovements_sales	/stockMovements/sales	Permission for /stockMovements/sales	2024-12-28 10:09:04.15	2024-12-28 10:09:04.15
cm580rpnc0014qo49mdjyl4ht	\N	_stockMovements_purchase	/stockMovements/purchase	Permission for /stockMovements/purchase	2024-12-28 10:09:04.152	2024-12-28 10:09:04.152
cm580rpnh0015qo495c9gk3l5	\N	_stockMovements_byProductCode_:productCode	/stockMovements/byProductCode/:productCode	Permission for /stockMovements/byProductCode/:productCode	2024-12-28 10:09:04.157	2024-12-28 10:09:04.157
cm580rpni0016qo49ms693epf	\N	_companies_	/companies/	Permission for /companies/	2024-12-28 10:09:04.159	2024-12-28 10:09:04.159
cm580rpno0018qo49z2h8qu9z	\N	_companies_:id	/companies/:id	Permission for /companies/:id	2024-12-28 10:09:04.164	2024-12-28 10:09:04.164
cm580rpo0001bqo49kao4p6mz	\N	_companies_filter	/companies/filter	Permission for /companies/filter	2024-12-28 10:09:04.177	2024-12-28 10:09:04.177
cm580rpo5001cqo49tm0ir6bw	\N	_warehouses_	/warehouses/	Permission for /warehouses/	2024-12-28 10:09:04.182	2024-12-28 10:09:04.182
cm580rpoa001eqo49ordszqp4	\N	_warehouses_:id	/warehouses/:id	Permission for /warehouses/:id	2024-12-28 10:09:04.186	2024-12-28 10:09:04.186
cm580rpoi001hqo498qo42972	\N	_warehouses_filter	/warehouses/filter	Permission for /warehouses/filter	2024-12-28 10:09:04.195	2024-12-28 10:09:04.195
cm580rpon001iqo494gwdvz2z	\N	_warehouses_stocktake	/warehouses/stocktake	Permission for /warehouses/stocktake	2024-12-28 10:09:04.199	2024-12-28 10:09:04.199
cm580rpop001jqo49ss158vj9	\N	_warehouses_stocktake_:id	/warehouses/stocktake/:id	Permission for /warehouses/stocktake/:id	2024-12-28 10:09:04.202	2024-12-28 10:09:04.202
cm580rpp4001nqo49rwvppe1u	\N	_branches_	/branches/	Permission for /branches/	2024-12-28 10:09:04.217	2024-12-28 10:09:04.217
cm580rppj001pqo49nwzprse3	\N	_branches_:id	/branches/:id	Permission for /branches/:id	2024-12-28 10:09:04.231	2024-12-28 10:09:04.231
cm580rppy001sqo49qpv6ubmd	\N	_branches_filter	/branches/filter	Permission for /branches/filter	2024-12-28 10:09:04.246	2024-12-28 10:09:04.246
cm580rpq1001tqo49ld3df9pa	\N	_currents_	/currents/	Permission for /currents/	2024-12-28 10:09:04.249	2024-12-28 10:09:04.249
cm580rpqh001vqo49zzms13c8	\N	_currents_:id	/currents/:id	Permission for /currents/:id	2024-12-28 10:09:04.266	2024-12-28 10:09:04.266
cm580rprc001yqo4920mehm2g	\N	_currents_filter	/currents/filter	Permission for /currents/filter	2024-12-28 10:09:04.296	2024-12-28 10:09:04.296
cm580rprq001zqo49kdqbcqwy	\N	_currents_search	/currents/search	Permission for /currents/search	2024-12-28 10:09:04.31	2024-12-28 10:09:04.31
cm580rps30020qo49ms8ikept	\N	_currents_create	/currents/create	Permission for /currents/create	2024-12-28 10:09:04.324	2024-12-28 10:09:04.324
cm580rps90021qo49zq18n4ro	\N	_currents_deleteMany	/currents/deleteMany	Permission for /currents/deleteMany	2024-12-28 10:09:04.329	2024-12-28 10:09:04.329
cm580rpsd0022qo496fs8b026	\N	_currentMovements_	/currentMovements/	Permission for /currentMovements/	2024-12-28 10:09:04.333	2024-12-28 10:09:04.333
cm580rpsn0024qo49udapuaaf	\N	_currentMovements_:id	/currentMovements/:id	Permission for /currentMovements/:id	2024-12-28 10:09:04.344	2024-12-28 10:09:04.344
cm580rpt30027qo49ay0522g8	\N	_currentMovements_filter	/currentMovements/filter	Permission for /currentMovements/filter	2024-12-28 10:09:04.36	2024-12-28 10:09:04.36
cm580rpt90028qo49b93do5wp	\N	_currentMovements_withCurrents	/currentMovements/withCurrents	Permission for /currentMovements/withCurrents	2024-12-28 10:09:04.365	2024-12-28 10:09:04.365
cm580rpti0029qo49bmobhopz	\N	_currentMovements_byCurrent_:currentId	/currentMovements/byCurrent/:currentId	Permission for /currentMovements/byCurrent/:currentId	2024-12-28 10:09:04.374	2024-12-28 10:09:04.374
cm580rptn002aqo49vle031ne	\N	_users_	/users/	Permission for /users/	2024-12-28 10:09:04.38	2024-12-28 10:09:04.38
cm580rpty002bqo49bwfvel0m	\N	_users_create	/users/create	Permission for /users/create	2024-12-28 10:09:04.391	2024-12-28 10:09:04.391
cm580rpu3002cqo49g9mtnwye	\N	_users_:id	/users/:id	Permission for /users/:id	2024-12-28 10:09:04.395	2024-12-28 10:09:04.395
cm580rpum002fqo49tm2ckztq	\N	_users_filter	/users/filter	Permission for /users/filter	2024-12-28 10:09:04.415	2024-12-28 10:09:04.415
cm580rpus002gqo499oo0mhi3	\N	_roles_	/roles/	Permission for /roles/	2024-12-28 10:09:04.42	2024-12-28 10:09:04.42
cm580rpuz002iqo49dyspy8t0	\N	_roles_:id	/roles/:id	Permission for /roles/:id	2024-12-28 10:09:04.428	2024-12-28 10:09:04.428
cm580rpv9002lqo4935f2jzqf	\N	_invoices_	/invoices/	Permission for /invoices/	2024-12-28 10:09:04.437	2024-12-28 10:09:04.437
cm580rpve002nqo4952ngsdm3	\N	_invoices_:id	/invoices/:id	Permission for /invoices/:id	2024-12-28 10:09:04.442	2024-12-28 10:09:04.442
cm580rpvs002qqo49jppt1xnd	\N	_invoices_purchase	/invoices/purchase	Permission for /invoices/purchase	2024-12-28 10:09:04.456	2024-12-28 10:09:04.456
cm580rpw0002rqo49i286k7pa	\N	_invoices_sales	/invoices/sales	Permission for /invoices/sales	2024-12-28 10:09:04.464	2024-12-28 10:09:04.464
cm580rpw8002sqo4965ogq6gh	\N	_invoices_updateInvoiceWithRelations_:id	/invoices/updateInvoiceWithRelations/:id	Permission for /invoices/updateInvoiceWithRelations/:id	2024-12-28 10:09:04.472	2024-12-28 10:09:04.472
cm580rpwb002tqo49ozhzvwvv	\N	_invoices_deleteInvoiceWithRelations_:id	/invoices/deleteInvoiceWithRelations/:id	Permission for /invoices/deleteInvoiceWithRelations/:id	2024-12-28 10:09:04.475	2024-12-28 10:09:04.475
cm580rpwd002uqo49u4cfv1qy	\N	_invoices_invoicesWithRelations	/invoices/invoicesWithRelations	Permission for /invoices/invoicesWithRelations	2024-12-28 10:09:04.478	2024-12-28 10:09:04.478
cm580rpwg002vqo49dre64rkv	\N	_invoices_invoicesWithRelations_:id	/invoices/invoicesWithRelations/:id	Permission for /invoices/invoicesWithRelations/:id	2024-12-28 10:09:04.481	2024-12-28 10:09:04.481
cm580rpwm002wqo4908zbn9oo	\N	_invoices_getLastInvoiceNoByType_:type	/invoices/getLastInvoiceNoByType/:type	Permission for /invoices/getLastInvoiceNoByType/:type	2024-12-28 10:09:04.487	2024-12-28 10:09:04.487
cm580rpwt002xqo49e1h1lkb4	\N	_invoices_getInvoiceInfoById_:id	/invoices/getInvoiceInfoById/:id	Permission for /invoices/getInvoiceInfoById/:id	2024-12-28 10:09:04.494	2024-12-28 10:09:04.494
cm580rpx1002yqo49r1qh24i7	\N	_invoices_createQuickSaleInvoiceWithRelations	/invoices/createQuickSaleInvoiceWithRelations	Permission for /invoices/createQuickSaleInvoiceWithRelations	2024-12-28 10:09:04.502	2024-12-28 10:09:04.502
cm580rpx7002zqo49wpt8x6r1	\N	_categories_	/categories/	Permission for /categories/	2024-12-28 10:09:04.508	2024-12-28 10:09:04.508
cm580rpxb0031qo49vvr895uu	\N	_categories_:id	/categories/:id	Permission for /categories/:id	2024-12-28 10:09:04.512	2024-12-28 10:09:04.512
cm580rpxo0034qo49c3lloyjs	\N	_categories_filter	/categories/filter	Permission for /categories/filter	2024-12-28 10:09:04.524	2024-12-28 10:09:04.524
cm580rpxs0035qo49mmv1kjz4	\N	_categories_withParents	/categories/withParents	Permission for /categories/withParents	2024-12-28 10:09:04.529	2024-12-28 10:09:04.529
cm580rpxx0036qo49dt1s1js6	\N	_receipts_	/receipts/	Permission for /receipts/	2024-12-28 10:09:04.534	2024-12-28 10:09:04.534
cm580rpy40038qo490rw81f2s	\N	_receipts_:id	/receipts/:id	Permission for /receipts/:id	2024-12-28 10:09:04.541	2024-12-28 10:09:04.541
cm580rpyb003bqo496ts5yij5	\N	_receipts_createReceiptWithRelations	/receipts/createReceiptWithRelations	Permission for /receipts/createReceiptWithRelations	2024-12-28 10:09:04.548	2024-12-28 10:09:04.548
cm580rpye003cqo49x4ncii6g	\N	_receipts_updateReceiptWithRelations_:id	/receipts/updateReceiptWithRelations/:id	Permission for /receipts/updateReceiptWithRelations/:id	2024-12-28 10:09:04.55	2024-12-28 10:09:04.55
cm580rpyg003dqo49ousf1rbu	\N	_receipts_deleteReceiptWithRelations_:id	/receipts/deleteReceiptWithRelations/:id	Permission for /receipts/deleteReceiptWithRelations/:id	2024-12-28 10:09:04.552	2024-12-28 10:09:04.552
cm580rpyi003eqo49yrp7med3	\N	_receipts_ReceiptsWithRelations	/receipts/ReceiptsWithRelations	Permission for /receipts/ReceiptsWithRelations	2024-12-28 10:09:04.554	2024-12-28 10:09:04.554
cm580rpyk003fqo49b3aky0y0	\N	_receipts_ReceiptsWithRelations_:id	/receipts/ReceiptsWithRelations/:id	Permission for /receipts/ReceiptsWithRelations/:id	2024-12-28 10:09:04.557	2024-12-28 10:09:04.557
cm580rpyr003gqo49cvi8628r	\N	_vaults_	/vaults/	Permission for /vaults/	2024-12-28 10:09:04.564	2024-12-28 10:09:04.564
cm580rpyu003iqo49vo1u7h5v	\N	_vaults_:id	/vaults/:id	Permission for /vaults/:id	2024-12-28 10:09:04.567	2024-12-28 10:09:04.567
cm580rpyz003lqo49o1yidus2	\N	_vaultMovements_	/vaultMovements/	Permission for /vaultMovements/	2024-12-28 10:09:04.571	2024-12-28 10:09:04.571
cm580rpz2003nqo491a1swwv9	\N	_vaultMovements_:id	/vaultMovements/:id	Permission for /vaultMovements/:id	2024-12-28 10:09:04.575	2024-12-28 10:09:04.575
cm580rpz4003oqo49rs0uf2ei	\N	_vaultMovements_vault_:id	/vaultMovements/vault/:id	Permission for /vaultMovements/vault/:id	2024-12-28 10:09:04.576	2024-12-28 10:09:04.576
cm580rpzb003rqo49wmw3v9hc	\N	_brands_	/brands/	Permission for /brands/	2024-12-28 10:09:04.583	2024-12-28 10:09:04.583
cm580rpzn003tqo49cm1vooq1	\N	_brands_:id	/brands/:id	Permission for /brands/:id	2024-12-28 10:09:04.596	2024-12-28 10:09:04.596
cm580rpzt003wqo49mcn9snjt	\N	_import-stock	/import-stock	Permission for /import-stock	2024-12-28 10:09:04.601	2024-12-28 10:09:04.601
cm580rpzv003xqo49t9dz4ssd	\N	_export-stockcard-sablon	/export-stockcard-sablon	Permission for /export-stockcard-sablon	2024-12-28 10:09:04.603	2024-12-28 10:09:04.603
cm580rq6l0057qo49sahyrxz9	\N	_notifications_check-stock-levels	/notifications/check-stock-levels	Permission for /notifications/check-stock-levels	2024-12-28 10:09:04.845	2024-12-28 10:09:04.845
cm580rq6m0058qo49bug6spnk	\N	_notifications_unread	/notifications/unread	Permission for /notifications/unread	2024-12-28 10:09:04.847	2024-12-28 10:09:04.847
cm580rq6s0059qo49ke8u19mg	\N	_notifications_	/notifications/	Permission for /notifications/	2024-12-28 10:09:04.853	2024-12-28 10:09:04.853
cm580rq7g005bqo49hi8xr21r	\N	_notifications_mark-as-read	/notifications/mark-as-read	Permission for /notifications/mark-as-read	2024-12-28 10:09:04.876	2024-12-28 10:09:04.876
cm580rpzw003yqo49nevp28p6	\N	_webhook_order-created	/webhook/order-created	Permission for /webhook/order-created	2024-12-28 10:09:04.605	2024-12-28 10:09:04.605
cm580rq00003zqo49lmez4o3z	\N	_webhook_order-updated	/webhook/order-updated	Permission for /webhook/order-updated	2024-12-28 10:09:04.608	2024-12-28 10:09:04.608
cm580rq060040qo49q4i7r228	\N	_webhook_orders	/webhook/orders	Permission for /webhook/orders	2024-12-28 10:09:04.615	2024-12-28 10:09:04.615
cm580rq0h0041qo49g6lcfv8p	\N	_webhook_order-details	/webhook/order-details	Permission for /webhook/order-details	2024-12-28 10:09:04.625	2024-12-28 10:09:04.625
cm580rq0k0042qo49ltg0ac5g	\N	_webhook_order-infos	/webhook/order-infos	Permission for /webhook/order-infos	2024-12-28 10:09:04.628	2024-12-28 10:09:04.628
cm580rq0n0043qo492yvglkc9	\N	_auth_register	/auth/register	Permission for /auth/register	2024-12-28 10:09:04.632	2024-12-28 10:09:04.632
cm580rq0r0044qo494ad1q071	\N	_auth_login	/auth/login	Permission for /auth/login	2024-12-28 10:09:04.635	2024-12-28 10:09:04.635
cm580rq0u0045qo49l2qi1z8i	\N	_auth_me	/auth/me	Permission for /auth/me	2024-12-28 10:09:04.638	2024-12-28 10:09:04.638
cm580rq1a0046qo49yehglb44	\N	_permissions_	/permissions/	Permission for /permissions/	2024-12-28 10:09:04.654	2024-12-28 10:09:04.654
cm580rq1d0048qo497gzygzbe	\N	_permissions_:id	/permissions/:id	Permission for /permissions/:id	2024-12-28 10:09:04.657	2024-12-28 10:09:04.657
cm580rq1r0049qo49egj3ajnt	\N	_currentCategories_	/currentCategories/	Permission for /currentCategories/	2024-12-28 10:09:04.671	2024-12-28 10:09:04.671
cm580rq22004bqo49jnmby0wc	\N	_currentCategories_:id	/currentCategories/:id	Permission for /currentCategories/:id	2024-12-28 10:09:04.683	2024-12-28 10:09:04.683
cm580rq2j004eqo497jk8j4l3	\N	_currentCategories_filter	/currentCategories/filter	Permission for /currentCategories/filter	2024-12-28 10:09:04.699	2024-12-28 10:09:04.699
cm580rq2l004fqo49aj5z98x2	\N	_currentCategories_withParents	/currentCategories/withParents	Permission for /currentCategories/withParents	2024-12-28 10:09:04.701	2024-12-28 10:09:04.701
cm580rq2m004gqo499zyu5ywu	\N	_manufacturers_	/manufacturers/	Permission for /manufacturers/	2024-12-28 10:09:04.703	2024-12-28 10:09:04.703
cm580rq37004iqo49vo9aneb0	\N	_manufacturers_:id	/manufacturers/:id	Permission for /manufacturers/:id	2024-12-28 10:09:04.723	2024-12-28 10:09:04.723
cm580rq3n004lqo49xbbu0c7i	\N	_banks_	/banks/	Permission for /banks/	2024-12-28 10:09:04.739	2024-12-28 10:09:04.739
cm580rq3z004nqo49d8p88u7s	\N	_banks_:id	/banks/:id	Permission for /banks/:id	2024-12-28 10:09:04.752	2024-12-28 10:09:04.752
cm580rq4g004qqo49bo3ef8b9	\N	_bankMovements_	/bankMovements/	Permission for /bankMovements/	2024-12-28 10:09:04.768	2024-12-28 10:09:04.768
cm580rq4k004sqo49zm6k0j8i	\N	_bankMovements_:id	/bankMovements/:id	Permission for /bankMovements/:id	2024-12-28 10:09:04.773	2024-12-28 10:09:04.773
cm580rq4t004tqo49srzybc66	\N	_bankMovements_bank_:id	/bankMovements/bank/:id	Permission for /bankMovements/bank/:id	2024-12-28 10:09:04.781	2024-12-28 10:09:04.781
cm580rq5g004wqo49ta17h5iu	\N	_pos_	/pos/	Permission for /pos/	2024-12-28 10:09:04.804	2024-12-28 10:09:04.804
cm580rq5r004yqo49u5vh3s4d	\N	_pos_:id	/pos/:id	Permission for /pos/:id	2024-12-28 10:09:04.816	2024-12-28 10:09:04.816
cm580rq630051qo49z0gizmbl	\N	_posMovements_	/posMovements/	Permission for /posMovements/	2024-12-28 10:09:04.827	2024-12-28 10:09:04.827
cm580rq680053qo49x0lpr6w2	\N	_posMovements_:id	/posMovements/:id	Permission for /posMovements/:id	2024-12-28 10:09:04.832	2024-12-28 10:09:04.832
cm580rq690054qo49tsgqu4nm	\N	_posMovements_pos_:id	/posMovements/pos/:id	Permission for /posMovements/pos/:id	2024-12-28 10:09:04.834	2024-12-28 10:09:04.834
cm580sacc0000qo5z0arzwyfc	\N	create	\N	Create data	2024-12-28 10:09:30.972	2024-12-28 10:09:30.972
cm580sacv0001qo5z018yvkp1	\N	read	\N	Read data	2024-12-28 10:09:30.992	2024-12-28 10:09:30.992
cm580sadc0002qo5z0ou3mm9q	\N	update	\N	Update data	2024-12-28 10:09:31.008	2024-12-28 10:09:31.008
cm580sadg0003qo5z2mbn68vl	\N	delete	\N	Delete data	2024-12-28 10:09:31.013	2024-12-28 10:09:31.013
cm5863azt002rn03whlma6fc3	\N	_invoices_purchase_:id	/invoices/purchase/:id	Permission for /invoices/purchase/:id	2024-12-28 12:38:03.113	2024-12-28 12:38:03.113
cm5863b0g002tn03w78vmyoob	\N	_invoices_sales_:id	/invoices/sales/:id	Permission for /invoices/sales/:id	2024-12-28 12:38:03.137	2024-12-28 12:38:03.137
cm5b1mm2v002tmm3y2ya43ku9	\N	_invoices_purchase_cancel	/invoices/purchase/cancel	Permission for /invoices/purchase/cancel	2024-12-30 12:56:24.391	2024-12-30 12:56:24.391
cm5b1mm3d002xmm3y3cdcileq	\N	_invoices_sales_cancel	/invoices/sales/cancel	Permission for /invoices/sales/cancel	2024-12-30 12:56:24.41	2024-12-30 12:56:24.41
cm5c3wadr0034mq45r22j13dv	\N	_invoices_updateQuickSaleInvoice_:id	/invoices/updateQuickSaleInvoice/:id	Permission for /invoices/updateQuickSaleInvoice/:id	2024-12-31 06:47:41.2	2024-12-31 06:47:41.2
cm5c4l7tj0035p440a8q734f0	\N	_invoices_deleteQuickSaleInvoice_:id	/invoices/deleteQuickSaleInvoice/:id	Permission for /invoices/deleteQuickSaleInvoice/:id	2024-12-31 07:07:04.28	2024-12-31 07:07:04.28
cm5f70q70000cp91jl2eeg2sf	\N	_orders_:orderId_invoice	/orders/:orderId/invoice	Permission for /orders/:orderId/invoice	2025-01-02 10:38:25.693	2025-01-02 10:38:25.693
cm5f70q78000dp91j4a9vjjjh	\N	_orders_invoices	/orders/invoices	Permission for /orders/invoices	2025-01-02 10:38:25.701	2025-01-02 10:38:25.701
cm5f70q7g000ep91jpkl0tbkq	\N	_order_pending_invoices	/order/pending/invoices	Permission for /order/pending/invoices	2025-01-02 10:38:25.708	2025-01-02 10:38:25.708
cm5f70q7l000fp91j2bp37rpv	\N	_invoice_pending_count	/invoice/pending/count	Permission for /invoice/pending/count	2025-01-02 10:38:25.713	2025-01-02 10:38:25.713
cm5f70q7t000gp91jxngy5ms6	\N	_store_:storeId_auto-invoice-toggle	/store/:storeId/auto-invoice-toggle	Permission for /store/:storeId/auto-invoice-toggle	2025-01-02 10:38:25.721	2025-01-02 10:38:25.721
cm5f70qv2004fp91j8vsu009h	\N	_webhook_order-update	/webhook/order-update	Permission for /webhook/order-update	2025-01-02 10:38:26.558	2025-01-02 10:38:26.558
cm5f70r0w005np91juipsiegi	\N	_marketplaces_	/marketplaces/	Permission for /marketplaces/	2025-01-02 10:38:26.768	2025-01-02 10:38:26.768
cm5f70r1a005pp91j3kiq7yjn	\N	_marketplaces_:id	/marketplaces/:id	Permission for /marketplaces/:id	2025-01-02 10:38:26.783	2025-01-02 10:38:26.783
cm5f70r1u005sp91j3fyx583w	\N	_stores_	/stores/	Permission for /stores/	2025-01-02 10:38:26.803	2025-01-02 10:38:26.803
cm5f70r25005up91jkrdz025n	\N	_stores_:id	/stores/:id	Permission for /stores/:id	2025-01-02 10:38:26.813	2025-01-02 10:38:26.813
\.


--
-- Data for Name: PermissionGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PermissionGroup" (id, "groupName", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Pos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pos" (id, "posName", "branchCode", balance, currency) FROM stdin;
cm58586og005fpa40zghcbl5y	İş Bankası	ETC	0.00	TRY
\.


--
-- Data for Name: PosMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PosMovement" (id, "posId", "invoiceId", "receiptId", description, entering, emerging, "posDirection", "posType", "posDocumentType", "currentMovementId") FROM stdin;
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Receipt" (id, "receiptType", "receiptDate", "documentNo", "branchCode", "isTransfer", "outWarehouse", "inWarehouse", description) FROM stdin;
\.


--
-- Data for Name: ReceiptDetail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReceiptDetail" (id, "receiptId", "stockCardId", quantity, "unitPrice", "totalPrice", "vatRate", discount, "netPrice", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, "roleName", description, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580sadk0004qo5zlau6ruuv	admin	Admin role with full access	2024-12-28 10:09:31.017	2024-12-28 10:09:31.017	\N	\N
cm580sadx0005qo5z8ztd4oyr	user	Standard user role with limited access	2024-12-28 10:09:31.029	2024-12-28 10:09:31.029	\N	\N
\.


--
-- Data for Name: StockCard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCard" (id, "productCode", "productName", unit, "shortDescription", description, "companyCode", "branchCode", "brandId", "productType", gtip, "pluCode", desi, "adetBoleni", "siraNo", raf, "karMarji", "riskQuantities", maliyet, "maliyetDoviz", "stockStatus", "hasExpirationDate", "allowNegativeStock", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm5810y6f006hqo494yk8ct6a	REMA/iP-11/DerinMor	REMA iPhone 11 Derin Mor	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.111	2024-12-28 10:16:15.111	\N	\N
cm5810y7i0078qo499o503inm	REMA/iP-11/Kırmızı	REMA iPhone 11 Kırmızı	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.15	2024-12-28 10:16:15.15	\N	\N
cm5810y8g007zqo49ols1soqm	REMA/iP-11/KoyuKırmızı	REMA iPhone 11 Koyu Kırmızı	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.184	2024-12-28 10:16:15.184	\N	\N
cm5810y9e008qqo49xtdla4v6	REMA/iP-11/KoyuMavi	REMA iPhone 11 Koyu Mavi	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.218	2024-12-28 10:16:15.218	\N	\N
cm5810yab009hqo49c6c20v8u	REMA/iP-11/Pembe	REMA iPhone 11 Pembe	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.252	2024-12-28 10:16:15.252	\N	\N
cm5810yb500a8qo49adwabm54	REMA/iP-11/Siyah	REMA iPhone 11 Siyah	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.281	2024-12-28 10:16:15.281	\N	\N
cm5810yc200azqo495vlug6em	REMA/iP-11/Yeşil	REMA iPhone 11 Yeşil	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.315	2024-12-28 10:16:15.315	\N	\N
cm5810ycr00bqqo493so45oku	REMA/iP-11Pro/DerinMor	REMA iPhone 11 Pro Derin Mor	Adet	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.339	2024-12-28 10:16:15.339	\N	\N
cm5810ydl00chqo49zebe93hc	REMA/iP-11Pro/Kırmızı	REMA iPhone 11 Pro Kırmızı	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.369	2024-12-28 10:16:15.369	\N	\N
cm5810yea00d7qo4930j2ndaa	REMA/iP-11Pro/Mavi	REMA iPhone 11 Pro Mavi	Adet	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.394	2024-12-28 10:16:15.394	\N	\N
cm5810yf200dyqo4927lfojk1	REMA/iP-11Pro/Siyah	REMA iPhone 11 Pro Siyah	Adet	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.423	2024-12-28 10:16:15.423	\N	\N
cm5810yfy00eoqo494kvxn0ds	REMA/iP-11ProMax/DerinMor	REMA iPhone 11 Pro Max Derin Mor	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.454	2024-12-28 10:16:15.454	\N	\N
cm5810ygf00ffqo4962b8w9do	REMA/iP-11ProMax/Kırmızı	REMA iPhone 11 Pro Max Kırmızı	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.471	2024-12-28 10:16:15.471	\N	\N
cm5810yh200g5qo49koq2jf25	REMA/iP-11ProMax/KoyuKırmızı	REMA iPhone 11 Pro Max Koyu Kırmızı	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.494	2024-12-28 10:16:15.494	\N	\N
cm5810yhs00gvqo49tnxikehp	REMA/iP-11ProMax/Mavi	REMA iPhone 11 Pro Max Mavi	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.52	2024-12-28 10:16:15.52	\N	\N
cm5810yir00hlqo49x4sgzc5o	REMA/iP-11ProMax/Siyah	REMA iPhone 11 Pro Max Siyah	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.555	2024-12-28 10:16:15.555	\N	\N
cm5810yjf00ibqo491rjrde6k	REMA/iP-11ProMax/Yeşil	REMA iPhone 11 Pro Max Yeşil	Adet	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.579	2024-12-28 10:16:15.579	\N	\N
cm5810yk200j1qo497tyy0f1d	REMA/iP-12-12Pro/DerinMor	REMA iPhone 12-12 Pro Derin Mor	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.602	2024-12-28 10:16:15.602	\N	\N
cm5810ykw00jsqo492ek4wg2l	REMA/iP-12-12Pro/Kırmızı	REMA iPhone 12-12 Pro Kırmızı	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.633	2024-12-28 10:16:15.633	\N	\N
cm5810ylu00kiqo49k40mv1mc	REMA/iP-12-12Pro/KoyuKırmızı	REMA iPhone 12-12 Pro Koyu Kırmızı	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.666	2024-12-28 10:16:15.666	\N	\N
cm5810ynv00moqo4953xnkjjm	REMA/iP-12-12Pro/Yeşil	REMA iPhone 12-12 Pro Yeşil	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.739	2024-12-28 10:16:15.739	\N	\N
cm5810yqs00plqo49zl6utuot	REMA/iP-12ProMax/Siyah	REMA iPhone 12 Pro Max Siyah	Adet	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.844	2024-12-28 10:16:15.844	\N	\N
cm5810ysr00rsqo497k5s4ajz	REMA/iP-13-14/Kırmızı	REMA iPhone 13-14 Kırmızı	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.915	2024-12-28 10:16:15.915	\N	\N
cm5810yw500wvqo49qavnozo5	REMA/iP-13Pro/Mavi	REMA iPhone 13 Pro Mavi	Adet	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.038	2024-12-28 10:16:16.038	\N	\N
cm5810yxq00ybqo493jjp1z4b	REMA/iP-13Pro/Yeşil	REMA iPhone 13 Pro Yeşil	Adet	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.095	2024-12-28 10:16:16.095	\N	\N
cm5810yzy011yqo49hw6vun56	REMA/iP-13ProMax/Yeşil	REMA iPhone 13 Pro Max Yeşil	Adet	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.174	2024-12-28 10:16:16.174	\N	\N
cm5810z0h012oqo49h0w3zpa7	REMA/iP-14Pro/DerinMor	REMA iPhone 14 Pro Derin Mor	Adet	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.193	2024-12-28 10:16:16.193	\N	\N
cm5810z27015lqo494rs8lzi1	REMA/iP-14ProMax/DerinMor	REMA iPhone 14 Pro Max Derin Mor	Adet	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.255	2024-12-28 10:16:16.255	\N	\N
cm5810z360172qo499iquzrpl	REMA/iP-14ProMax/KoyuMavi	REMA iPhone 14 Pro Max Koyu Mavi	Adet	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.291	2024-12-28 10:16:16.291	\N	\N
cm5810z7e01cwqo49543vrblm	REMA/iP-15Plus/Beyaz	REMA iPhone 15 Plus Beyaz	Adet	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.443	2024-12-28 10:16:16.443	\N	\N
cm5810zc401gjqo49enoj2es0	REMA/iP-15Pro/Beyaz	REMA iPhone 15 Pro Beyaz	Adet	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.613	2024-12-28 10:16:16.613	\N	\N
cm5810zco01haqo49ejcpoi8l	REMA/iP-15Pro/Gri	REMA iPhone 15 Pro Gri	Adet	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.632	2024-12-28 10:16:16.632	\N	\N
cm5810zdp01irqo494o0haro0	REMA/iP-15Pro/Siyah	REMA iPhone 15 Pro Siyah	Adet	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.67	2024-12-28 10:16:16.67	\N	\N
cm5810zg801loqo49p3ldvva9	REMA/iP-15ProMax/Siyah	REMA iPhone 15 Pro Max Siyah	Adet	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.76	2024-12-28 10:16:16.76	\N	\N
cm5810ymk00l8qo49k9jp9nkc	REMA/iP-12-12Pro/Mavi	REMA iPhone 12-12 Pro Mavi	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.693	2024-12-28 10:16:15.693	\N	\N
cm5810yv900veqo49dgw78b0s	REMA/iP-13Pro/DerinMor	REMA iPhone 13 Pro Derin Mor	Adet	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.005	2024-12-28 10:16:16.005	\N	\N
cm5810yvo00w5qo49foq2gu77	REMA/iP-13Pro/Kırmızı	REMA iPhone 13 Pro Kırmızı	Adet	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.02	2024-12-28 10:16:16.02	\N	\N
cm5810z170145qo4990ezdi0e	REMA/iP-14Pro/Siyah	REMA iPhone 14 Pro Siyah	Adet	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.219	2024-12-28 10:16:16.219	\N	\N
cm5810z1l014vqo495uhksngx	REMA/iP-14Pro/Yeşil	REMA iPhone 14 Pro Yeşil	Adet	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.234	2024-12-28 10:16:16.234	\N	\N
cm5810z3i017sqo49095g2o6x	REMA/iP-14ProMax/Siyah	REMA iPhone 14 Pro Max Siyah	Adet	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.302	2024-12-28 10:16:16.302	\N	\N
cm5810z5401a0qo490i0mj0fy	REMA/iP-15/KoyuMavi	REMA iPhone 15 Koyu Mavi	Adet	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.361	2024-12-28 10:16:16.361	\N	\N
cm5810z6501bgqo49cvp5l2l9	REMA/iP-15/Siyah	REMA iPhone 15 Siyah	Adet	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.397	2024-12-28 10:16:16.397	\N	\N
cm5810zaj01f3qo49bwhzd6me	REMA/iP-15Plus/Siyah	REMA iPhone 15 Plus Siyah	Adet	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.555	2024-12-28 10:16:16.555	\N	\N
cm5810zbi01ftqo49t4rxkt1r	REMA/iP-15Plus/Yeşil	REMA iPhone 15 Plus Yeşil	Adet	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.59	2024-12-28 10:16:16.59	\N	\N
cm5810zd501i1qo49youqq1py	REMA/iP-15Pro/KoyuMavi	REMA iPhone 15 Pro Koyu Mavi	Adet	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.65	2024-12-28 10:16:16.65	\N	\N
cm5810yn600lyqo496zjvq41g	REMA/iP-12-12Pro/Siyah	REMA iPhone 12-12 Pro Siyah	Adet	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 - 12 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.715	2024-12-28 10:16:15.715	\N	\N
cm5810yua00tyqo49k4r6gcql	REMA/iP-13-14/Siyah	REMA iPhone 13-14 Siyah	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.971	2024-12-28 10:16:15.971	\N	\N
cm5810yur00uoqo49o5hcns7f	REMA/iP-13-14/Yeşil	REMA iPhone 13-14 Yeşil	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.988	2024-12-28 10:16:15.988	\N	\N
cm5810yx000xlqo49572q7567	REMA/iP-13Pro/Siyah	REMA iPhone 13 Pro Siyah	Adet	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.068	2024-12-28 10:16:16.068	\N	\N
cm5810z0t013fqo49okbn556w	REMA/iP-14Pro/KoyuMavi	REMA iPhone 14 Pro Koyu Mavi	Adet	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.205	2024-12-28 10:16:16.205	\N	\N
cm5810z2q016cqo490h9vzsqj	REMA/iP-14ProMax/Kırmızı	REMA iPhone 14 Pro Max Kırmızı	Adet	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.275	2024-12-28 10:16:16.275	\N	\N
cm5810z4n0198qo49mj7diyat	REMA/iP-15/Beyaz	REMA iPhone 15 Beyaz	Adet	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.344	2024-12-28 10:16:16.344	\N	\N
cm5810zet01k8qo49lolcl4b0	REMA/iP-15ProMax/Gri	REMA iPhone 15 Pro Max Gri	Adet	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.71	2024-12-28 10:16:16.71	\N	\N
cm5810yoh00neqo49yy7zofm5	REMA/iP-12ProMax/DerinMor	REMA iPhone 12 Pro Max Derin Mor	Adet	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.762	2024-12-28 10:16:15.762	\N	\N
cm5810yrf00qbqo49hinvhuyo	REMA/iP-12ProMax/Yeşil	REMA iPhone 12 Pro Max Yeşil	Adet	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.867	2024-12-28 10:16:15.867	\N	\N
cm5810ys600r1qo491odxqsjz	REMA/iP-13-14/DerinMor	REMA iPhone 13-14 Derin Mor	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.895	2024-12-28 10:16:15.895	\N	\N
cm5810ytc00siqo49gaaiy482	REMA/iP-13-14/KoyuKırmızı	REMA iPhone 13-14 Koyu Kırmızı	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.936	2024-12-28 10:16:15.936	\N	\N
cm5810ytr00t8qo49pqe7l1jq	REMA/iP-13-14/Mavi	REMA iPhone 13-14 Mavi	Adet	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 - 14 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.952	2024-12-28 10:16:15.952	\N	\N
cm5810yyu00zsqo49wutfl1ea	REMA/iP-13ProMax/Kırmızı	REMA iPhone 13 Pro Max Kırmızı	Adet	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.134	2024-12-28 10:16:16.134	\N	\N
cm5810yz8010iqo49322kfwlr	REMA/iP-13ProMax/KoyuMavi	REMA iPhone 13 Pro Max Koyu Mavi	Adet	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.148	2024-12-28 10:16:16.148	\N	\N
cm5810z45018iqo49o7khwtct	REMA/iP-14ProMax/Yeşil	REMA iPhone 14 Pro Max Yeşil	Adet	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 14 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.325	2024-12-28 10:16:16.325	\N	\N
cm5810z6s01c6qo495ha6n0p7	REMA/iP-15/Yeşil	REMA iPhone 15 Yeşil	Adet	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.42	2024-12-28 10:16:16.42	\N	\N
cm5810z8901dnqo49qp0x9lvj	REMA/iP-15Plus/KoyuMavi	REMA iPhone 15 Plus Koyu Mavi	Adet	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.473	2024-12-28 10:16:16.473	\N	\N
cm5810ze501jhqo49yzo3clt5	REMA/iP-15ProMax/Beyaz	REMA iPhone 15 Pro Max Beyaz	Adet	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.685	2024-12-28 10:16:16.685	\N	\N
cm5810zfq01kyqo49vx9k0byu	REMA/iP-15ProMax/KoyuMavi	REMA iPhone 15 Pro Max Koyu Mavi	Adet	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.743	2024-12-28 10:16:16.743	\N	\N
cm5810ypc00o5qo49ql1rf4ua	REMA/iP-12ProMax/Kırmızı	REMA iPhone 12 Pro Max Kırmızı	Adet	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.792	2024-12-28 10:16:15.792	\N	\N
cm5810yq300ovqo4992ox61mw	REMA/iP-12ProMax/KoyuMavi	REMA iPhone 12 Pro Max Koyu Mavi	Adet	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 12 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.819	2024-12-28 10:16:15.819	\N	\N
cm5810yyc00z1qo49sflyb1q8	REMA/iP-13ProMax/DerinMor	REMA iPhone 13 Pro Max Derin Mor	Adet	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.117	2024-12-28 10:16:16.117	\N	\N
cm5810yzl0118qo49zpafwuyb	REMA/iP-13ProMax/Siyah	REMA iPhone 13 Pro Max Siyah	Adet	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 13 Pro Max Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.161	2024-12-28 10:16:16.161	\N	\N
cm5810z5i01aqqo49zyp50aix	REMA/iP-15/Pembe	REMA iPhone 15 Pembe	Adet	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.375	2024-12-28 10:16:16.375	\N	\N
cm5810z9501edqo495dnq830g	REMA/iP-15Plus/Pembe	REMA iPhone 15 Plus Pembe	Adet	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 15 Plus Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	\N	1.0000	\N	\N	20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:16.505	2024-12-28 10:16:16.505	\N	\N
cm5810y46005pqo49ynbtedva	REMA/iP-11/AçıkMavi	REMA iPhone 11 Açık Mavi	Adet	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	Apple Iphone 11 Magsafe Wireless Şarj Özellikli Silikon 2mm Kamera Çıkıntılı Rema Kılıf	VIP	ETC	cm580sag20008qo5zjtuucjpu	BasitUrun	\N	\N	0.0000	1.0000			20.0000	50.0000	0.8000	USD	t	f	f	2024-12-28 10:16:15.03	2024-12-31 12:55:51.771	\N	\N
cm5dqod1r005roa40kxyhr1b6	KARGOPOSETI/BASKILI	Baskılı Kargo Poşeti 100 KG	Adet			\N	\N	cm580sag20008qo5zjtuucjpu	BasitUrun			0.0000	1.0000			0.0000	0.0000	11144.6300	TRY	t	f	f	2025-01-01 10:13:08.751	2025-01-01 10:13:08.751	\N	\N
\.


--
-- Data for Name: StockCardAttribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardAttribute" (id, "attributeName", value) FROM stdin;
cm5810y4n005tqo4909f6y6x9	Renk	Açık Mavi
cm5810y4w005wqo490mxvwgkh	Cihaz Modeli	iPhone 11
cm5810y6w006nqo49cs3o280b	Renk	Derin Mor
cm5810y7w007eqo490lfm2ldz	Renk	Kırmızı
cm5810y8v0083qo49at801iwz	Renk	Koyu Kırmızı
cm5810y9r008wqo492ibmtm56	Renk	Koyu Mavi
cm5810yal009nqo49ds5ci2sp	Renk	Pembe
cm5810ybm00aeqo49hzot44lm	Renk	Siyah
cm5810ycc00b3qo49fm6hpbet	Renk	Yeşil
cm5810yd200bwqo499x1avipr	Cihaz Modeli	iPhone 11 Pro
cm5810yem00dbqo49kv1tj4ta	Renk	Mavi
cm5810yg400esqo49dmxbbasb	Cihaz Modeli	iPhone 11 Pro Max
cm5810ykg00j7qo49tf2d32eb	Cihaz Modeli	iPhone 12-12 Pro
cm5810yor00niqo498nu46rbz	Cihaz Modeli	iPhone 12 Pro Max
cm5810ysh00r5qo49v2jybnft	Cihaz Modeli	iPhone 13-14
cm5810yve00viqo490aw652h7	Cihaz Modeli	iPhone 13 Pro
cm5810yyi00z5qo49qzyxr4k8	Cihaz Modeli	iPhone 13 Pro Max
cm5810z0l012uqo49fq7ka7q4	Cihaz Modeli	iPhone 14 Pro
cm5810z2h015pqo4933pby6xd	Cihaz Modeli	iPhone 14 Pro Max
cm5810z4u019cqo494sesbpyg	Renk	Beyaz
cm5810z4u019dqo49bel389la	Cihaz Modeli	iPhone 15
cm5810z7r01d0qo49uwsuahqa	Cihaz Modeli	iPhone 15 Plus
cm5810zcc01gnqo497e7sp47q	Cihaz Modeli	iPhone 15 Pro
cm5810zcu01hgqo4949nkl9vn	Renk	Gri
cm5810zef01jnqo49sf7k8pim	Cihaz Modeli	iPhone 15 Pro Max
\.


--
-- Data for Name: StockCardAttributeItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardAttributeItems" (id, "attributeId", "stockCardId") FROM stdin;
cm5810y6w006mqo49ykobh25z	cm5810y4w005wqo490mxvwgkh	cm5810y6f006hqo494yk8ct6a
cm5810y6x006pqo49v0qnah2i	cm5810y6w006nqo49cs3o280b	cm5810y6f006hqo494yk8ct6a
cm5810y7w007dqo49pm6x7ouc	cm5810y4w005wqo490mxvwgkh	cm5810y7i0078qo499o503inm
cm5810y7x007gqo49yaydz28l	cm5810y7w007eqo490lfm2ldz	cm5810y7i0078qo499o503inm
cm5810y8w0085qo49p4g9rmmw	cm5810y4w005wqo490mxvwgkh	cm5810y8g007zqo49ols1soqm
cm5810y8w0087qo49eau9niln	cm5810y8v0083qo49at801iwz	cm5810y8g007zqo49ols1soqm
cm5810y9q008vqo498e2p6pk4	cm5810y4w005wqo490mxvwgkh	cm5810y9e008qqo49xtdla4v6
cm5810y9s008yqo49ifag2bw2	cm5810y9r008wqo492ibmtm56	cm5810y9e008qqo49xtdla4v6
cm5810yal009mqo49fl37piuk	cm5810y4w005wqo490mxvwgkh	cm5810yab009hqo49c6c20v8u
cm5810yam009pqo49b83em4cm	cm5810yal009nqo49ds5ci2sp	cm5810yab009hqo49c6c20v8u
cm5810ybm00adqo492vawrt6p	cm5810y4w005wqo490mxvwgkh	cm5810yb500a8qo49adwabm54
cm5810ybn00agqo49h0cj7c6p	cm5810ybm00aeqo49hzot44lm	cm5810yb500a8qo49adwabm54
cm5810ycc00b5qo49t6hmtqzv	cm5810y4w005wqo490mxvwgkh	cm5810yc200azqo495vlug6em
cm5810ycd00b7qo49r84b7ur8	cm5810ycc00b3qo49fm6hpbet	cm5810yc200azqo495vlug6em
cm5810yd200bvqo49lwlpejdr	cm5810y6w006nqo49cs3o280b	cm5810ycr00bqqo493so45oku
cm5810yd500byqo4986uimlse	cm5810yd200bwqo499x1avipr	cm5810ycr00bqqo493so45oku
cm5810ydu00cmqo490i8fvgo1	cm5810y7w007eqo490lfm2ldz	cm5810ydl00chqo49zebe93hc
cm5810ydu00coqo49orm7656b	cm5810yd200bwqo499x1avipr	cm5810ydl00chqo49zebe93hc
cm5810yen00ddqo499mhwfjd5	cm5810yd200bwqo499x1avipr	cm5810yea00d7qo4930j2ndaa
cm5810yen00dfqo49btklep18	cm5810yem00dbqo49kv1tj4ta	cm5810yea00d7qo4930j2ndaa
cm5810yff00e5qo49cium642m	cm5810ybm00aeqo49hzot44lm	cm5810yf200dyqo4927lfojk1
cm5810yff00e4qo49qm4hyf75	cm5810yd200bwqo499x1avipr	cm5810yf200dyqo4927lfojk1
cm5810yg400euqo49hec0ddtk	cm5810y6w006nqo49cs3o280b	cm5810yfy00eoqo494kvxn0ds
cm5810yg400ewqo49gmj1vl5t	cm5810yg400esqo49dmxbbasb	cm5810yfy00eoqo494kvxn0ds
cm5810ygn00fkqo49x9f8gh8g	cm5810y7w007eqo490lfm2ldz	cm5810ygf00ffqo4962b8w9do
cm5810ygn00fmqo490id146w5	cm5810yg400esqo49dmxbbasb	cm5810ygf00ffqo4962b8w9do
cm5810yhc00gaqo49gu40lhi8	cm5810yg400esqo49dmxbbasb	cm5810yh200g5qo49koq2jf25
cm5810yhd00gcqo495xjfo2rj	cm5810y8v0083qo49at801iwz	cm5810yh200g5qo49koq2jf25
cm5810yi700h0qo49v7vtehf5	cm5810yg400esqo49dmxbbasb	cm5810yhs00gvqo49tnxikehp
cm5810yi800h2qo49q7vc1cra	cm5810yem00dbqo49kv1tj4ta	cm5810yhs00gvqo49tnxikehp
cm5810yj200hqqo49pf4fy080	cm5810yg400esqo49dmxbbasb	cm5810yir00hlqo49x4sgzc5o
cm5810yj200hsqo49463xgks3	cm5810ybm00aeqo49hzot44lm	cm5810yir00hlqo49x4sgzc5o
cm5810yjm00igqo49otbjiwyt	cm5810ycc00b3qo49fm6hpbet	cm5810yjf00ibqo491rjrde6k
cm5810yjn00iiqo49gvxelko9	cm5810yg400esqo49dmxbbasb	cm5810yjf00ibqo491rjrde6k
cm5810ykf00j6qo49r55zct9q	cm5810y6w006nqo49cs3o280b	cm5810yk200j1qo497tyy0f1d
cm5810ykg00j9qo49xfhdtcen	cm5810ykg00j7qo49tf2d32eb	cm5810yk200j1qo497tyy0f1d
cm5810yl800jxqo49ozurhhzi	cm5810ykg00j7qo49tf2d32eb	cm5810ykw00jsqo492ek4wg2l
cm5810yl800jzqo49w9d8ihjb	cm5810y7w007eqo490lfm2ldz	cm5810ykw00jsqo492ek4wg2l
cm5810ym400knqo496rdnqasz	cm5810ykg00j7qo49tf2d32eb	cm5810ylu00kiqo49k40mv1mc
cm5810ym400kpqo49yuab478q	cm5810y8v0083qo49at801iwz	cm5810ylu00kiqo49k40mv1mc
cm5810yms00ldqo49o613jqtk	cm5810ykg00j7qo49tf2d32eb	cm5810ymk00l8qo49k9jp9nkc
cm5810yms00lfqo49viy9ln5e	cm5810yem00dbqo49kv1tj4ta	cm5810ymk00l8qo49k9jp9nkc
cm5810ynl00m3qo49ttsry5o2	cm5810ykg00j7qo49tf2d32eb	cm5810yn600lyqo496zjvq41g
cm5810ynl00m5qo492b5jtgks	cm5810ybm00aeqo49hzot44lm	cm5810yn600lyqo496zjvq41g
cm5810yo300mtqo49h3gsnak7	cm5810ykg00j7qo49tf2d32eb	cm5810ynv00moqo4953xnkjjm
cm5810yo400mvqo49qni2annz	cm5810ycc00b3qo49fm6hpbet	cm5810ynv00moqo4953xnkjjm
cm5810yor00nkqo49pyhpq8d9	cm5810y6w006nqo49cs3o280b	cm5810yoh00neqo49yy7zofm5
cm5810you00nmqo496hn702io	cm5810yor00niqo498nu46rbz	cm5810yoh00neqo49yy7zofm5
cm5810ypn00oaqo49fhrfc3vq	cm5810y7w007eqo490lfm2ldz	cm5810ypc00o5qo49ql1rf4ua
cm5810ypn00ocqo49fpd42333	cm5810yor00niqo498nu46rbz	cm5810ypc00o5qo49ql1rf4ua
cm5810yqe00p0qo49kgup6qls	cm5810yor00niqo498nu46rbz	cm5810yq300ovqo4992ox61mw
cm5810yqe00p2qo492iwmn5f0	cm5810y9r008wqo492ibmtm56	cm5810yq300ovqo4992ox61mw
cm5810yr200pqqo49lk4w6bzd	cm5810yor00niqo498nu46rbz	cm5810yqs00plqo49zl6utuot
cm5810yr300psqo49dmfcm72x	cm5810ybm00aeqo49hzot44lm	cm5810yqs00plqo49zl6utuot
cm5810yrr00qgqo492h44yqcs	cm5810yor00niqo498nu46rbz	cm5810yrf00qbqo49hinvhuyo
cm5810yrr00qiqo49ffe4cylt	cm5810ycc00b3qo49fm6hpbet	cm5810yrf00qbqo49hinvhuyo
cm5810ysh00r7qo490i005un8	cm5810y6w006nqo49cs3o280b	cm5810ys600r1qo491odxqsjz
cm5810ysi00r9qo49ivx12s36	cm5810ysh00r5qo49v2jybnft	cm5810ys600r1qo491odxqsjz
cm5810yt100rxqo49j1ce9qm1	cm5810y7w007eqo490lfm2ldz	cm5810ysr00rsqo497k5s4ajz
cm5810yt100rzqo49hmeftvjz	cm5810ysh00r5qo49v2jybnft	cm5810ysr00rsqo497k5s4ajz
cm5810yth00snqo49mnr9uqdz	cm5810y8v0083qo49at801iwz	cm5810ytc00siqo49gaaiy482
cm5810yti00spqo49s9foeiu7	cm5810ysh00r5qo49v2jybnft	cm5810ytc00siqo49gaaiy482
cm5810yty00tdqo49ei1ghbgz	cm5810ysh00r5qo49v2jybnft	cm5810ytr00t8qo49pqe7l1jq
cm5810yty00tfqo49vfvf4pk6	cm5810yem00dbqo49kv1tj4ta	cm5810ytr00t8qo49pqe7l1jq
cm5810yug00u3qo49osctbjjy	cm5810ybm00aeqo49hzot44lm	cm5810yua00tyqo49k4r6gcql
cm5810yug00u5qo49hhx3f0sx	cm5810ysh00r5qo49v2jybnft	cm5810yua00tyqo49k4r6gcql
cm5810yux00utqo495uaxibnd	cm5810ysh00r5qo49v2jybnft	cm5810yur00uoqo49o5hcns7f
cm5810yux00uvqo49svebj0xu	cm5810ycc00b3qo49fm6hpbet	cm5810yur00uoqo49o5hcns7f
cm5810yve00vmqo499y67ogft	cm5810yve00viqo490aw652h7	cm5810yv900veqo49dgw78b0s
cm5810yve00vlqo4928pip1zz	cm5810y6w006nqo49cs3o280b	cm5810yv900veqo49dgw78b0s
cm5810yvt00waqo49lh4zwij0	cm5810y7w007eqo490lfm2ldz	cm5810yvo00w5qo49foq2gu77
cm5810yvt00wcqo49i4ftq26i	cm5810yve00viqo490aw652h7	cm5810yvo00w5qo49foq2gu77
cm5810ywd00x0qo49fwnjz7fw	cm5810yve00viqo490aw652h7	cm5810yw500wvqo49qavnozo5
cm5810ywe00x2qo4966aiy8fi	cm5810yem00dbqo49kv1tj4ta	cm5810yw500wvqo49qavnozo5
cm5810yxc00xqqo49w19o47z2	cm5810yve00viqo490aw652h7	cm5810yx000xlqo49572q7567
cm5810yyj00z9qo49tnqm2bof	cm5810yyi00z5qo49qzyxr4k8	cm5810yyc00z1qo49sflyb1q8
cm5810yzr011fqo49ehzphwvk	cm5810yyi00z5qo49qzyxr4k8	cm5810yzl0118qo49zpafwuyb
cm5810z0l012tqo49h9dgm8rb	cm5810y6w006nqo49cs3o280b	cm5810z0h012oqo49h0w3zpa7
cm5810z3b0179qo495oacgfo9	cm5810z2h015pqo4933pby6xd	cm5810z360172qo499iquzrpl
cm5810z4d018nqo499qkgnzcx	cm5810z2h015pqo4933pby6xd	cm5810z45018iqo49o7khwtct
cm5810z5u01avqo49fmw3yjh9	cm5810yal009nqo49ds5ci2sp	cm5810z5i01aqqo49zyp50aix
cm5810z6f01bnqo49z0txvtp9	cm5810z4u019dqo49bel389la	cm5810z6501bgqo49cvp5l2l9
cm5810z7001cdqo49uthflzz5	cm5810z4u019dqo49bel389la	cm5810z6s01c6qo495ha6n0p7
cm5810z9l01eiqo49nun3eh1c	cm5810z7r01d0qo49uwsuahqa	cm5810z9501edqo495dnq830g
cm5810zbr01g0qo49f5gs2hqb	cm5810z7r01d0qo49uwsuahqa	cm5810zbi01ftqo49t4rxkt1r
cm5810zcv01hiqo49bkffjsvc	cm5810zcu01hgqo4949nkl9vn	cm5810zco01haqo49ejcpoi8l
cm5810zdd01i8qo4957u6089b	cm5810zcc01gnqo497e7sp47q	cm5810zd501i1qo49youqq1py
cm5810yxc00xsqo49dokmhv2j	cm5810ybm00aeqo49hzot44lm	cm5810yx000xlqo49572q7567
cm5810yyj00z7qo49y44hbkq3	cm5810y6w006nqo49cs3o280b	cm5810yyc00z1qo49sflyb1q8
cm5810z0z013kqo49am82k6pt	cm5810z0l012uqo49fq7ka7q4	cm5810z0t013fqo49okbn556w
cm5810z2w016jqo49sfuo8ok7	cm5810y7w007eqo490lfm2ldz	cm5810z2q016cqo490h9vzsqj
cm5810z3o017zqo49jp9do7hd	cm5810z2h015pqo4933pby6xd	cm5810z3i017sqo49095g2o6x
cm5810z4u019fqo49jpuvpo4o	cm5810z4u019cqo494sesbpyg	cm5810z4n0198qo49mj7diyat
cm5810z5u01axqo495jg99tei	cm5810z4u019dqo49bel389la	cm5810z5i01aqqo49zyp50aix
cm5810z9m01ekqo499cfgf72w	cm5810yal009nqo49ds5ci2sp	cm5810z9501edqo495dnq830g
cm5810zcc01grqo49agzm74n2	cm5810zcc01gnqo497e7sp47q	cm5810zc401gjqo49enoj2es0
cm5810zeg01jpqo49324kxiqt	cm5810zef01jnqo49sf7k8pim	cm5810ze501jhqo49yzo3clt5
cm5810zfe01kdqo49xjbz48zk	cm5810zcu01hgqo4949nkl9vn	cm5810zet01k8qo49lolcl4b0
cm5810zfx01l5qo49v56amudm	cm5810zef01jnqo49sf7k8pim	cm5810zfq01kyqo49vx9k0byu
cm5810yy200ygqo49vbam1mzp	cm5810yve00viqo490aw652h7	cm5810yxq00ybqo493jjp1z4b
cm5810yyz00zzqo49w165lou2	cm5810yyi00z5qo49qzyxr4k8	cm5810yyu00zsqo49wutfl1ea
cm5810z0m012wqo49g1943a1f	cm5810z0l012uqo49fq7ka7q4	cm5810z0h012oqo49h0w3zpa7
cm5810z1d014aqo49altukl83	cm5810z0l012uqo49fq7ka7q4	cm5810z170145qo4990ezdi0e
cm5810z1u0152qo497yertedm	cm5810z0l012uqo49fq7ka7q4	cm5810z1l014vqo495uhksngx
cm5810z3o017xqo49q4yvh7va	cm5810ybm00aeqo49hzot44lm	cm5810z3i017sqo49095g2o6x
cm5810z4u019hqo49ztc4ekmw	cm5810z4u019dqo49bel389la	cm5810z4n0198qo49mj7diyat
cm5810z5901a5qo49uucjxb2r	cm5810y9r008wqo492ibmtm56	cm5810z5401a0qo490i0mj0fy
cm5810z6e01blqo49e8f5au8c	cm5810ybm00aeqo49hzot44lm	cm5810z6501bgqo49cvp5l2l9
cm5810z7r01d4qo49mrszn0a5	cm5810z7r01d0qo49uwsuahqa	cm5810z7e01cwqo49543vrblm
cm5810zb201f8qo4933hz2542	cm5810ybm00aeqo49hzot44lm	cm5810zaj01f3qo49bwhzd6me
cm5810zbr01fyqo49oqeg00wl	cm5810ycc00b3qo49fm6hpbet	cm5810zbi01ftqo49t4rxkt1r
cm5810zdd01i6qo49n9ycoprn	cm5810y9r008wqo492ibmtm56	cm5810zd501i1qo49youqq1py
cm5810zdw01iyqo499vw1koyl	cm5810zcc01gnqo497e7sp47q	cm5810zdp01irqo494o0haro0
cm5810zgd01ltqo49ddiqunqr	cm5810zef01jnqo49sf7k8pim	cm5810zg801loqo49p3ldvva9
cm5810yy300yiqo49uwu8lbov	cm5810ycc00b3qo49fm6hpbet	cm5810yxq00ybqo493jjp1z4b
cm5810yzc010pqo49yw43z5k1	cm5810yyi00z5qo49qzyxr4k8	cm5810yz8010iqo49322kfwlr
cm5810yzq011dqo49g1cq7ve3	cm5810ybm00aeqo49hzot44lm	cm5810yzl0118qo49zpafwuyb
cm5810z040125qo49kziap3s6	cm5810ycc00b3qo49fm6hpbet	cm5810yzy011yqo49hw6vun56
cm5810z1d014cqo49fcrxi29d	cm5810ybm00aeqo49hzot44lm	cm5810z170145qo4990ezdi0e
cm5810z1u0150qo493pll6dr1	cm5810ycc00b3qo49fm6hpbet	cm5810z1l014vqo495uhksngx
cm5810z2i015tqo49iw8amh7j	cm5810z2h015pqo4933pby6xd	cm5810z27015lqo494rs8lzi1
cm5810z2w016hqo4933yjpiyl	cm5810z2h015pqo4933pby6xd	cm5810z2q016cqo490h9vzsqj
cm5810z3b0177qo493icbjm7v	cm5810y9r008wqo492ibmtm56	cm5810z360172qo499iquzrpl
cm5810z5901a7qo49fhf2va0g	cm5810z4u019dqo49bel389la	cm5810z5401a0qo490i0mj0fy
cm5810z7r01d2qo49suck076t	cm5810z4u019cqo494sesbpyg	cm5810z7e01cwqo49543vrblm
cm5810z8m01dsqo499rxc9dfp	cm5810z7r01d0qo49uwsuahqa	cm5810z8901dnqo49qp0x9lvj
cm5810zcc01gpqo49vlo3zym4	cm5810z4u019cqo494sesbpyg	cm5810zc401gjqo49enoj2es0
cm5810zcu01hfqo49vlg6xj9u	cm5810zcc01gnqo497e7sp47q	cm5810zco01haqo49ejcpoi8l
cm5810zdw01iwqo49avabkp78	cm5810ybm00aeqo49hzot44lm	cm5810zdp01irqo494o0haro0
cm5810zfe01kfqo49j3syqd6d	cm5810zef01jnqo49sf7k8pim	cm5810zet01k8qo49lolcl4b0
cm5810zgd01lvqo49swk5ldal	cm5810ybm00aeqo49hzot44lm	cm5810zg801loqo49p3ldvva9
cm5810yyz00zxqo49nnka9ocy	cm5810y7w007eqo490lfm2ldz	cm5810yyu00zsqo49wutfl1ea
cm5810yzc010nqo492917l0dt	cm5810y9r008wqo492ibmtm56	cm5810yz8010iqo49322kfwlr
cm5810z040123qo4910f7ye8u	cm5810yyi00z5qo49qzyxr4k8	cm5810yzy011yqo49hw6vun56
cm5810z0z013mqo498d2eudiz	cm5810y9r008wqo492ibmtm56	cm5810z0t013fqo49okbn556w
cm5810z2i015rqo49dar5v44m	cm5810y6w006nqo49cs3o280b	cm5810z27015lqo494rs8lzi1
cm5810z4e018pqo49e7rzc7o8	cm5810ycc00b3qo49fm6hpbet	cm5810z45018iqo49o7khwtct
cm5810z7001ccqo49c6urgbvz	cm5810ycc00b3qo49fm6hpbet	cm5810z6s01c6qo495ha6n0p7
cm5810z8n01duqo49pvvzv4gg	cm5810y9r008wqo492ibmtm56	cm5810z8901dnqo49qp0x9lvj
cm5810zb301faqo49qnne89a5	cm5810z7r01d0qo49uwsuahqa	cm5810zaj01f3qo49bwhzd6me
cm5810zef01jmqo49sfxkmgab	cm5810z4u019cqo494sesbpyg	cm5810ze501jhqo49yzo3clt5
cm5810zfw01l3qo490wwvstmf	cm5810y9r008wqo492ibmtm56	cm5810zfq01kyqo49vx9k0byu
cm5ch1rkw0061qp47seysxlqk	cm5810y4n005tqo4909f6y6x9	cm5810y46005pqo49ynbtedva
cm5ch1rkw0062qp47bp3upq19	cm5810y4w005wqo490mxvwgkh	cm5810y46005pqo49ynbtedva
\.


--
-- Data for Name: StockCardBarcode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardBarcode" (id, "stockCardId", barcode) FROM stdin;
cm5810y83007uqo49p3z33q7j	cm5810y7i0078qo499o503inm	8683606399258
cm5810ya2009bqo49yygo7vul	cm5810y9e008qqo49xtdla4v6	8683606399234
cm5810ybt00atqo492sfok57g	cm5810yb500a8qo49adwabm54	8683606399251
cm5810yci00blqo49el6e2y3u	cm5810yc200azqo495vlug6em	8683606399296
cm5810yes00drqo49atx0iyhe	cm5810yea00d7qo4930j2ndaa	REMA/iP-11Pro/Mavi
cm5810yg900f8qo49id7j7lqa	cm5810yfy00eoqo494kvxn0ds	REMA/iP-11ProMax/DerinMor
cm5810yjr00iwqo49mjux6u08	cm5810yjf00ibqo491rjrde6k	82091382173981
cm5810yp300o0qo49c3mw4kmg	cm5810yoh00neqo49yy7zofm5	REMA/iP-12ProMax/DerinMor
cm5810ypw00oqqo49p3h3e5fh	cm5810ypc00o5qo49ql1rf4ua	2187638721638713
cm5810yu300trqo49tb5entgt	cm5810ytr00t8qo49pqe7l1jq	REMA/iP-13-14/Mavi
cm5810yvw00woqo49shddksu8	cm5810yvo00w5qo49foq2gu77	REMA/iP-13Pro/Kırmızı
cm5810ywn00xgqo494p81vunv	cm5810yw500wvqo49qavnozo5	8683606399439
cm5810yy800yuqo49nwnz621w	cm5810yxq00ybqo493jjp1z4b	REMA/iP-13Pro/Yeşil
cm5810yzf0111qo49ok0txhnv	cm5810yz8010iqo49322kfwlr	8683606399477
cm5810z0a012hqo499y6g3fml	cm5810yzy011yqo49hw6vun56	REMA/iP-13ProMax/Yeşil
cm5810z30016xqo49pj869un5	cm5810z2q016cqo490h9vzsqj	1
cm5810z3s018bqo49fgd9o04a	cm5810z3i017sqo49095g2o6x	REMA/iP-14ProMax/Siyah
cm5810z5b01ajqo49u6a8o1zc	cm5810z5401a0qo490i0mj0fy	REMA/iP-15/KoyuMavi
cm5810z5z01bbqo49tdn80oa3	cm5810z5i01aqqo49zyp50aix	REMA/iP-15/Pembe
cm5810z6k01c0qo497oqlvkub	cm5810z6501bgqo49cvp5l2l9	8683603022581
cm5810z8t01e7qo4962fsm33e	cm5810z8901dnqo49qp0x9lvj	REMA/iP-15Plus/KoyuMavi
cm5810zb901fmqo49jrg4c8f3	cm5810zaj01f3qo49bwhzd6me	REMA/iP-15Plus/Siyah
cm5810zcg01h3qo49999dteyb	cm5810zc401gjqo49enoj2es0	REMA/iP-15Pro/Beyaz
cm5810zcy01hwqo49aur3lzeg	cm5810zco01haqo49ejcpoi8l	8683603022697
cm5810y710073qo49sxvl0fj2	cm5810y6f006hqo494yk8ct6a	8683606399227
cm5810y710072qo494ubk2pbi	cm5810y6f006hqo494yk8ct6a	REMA/iP-11/DerinMor
cm5810y83007tqo49oapiiu7j	cm5810y7i0078qo499o503inm	REMA/iP-11/Kırmızı
cm5810y95008lqo49lx85ijfn	cm5810y8g007zqo49ols1soqm	8683606399289
cm5810y95008kqo497u5kxsz5	cm5810y8g007zqo49ols1soqm	REMA/iP-11/KoyuKırmızı
cm5810ya2009cqo49svembqkl	cm5810y9e008qqo49xtdla4v6	REMA/iP-11/KoyuMavi
cm5810yaq00a1qo49dpk7l37v	cm5810yab009hqo49c6c20v8u	REMA/iP-11/Pembe
cm5810yar00a3qo49ubztrqyt	cm5810yab009hqo49c6c20v8u	8683606399282
cm5810ybt00auqo494ogehcnd	cm5810yb500a8qo49adwabm54	REMA/iP-11/Siyah
cm5810ych00bjqo49i6uubchx	cm5810yc200azqo495vlug6em	REMA/iP-11/Yeşil
cm5810yda00ccqo49qzsrzx1m	cm5810ycr00bqqo493so45oku	2318763872136871
cm5810yda00caqo49uy1uhp1j	cm5810ycr00bqqo493so45oku	REMA/iP-11Pro/DerinMor
cm5810ye100d0qo49x2gspiss	cm5810ydl00chqo49zebe93hc	31287389219831
cm5810ye100d2qo496dbiba50	cm5810ydl00chqo49zebe93hc	REMA/iP-11Pro/Kırmızı
cm5810yes00dtqo49f0zx4nas	cm5810yea00d7qo4930j2ndaa	2819392187398213
cm5810yfn00ehqo491fu04ozg	cm5810yf200dyqo4927lfojk1	REMA/iP-11Pro/Siyah
cm5810yfn00ejqo49qgig6ohb	cm5810yf200dyqo4927lfojk1	8683606399340
cm5810yg900faqo49pze8q5dh	cm5810yfy00eoqo494kvxn0ds	2321321832311
cm5810ygv00g0qo49fcy9bbtl	cm5810ygf00ffqo4962b8w9do	REMA/iP-11ProMax/Kırmızı
cm5810ygv00fzqo49t9gu9xxy	cm5810ygf00ffqo4962b8w9do	3
cm5810yhh00gqqo497exgd893	cm5810yh200g5qo49koq2jf25	213721931231
cm5810yhh00gpqo498dttm7u2	cm5810yh200g5qo49koq2jf25	REMA/iP-11ProMax/KoyuKırmızı
cm5810yie00hgqo49ffzl7ne6	cm5810yhs00gvqo49tnxikehp	REMA/iP-11ProMax/Mavi
cm5810yie00hfqo491n47g093	cm5810yhs00gvqo49tnxikehp	21321321214231
cm5810yj700i4qo49hocq8qcz	cm5810yir00hlqo49x4sgzc5o	REMA/iP-11ProMax/Siyah
cm5810yj700i6qo494yezmfkx	cm5810yir00hlqo49x4sgzc5o	8683606399347
cm5810yjr00iuqo49nkt9s7zp	cm5810yjf00ibqo491rjrde6k	REMA/iP-11ProMax/Yeşil
cm5810ykm00jmqo49ordwb008	cm5810yk200j1qo497tyy0f1d	REMA/iP-12-12Pro/DerinMor
cm5810ykm00jnqo49dpgu9l6x	cm5810yk200j1qo497tyy0f1d	8683606399197
cm5810ylf00kdqo49dkr07xbn	cm5810ykw00jsqo492ek4wg2l	221382163872163
cm5810ylf00kbqo49n1ij1hgu	cm5810ykw00jsqo492ek4wg2l	REMA/iP-12-12Pro/Kırmızı
cm5810ymb00l3qo491chb50xq	cm5810ylu00kiqo49k40mv1mc	REMA/iP-12-12Pro/KoyuKırmızı
cm5810ymb00l2qo49o764135q	cm5810ylu00kiqo49k40mv1mc	868654165465465
cm5810ymx00ltqo49epat4dkr	cm5810ymk00l8qo49k9jp9nkc	8683606399316
cm5810ymx00lrqo497nz2rz97	cm5810ymk00l8qo49k9jp9nkc	REMA/iP-12-12Pro/Mavi
cm5810ynq00mhqo49u0utn5kv	cm5810yn600lyqo496zjvq41g	REMA/iP-12-12Pro/Siyah
cm5810ynq00mjqo49zm6s6kj1	cm5810yn600lyqo496zjvq41g	8683606399323
cm5810yoa00n7qo49ihqv46ws	cm5810ynv00moqo4953xnkjjm	REMA/iP-12-12Pro/Yeşil
cm5810yoa00n9qo4958n8723i	cm5810ynv00moqo4953xnkjjm	8682315082173132
cm5810yp300nzqo49s8ptzkhg	cm5810yoh00neqo49yy7zofm5	8683606399354
cm5810ypw00ooqo49rum4u3f9	cm5810ypc00o5qo49ql1rf4ua	REMA/iP-12ProMax/Kırmızı
cm5810yqi00pgqo49x16nsfcl	cm5810yq300ovqo4992ox61mw	REMA/iP-12ProMax/KoyuMavi
cm5810yqi00pfqo49m524f8ny	cm5810yq300ovqo4992ox61mw	8683606399371
cm5810yr700q6qo492b2fs00j	cm5810yqs00plqo49zl6utuot	8683606399378
cm5810yr700q4qo49uuuwshu4	cm5810yqs00plqo49zl6utuot	REMA/iP-12ProMax/Siyah
cm5810yrw00qwqo491tphk8mw	cm5810yrf00qbqo49hinvhuyo	21983982173981
cm5810yrw00qvqo494efkrv6c	cm5810yrf00qbqo49hinvhuyo	REMA/iP-12ProMax/Yeşil
cm5810ysm00rmqo499kqx1nom	cm5810ys600r1qo491odxqsjz	REMA/iP-13-14/DerinMor
cm5810ysm00rnqo49xp3ygg1j	cm5810ys600r1qo491odxqsjz	8683606399385
cm5810yt400sbqo491uehtzl8	cm5810ysr00rsqo497k5s4ajz	REMA/iP-13-14/Kırmızı
cm5810yt400sdqo496kkl2qvu	cm5810ysr00rsqo497k5s4ajz	213219873982173
cm5810ytl00t1qo49my41rzzp	cm5810ytc00siqo49gaaiy482	REMA/iP-13-14/KoyuKırmızı
cm5810ytl00t3qo496psxyaqe	cm5810ytc00siqo49gaaiy482	213213219831
cm5810yu300ttqo49862me2x9	cm5810ytr00t8qo49pqe7l1jq	8683606399402
cm5810yuj00uhqo49cq7yougr	cm5810yua00tyqo49k4r6gcql	REMA/iP-13-14/Siyah
cm5810yuj00ujqo49gshewh3p	cm5810yua00tyqo49k4r6gcql	8683606399408
cm5810yv300v9qo49w1zh5845	cm5810yur00uoqo49o5hcns7f	8683606399415
cm5810yv300v8qo49omskmbjw	cm5810yur00uoqo49o5hcns7f	REMA/iP-13-14/Yeşil
cm5810yvj00vyqo491ua6n08h	cm5810yv900veqo49dgw78b0s	REMA/iP-13Pro/DerinMor
cm5810yvj00w0qo49n33g2pmg	cm5810yv900veqo49dgw78b0s	8683606399432
cm5810yvw00wqqo49gh3ckfw7	cm5810yvo00w5qo49foq2gu77	98721983721983
cm5810ywn00xeqo49fucdampe	cm5810yw500wvqo49qavnozo5	REMA/iP-13Pro/Mavi
cm5810yxi00y6qo49ymihtnng	cm5810yx000xlqo49572q7567	8683606399446
cm5810yxi00y5qo49vespjv2x	cm5810yx000xlqo49572q7567	REMA/iP-13Pro/Siyah
cm5810yy800ywqo49n9u2mfcg	cm5810yxq00ybqo493jjp1z4b	8683606399453
cm5810yyp00zlqo49yzap961k	cm5810yyc00z1qo49sflyb1q8	8683606399470
cm5810yyp00znqo4919qhcxpq	cm5810yyc00z1qo49sflyb1q8	REMA/iP-13ProMax/DerinMor
cm5810yz4010dqo494vn1i19b	cm5810yyu00zsqo49wutfl1ea	2
cm5810yz4010bqo49fvwmryov	cm5810yyu00zsqo49wutfl1ea	REMA/iP-13ProMax/Kırmızı
cm5810yzf0113qo49v94d82gf	cm5810yz8010iqo49322kfwlr	REMA/iP-13ProMax/KoyuMavi
cm5810yzu011sqo49tv7joov0	cm5810yzl0118qo49zpafwuyb	REMA/iP-13ProMax/Siyah
cm5810yzu011tqo49wjk6ug1w	cm5810yzl0118qo49zpafwuyb	8683606399484
cm5810z0a012jqo49ti4n4so3	cm5810yzy011yqo49hw6vun56	8683606399501
cm5810z0o0138qo49ns4e7z02	cm5810z0h012oqo49h0w3zpa7	REMA/iP-14Pro/DerinMor
cm5810z0p013aqo494p0a3di2	cm5810z0h012oqo49h0w3zpa7	8683606399545
cm5810z12013yqo49s0hagnsw	cm5810z0t013fqo49okbn556w	26873261873612873
cm5810z120140qo49oiyexbja	cm5810z0t013fqo49okbn556w	REMA/iP-14Pro/KoyuMavi
cm5810z1h014oqo49t31rgt0k	cm5810z170145qo4990ezdi0e	REMA/iP-14Pro/Siyah
cm5810z1h014qqo49o1c68ra7	cm5810z170145qo4990ezdi0e	8683606399562
cm5810z3e017mqo49wpk1tqgo	cm5810z360172qo499iquzrpl	219873982173981
cm5810z4i0191qo4956oev8kd	cm5810z45018iqo49o7khwtct	REMA/iP-14ProMax/Yeşil
cm5810z50019vqo49uo5sfgpz	cm5810z4n0198qo49mj7diyat	8683603022628
cm5810z5z01baqo492v8mh51a	cm5810z5i01aqqo49zyp50aix	8683603022611
cm5810z7401cpqo49qmz2nl8f	cm5810z6s01c6qo495ha6n0p7	REMA/iP-15/Yeşil
cm5810z9t01ewqo49eigt0675	cm5810z9501edqo495dnq830g	REMA/iP-15Plus/Pembe
cm5810zb901foqo49wdtk9sef	cm5810zaj01f3qo49bwhzd6me	8683603022635
cm5810zcy01huqo49n2sezety	cm5810zco01haqo49ejcpoi8l	REMA/iP-15Pro/Gri
cm5810zdk01ikqo49uo4kjx5y	cm5810zd501i1qo49youqq1py	REMA/iP-15Pro/KoyuMavi
cm5810zg101ljqo49a7myjpu7	cm5810zfq01kyqo49vx9k0byu	8683603022741
cm5810zgg01m9qo49wo2wps0a	cm5810zg801loqo49p3ldvva9	8683603022727
cm5810z20015fqo49v70sramd	cm5810z1l014vqo495uhksngx	REMA/iP-14Pro/Yeşil
cm5810z3t018dqo49cm61jhmh	cm5810z3i017sqo49095g2o6x	8683606399576
cm5810z6k01c1qo4986wuzf0z	cm5810z6501bgqo49cvp5l2l9	REMA/iP-15/Siyah
cm5810z7w01dgqo498db2dm0b	cm5810z7e01cwqo49543vrblm	REMA/iP-15Plus/Beyaz
cm5810z9t01eyqo490ckgnnew	cm5810z9501edqo495dnq830g	8683603022666
cm5810ze001jaqo4995tirpik	cm5810zdp01irqo494o0haro0	8683603022680
cm5810zfk01ktqo4932qssi3g	cm5810zet01k8qo49lolcl4b0	REMA/iP-15ProMax/Gri
cm5810z20015gqo49r8upmtr4	cm5810z1l014vqo495uhksngx	218638716387163
cm5810z2l0167qo49k7wuvcbc	cm5810z27015lqo494rs8lzi1	8683606399569
cm5810z30016vqo49cpvz6njl	cm5810z2q016cqo490h9vzsqj	REMA/iP-14ProMax/Kırmızı
cm5810z50019tqo49sbmzap1h	cm5810z4n0198qo49mj7diyat	REMA/iP-15/Beyaz
cm5810z7401crqo498983w8e3	cm5810z6s01c6qo495ha6n0p7	8683603022604
cm5810z7w01diqo49puu253fv	cm5810z7e01cwqo49543vrblm	8683603022673
cm5810zbw01geqo49fgicg763	cm5810zbi01ftqo49t4rxkt1r	8683603022659
cm5810zcg01h5qo49i5sibxxs	cm5810zc401gjqo49enoj2es0	8683603022710
cm5810zdk01imqo49kdsqa3qg	cm5810zd501i1qo49youqq1py	8683603022703
cm5810zek01k3qo49x64gqndy	cm5810ze501jhqo49yzo3clt5	8683603022758
cm5810zg101lhqo49nnrh3udu	cm5810zfq01kyqo49vx9k0byu	REMA/iP-15ProMax/KoyuMavi
cm5810z2l0165qo49cnp3uhvd	cm5810z27015lqo494rs8lzi1	REMA/iP-14ProMax/DerinMor
cm5810z3e017nqo49r80b5qre	cm5810z360172qo499iquzrpl	REMA/iP-14ProMax/KoyuMavi
cm5810z4i0193qo4957t55k21	cm5810z45018iqo49o7khwtct	63871263872163781
cm5810z5b01alqo49fagtchvl	cm5810z5401a0qo490i0mj0fy	8683603022598
cm5810z8t01e8qo49ns5fqsvx	cm5810z8901dnqo49qp0x9lvj	8683603022642
cm5810zbw01gdqo49mpo9tomd	cm5810zbi01ftqo49t4rxkt1r	REMA/iP-15Plus/Yeşil
cm5810ze001jcqo49tiu3d64n	cm5810zdp01irqo494o0haro0	REMA/iP-15Pro/Siyah
cm5810zek01k1qo49p99z8hgw	cm5810ze501jhqo49yzo3clt5	REMA/iP-15ProMax/Beyaz
cm5810zfk01ksqo49zu7cnmlq	cm5810zet01k8qo49lolcl4b0	8683603022734
cm5810zgg01m8qo49y70fxf6m	cm5810zg801loqo49p3ldvva9	REMA/iP-15ProMax/Siyah
cm5ch1rky0063qp475wv4ktjj	cm5810y46005pqo49ynbtedva	8683606399265
cm5ch1rky0064qp47e5h44z5a	cm5810y46005pqo49ynbtedva	REMA/iP-11/AçıkMavi
\.


--
-- Data for Name: StockCardCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardCategory" (id, "categoryName", "categoryCode", "parentCategoryId") FROM stdin;
cm580zgmw005mqo495uviyrt3	Telefon Kılıfları	TLF	\N
cm580zpso005oqo49jxh6mtsc	Rema Kılıf	REM	cm580zgmw005mqo495uviyrt3
cm5did52o006mqp47auxze4dg	Ambalaj / Kutu / Poşet	AMBLJ	\N
\.


--
-- Data for Name: StockCardCategoryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardCategoryItem" (id, "stockCardId", "categoryId") FROM stdin;
cm5810y6p006kqo49mgx0qavc	cm5810y6f006hqo494yk8ct6a	cm580zpso005oqo49jxh6mtsc
cm5810y7s007bqo494e7xghd8	cm5810y7i0078qo499o503inm	cm580zpso005oqo49jxh6mtsc
cm5810y8r0082qo49rrwixw6t	cm5810y8g007zqo49ols1soqm	cm580zpso005oqo49jxh6mtsc
cm5810y9m008tqo49u3l4wde4	cm5810y9e008qqo49xtdla4v6	cm580zpso005oqo49jxh6mtsc
cm5810yai009kqo49b8k075dt	cm5810yab009hqo49c6c20v8u	cm580zpso005oqo49jxh6mtsc
cm5810ybj00abqo499dc410ub	cm5810yb500a8qo49adwabm54	cm580zpso005oqo49jxh6mtsc
cm5810yc900b2qo49haiqy7cl	cm5810yc200azqo495vlug6em	cm580zpso005oqo49jxh6mtsc
cm5810ycy00btqo494ujg6sjj	cm5810ycr00bqqo493so45oku	cm580zpso005oqo49jxh6mtsc
cm5810ydr00ckqo492p9cz9rx	cm5810ydl00chqo49zebe93hc	cm580zpso005oqo49jxh6mtsc
cm5810yei00daqo49en2vk8vw	cm5810yea00d7qo4930j2ndaa	cm580zpso005oqo49jxh6mtsc
cm5810yfa00e1qo49ncttnr7h	cm5810yf200dyqo4927lfojk1	cm580zpso005oqo49jxh6mtsc
cm5810yg200erqo491xhjt96h	cm5810yfy00eoqo494kvxn0ds	cm580zpso005oqo49jxh6mtsc
cm5810ygk00fiqo49mo1ln6i7	cm5810ygf00ffqo4962b8w9do	cm580zpso005oqo49jxh6mtsc
cm5810yh900g8qo49jjfmk6sq	cm5810yh200g5qo49koq2jf25	cm580zpso005oqo49jxh6mtsc
cm5810yhz00gyqo49i759vd4n	cm5810yhs00gvqo49tnxikehp	cm580zpso005oqo49jxh6mtsc
cm5810yiz00hoqo49bjcplytu	cm5810yir00hlqo49x4sgzc5o	cm580zpso005oqo49jxh6mtsc
cm5810yjk00ieqo495gshcx06	cm5810yjf00ibqo491rjrde6k	cm580zpso005oqo49jxh6mtsc
cm5810yk800j4qo4969moypt6	cm5810yk200j1qo497tyy0f1d	cm580zpso005oqo49jxh6mtsc
cm5810yl300jvqo49ljx0b5gg	cm5810ykw00jsqo492ek4wg2l	cm580zpso005oqo49jxh6mtsc
cm5810ym000klqo49t2o8ancf	cm5810ylu00kiqo49k40mv1mc	cm580zpso005oqo49jxh6mtsc
cm5810ymq00lbqo49zf6bsw07	cm5810ymk00l8qo49k9jp9nkc	cm580zpso005oqo49jxh6mtsc
cm5810ynf00m1qo49hxnnx81j	cm5810yn600lyqo496zjvq41g	cm580zpso005oqo49jxh6mtsc
cm5810yo200mrqo499nv61iq3	cm5810ynv00moqo4953xnkjjm	cm580zpso005oqo49jxh6mtsc
cm5810yon00nhqo493lnmt57u	cm5810yoh00neqo49yy7zofm5	cm580zpso005oqo49jxh6mtsc
cm5810ypk00o8qo49uw945fuc	cm5810ypc00o5qo49ql1rf4ua	cm580zpso005oqo49jxh6mtsc
cm5810yqb00oyqo49gbhpo118	cm5810yq300ovqo4992ox61mw	cm580zpso005oqo49jxh6mtsc
cm5810yqz00poqo49p988pkwk	cm5810yqs00plqo49zl6utuot	cm580zpso005oqo49jxh6mtsc
cm5810yro00qeqo4948gmosot	cm5810yrf00qbqo49hinvhuyo	cm580zpso005oqo49jxh6mtsc
cm5810ysf00r4qo49ersnlsi9	cm5810ys600r1qo491odxqsjz	cm580zpso005oqo49jxh6mtsc
cm5810ysz00rvqo49afnebaqo	cm5810ysr00rsqo497k5s4ajz	cm580zpso005oqo49jxh6mtsc
cm5810ytg00slqo49qnyve9s5	cm5810ytc00siqo49gaaiy482	cm580zpso005oqo49jxh6mtsc
cm5810ytv00tbqo490xpv4fyq	cm5810ytr00t8qo49pqe7l1jq	cm580zpso005oqo49jxh6mtsc
cm5810yue00u1qo49a3pj77to	cm5810yua00tyqo49k4r6gcql	cm580zpso005oqo49jxh6mtsc
cm5810yuv00urqo49m6c9rp7l	cm5810yur00uoqo49o5hcns7f	cm580zpso005oqo49jxh6mtsc
cm5810yvc00vhqo49czpmcet6	cm5810yv900veqo49dgw78b0s	cm580zpso005oqo49jxh6mtsc
cm5810yvr00w8qo49pn7wl022	cm5810yvo00w5qo49foq2gu77	cm580zpso005oqo49jxh6mtsc
cm5810ywa00wyqo49elsfztvk	cm5810yw500wvqo49qavnozo5	cm580zpso005oqo49jxh6mtsc
cm5810yx700xoqo49lz499rvo	cm5810yx000xlqo49572q7567	cm580zpso005oqo49jxh6mtsc
cm5810yxz00yeqo49yqkb2jzm	cm5810yxq00ybqo493jjp1z4b	cm580zpso005oqo49jxh6mtsc
cm5810yyg00z4qo49075ncbkz	cm5810yyc00z1qo49sflyb1q8	cm580zpso005oqo49jxh6mtsc
cm5810yyx00zvqo4930x9wacj	cm5810yyu00zsqo49wutfl1ea	cm580zpso005oqo49jxh6mtsc
cm5810yzb010lqo49t4wnpwfp	cm5810yz8010iqo49322kfwlr	cm580zpso005oqo49jxh6mtsc
cm5810yzo011bqo49m45zlsc7	cm5810yzl0118qo49zpafwuyb	cm580zpso005oqo49jxh6mtsc
cm5810z020121qo49duat6a74	cm5810yzy011yqo49hw6vun56	cm580zpso005oqo49jxh6mtsc
cm5810z0k012rqo49eek9ogo3	cm5810z0h012oqo49h0w3zpa7	cm580zpso005oqo49jxh6mtsc
cm5810z0x013iqo49xqyc444g	cm5810z0t013fqo49okbn556w	cm580zpso005oqo49jxh6mtsc
cm5810z1b0148qo49vrjy3za9	cm5810z170145qo4990ezdi0e	cm580zpso005oqo49jxh6mtsc
cm5810z1q014yqo49kvt63x5t	cm5810z1l014vqo495uhksngx	cm580zpso005oqo49jxh6mtsc
cm5810z2g015oqo49gpj2yyg9	cm5810z27015lqo494rs8lzi1	cm580zpso005oqo49jxh6mtsc
cm5810z2u016fqo497yxeq21w	cm5810z2q016cqo490h9vzsqj	cm580zpso005oqo49jxh6mtsc
cm5810z3a0175qo49l3i6micl	cm5810z360172qo499iquzrpl	cm580zpso005oqo49jxh6mtsc
cm5810z3m017vqo497cjlcj7q	cm5810z3i017sqo49095g2o6x	cm580zpso005oqo49jxh6mtsc
cm5810z4c018lqo49vj11e8tn	cm5810z45018iqo49o7khwtct	cm580zpso005oqo49jxh6mtsc
cm5810z4s019bqo49r5qrzv0l	cm5810z4n0198qo49mj7diyat	cm580zpso005oqo49jxh6mtsc
cm5810z5701a3qo49xyr70i5p	cm5810z5401a0qo490i0mj0fy	cm580zpso005oqo49jxh6mtsc
cm5810z5q01atqo49wks5gvby	cm5810z5i01aqqo49zyp50aix	cm580zpso005oqo49jxh6mtsc
cm5810z6b01bjqo49nc28g1xr	cm5810z6501bgqo49cvp5l2l9	cm580zpso005oqo49jxh6mtsc
cm5810z6x01c9qo496mln94h9	cm5810z6s01c6qo495ha6n0p7	cm580zpso005oqo49jxh6mtsc
cm5810z7n01czqo49hn9arz71	cm5810z7e01cwqo49543vrblm	cm580zpso005oqo49jxh6mtsc
cm5810z8g01dqqo49c86yn310	cm5810z8901dnqo49qp0x9lvj	cm580zpso005oqo49jxh6mtsc
cm5810z9c01egqo49d49yxtec	cm5810z9501edqo495dnq830g	cm580zpso005oqo49jxh6mtsc
cm5810zax01f6qo49qh8x28e4	cm5810zaj01f3qo49bwhzd6me	cm580zpso005oqo49jxh6mtsc
cm5810zbp01fwqo494ljtdgn4	cm5810zbi01ftqo49t4rxkt1r	cm580zpso005oqo49jxh6mtsc
cm5810zc901gmqo490wht2291	cm5810zc401gjqo49enoj2es0	cm580zpso005oqo49jxh6mtsc
cm5810zcs01hdqo4977jmwizi	cm5810zco01haqo49ejcpoi8l	cm580zpso005oqo49jxh6mtsc
cm5810zdb01i4qo4902isjf18	cm5810zd501i1qo49youqq1py	cm580zpso005oqo49jxh6mtsc
cm5810zdt01iuqo49x6l2hvs9	cm5810zdp01irqo494o0haro0	cm580zpso005oqo49jxh6mtsc
cm5810ze801jkqo49zr6s235w	cm5810ze501jhqo49yzo3clt5	cm580zpso005oqo49jxh6mtsc
cm5810zf701kbqo49w98wzajt	cm5810zet01k8qo49lolcl4b0	cm580zpso005oqo49jxh6mtsc
cm5810zfu01l1qo49i57i7v2t	cm5810zfq01kyqo49vx9k0byu	cm580zpso005oqo49jxh6mtsc
cm5810zgb01lrqo49xk7mwoj9	cm5810zg801loqo49p3ldvva9	cm580zpso005oqo49jxh6mtsc
cm5ch1rl00065qp47689r3khe	cm5810y46005pqo49ynbtedva	cm580zpso005oqo49jxh6mtsc
cm5dqod1v005soa40z6px1qts	cm5dqod1r005roa40kxyhr1b6	cm5did52o006mqp47auxze4dg
\.


--
-- Data for Name: StockCardEFatura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardEFatura" (id, "productCode", "productName", "stockCardId", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: StockCardManufacturer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardManufacturer" (id, "productCode", "productName", barcode, "brandId", "stockCardId", "currentId", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: StockCardMarketNames; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardMarketNames" (id, "stockCardId", "marketName") FROM stdin;
cm5810y7c0077qo49t8hu9081	cm5810y6f006hqo494yk8ct6a	EGE
cm5810y8a007yqo499cdxjd9b	cm5810y7i0078qo499o503inm	EGE
cm5810y9a008pqo49ge9va1ms	cm5810y8g007zqo49ols1soqm	EGE
cm5810ya8009gqo49xqyybx7k	cm5810y9e008qqo49xtdla4v6	EGE
cm5810yaz00a7qo49p622fw1a	cm5810yab009hqo49c6c20v8u	EGE
cm5810yby00ayqo49om8cd1pn	cm5810yb500a8qo49adwabm54	EGE
cm5810ycm00bpqo49xgrtgg0s	cm5810yc200azqo495vlug6em	EGE
cm5810ydg00cgqo49uoeiwgg7	cm5810ycr00bqqo493so45oku	EGE
cm5810ye600d6qo49eybcbe0a	cm5810ydl00chqo49zebe93hc	EGE
cm5810yez00dxqo49pfy426gp	cm5810yea00d7qo4930j2ndaa	EGE
cm5810yfu00enqo49kiuhx0fw	cm5810yf200dyqo4927lfojk1	EGE
cm5810ygd00feqo493nzr70n9	cm5810yfy00eoqo494kvxn0ds	EGE
cm5810ygy00g4qo496bc1c43m	cm5810ygf00ffqo4962b8w9do	EGE
cm5810yho00guqo49bp49gvs2	cm5810yh200g5qo49koq2jf25	EGE
cm5810yil00hkqo49n5260id5	cm5810yhs00gvqo49tnxikehp	EGE
cm5810yjb00iaqo496tsy4rdd	cm5810yir00hlqo49x4sgzc5o	EGE
cm5810yjy00j0qo49fwfcqsmc	cm5810yjf00ibqo491rjrde6k	EGE
cm5810ykt00jrqo497005qbw6	cm5810yk200j1qo497tyy0f1d	EGE
cm5810yln00khqo49l17vmduy	cm5810ykw00jsqo492ek4wg2l	EGE
cm5810ymg00l7qo492rj7p0yy	cm5810ylu00kiqo49k40mv1mc	EGE
cm5810yn300lxqo49kg9xdik2	cm5810ymk00l8qo49k9jp9nkc	EGE
cm5810ynt00mnqo49gp8xo4rd	cm5810yn600lyqo496zjvq41g	EGE
cm5810yoe00ndqo49szm8niqk	cm5810ynv00moqo4953xnkjjm	EGE
cm5810yp700o4qo49f770eusv	cm5810yoh00neqo49yy7zofm5	EGE
cm5810yq000ouqo49ydoxgngf	cm5810ypc00o5qo49ql1rf4ua	EGE
cm5810yqo00pkqo49efug1ce5	cm5810yq300ovqo4992ox61mw	EGE
cm5810yrc00qaqo49ff3vttzu	cm5810yqs00plqo49zl6utuot	EGE
cm5810ys200r0qo49wez0gxsr	cm5810yrf00qbqo49hinvhuyo	EGE
cm5810ysp00rrqo493dcg5v1g	cm5810ys600r1qo491odxqsjz	EGE
cm5810yt700shqo49a1m1csoi	cm5810ysr00rsqo497k5s4ajz	EGE
cm5810yto00t7qo491a4djgrl	cm5810ytc00siqo49gaaiy482	EGE
cm5810yu800txqo49ll6oefiz	cm5810ytr00t8qo49pqe7l1jq	EGE
cm5810yuo00unqo49jm59by8a	cm5810yua00tyqo49k4r6gcql	EGE
cm5810yv700vdqo49qix34ldz	cm5810yur00uoqo49o5hcns7f	EGE
cm5810yvm00w4qo49tpqe3t4j	cm5810yv900veqo49dgw78b0s	EGE
cm5810yw100wuqo498s9th156	cm5810yvo00w5qo49foq2gu77	EGE
cm5810yws00xkqo49kltlrf8w	cm5810yw500wvqo49qavnozo5	EGE
cm5810yxm00yaqo49rl0vcx1n	cm5810yx000xlqo49572q7567	EGE
cm5810yya00z0qo49w7asbejx	cm5810yxq00ybqo493jjp1z4b	EGE
cm5810yys00zrqo499d9mqjfc	cm5810yyc00z1qo49sflyb1q8	EGE
cm5810yz6010hqo49riyl6r9o	cm5810yyu00zsqo49wutfl1ea	EGE
cm5810yzi0117qo49u9yg79cc	cm5810yz8010iqo49322kfwlr	EGE
cm5810yzw011xqo49p0v38kc3	cm5810yzl0118qo49zpafwuyb	EGE
cm5810z0e012nqo49yobdlkg9	cm5810yzy011yqo49hw6vun56	EGE
cm5810z0r013eqo496izu6qke	cm5810z0h012oqo49h0w3zpa7	EGE
cm5810z150144qo492e9t00lh	cm5810z0t013fqo49okbn556w	EGE
cm5810z1k014uqo490pql09u0	cm5810z170145qo4990ezdi0e	EGE
cm5810z24015kqo495eojfamv	cm5810z1l014vqo495uhksngx	EGE
cm5810z2n016bqo49nl1p1yeu	cm5810z27015lqo494rs8lzi1	EGE
cm5810z320171qo49hvyvnjk8	cm5810z2q016cqo490h9vzsqj	EGE
cm5810z3g017rqo49q3166dwe	cm5810z360172qo499iquzrpl	EGE
cm5810z3y018hqo49mp9ufouh	cm5810z3i017sqo49095g2o6x	EGE
cm5810z4l0197qo49indrrute	cm5810z45018iqo49o7khwtct	EGE
cm5810z52019zqo49sbgwmo8x	cm5810z4n0198qo49mj7diyat	EGE
cm5810z5f01apqo49vc2pkfwu	cm5810z5401a0qo490i0mj0fy	EGE
cm5810z6201bfqo49qx6uyq6t	cm5810z5i01aqqo49zyp50aix	EGE
cm5810z6n01c5qo49ajoxdw4u	cm5810z6501bgqo49cvp5l2l9	EGE
cm5810z7901cvqo49aiahu9sn	cm5810z6s01c6qo495ha6n0p7	EGE
cm5810z8401dmqo490rauki42	cm5810z7e01cwqo49543vrblm	EGE
cm5810z8z01ecqo49ak6s5jmv	cm5810z8901dnqo49qp0x9lvj	EGE
cm5810za501f2qo49yc4uw6wb	cm5810z9501edqo495dnq830g	EGE
cm5810zbf01fsqo491tg9o9js	cm5810zaj01f3qo49bwhzd6me	EGE
cm5810zbz01giqo49zpgzhio5	cm5810zbi01ftqo49t4rxkt1r	EGE
cm5810zcl01h9qo49f7jzuwnf	cm5810zc401gjqo49enoj2es0	EGE
cm5810zd301i0qo49zezcslag	cm5810zco01haqo49ejcpoi8l	EGE
cm5810zdm01iqqo49gnymmrvo	cm5810zd501i1qo49youqq1py	EGE
cm5810ze301jgqo4958i1g9y6	cm5810zdp01irqo494o0haro0	EGE
cm5810zeo01k7qo49g88c1fpy	cm5810ze501jhqo49yzo3clt5	EGE
cm5810zfn01kxqo495hvh0vzv	cm5810zet01k8qo49lolcl4b0	EGE
cm5810zg501lnqo49bv0tlrin	cm5810zfq01kyqo49vx9k0byu	EGE
cm5810zgi01mdqo49ijgi0pvh	cm5810zg801loqo49p3ldvva9	EGE
cm5ch1rl20066qp47uinhz9jb	cm5810y46005pqo49ynbtedva	EGE
\.


--
-- Data for Name: StockCardPriceList; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardPriceList" (id, "priceListName", currency, "isVatIncluded", "isActive") FROM stdin;
cm580tr1n005cqo497o75j33g	Tip 1 Bayiler	USD	f	t
cm580tx6t005dqo49iao7zwwu	Tip 2 Bayiler	USD	f	t
cm580u2e0005eqo49950rh66x	Tip 3 Bayiler	USD	f	t
cm580u7tw005fqo493osdadwm	Maliyet	USD	f	t
cm580ucjs005gqo49kt2dd9xy	Perakende	TRY	f	t
\.


--
-- Data for Name: StockCardPriceListItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardPriceListItems" (id, "priceListId", "stockCardId", price, "vatRate", barcode) FROM stdin;
cm5810y70006rqo49q8rwct16	cm580tr1n005cqo497o75j33g	cm5810y6f006hqo494yk8ct6a	1.0000	0.0000	\N
cm5810y70006vqo49iw55ir5y	cm580u7tw005fqo493osdadwm	cm5810y6f006hqo494yk8ct6a	0.8000	0.0000	\N
cm5810y70006uqo49p82pdw56	cm580u2e0005eqo49950rh66x	cm5810y6f006hqo494yk8ct6a	1.8000	0.0000	\N
cm5810y70006yqo493yv69rdk	cm580tx6t005dqo49iao7zwwu	cm5810y6f006hqo494yk8ct6a	1.4000	0.0000	\N
cm5810y70006zqo4986ucjpyx	cm580ucjs005gqo49kt2dd9xy	cm5810y6f006hqo494yk8ct6a	150.0000	0.0000	\N
cm5810y81007kqo49hta13ilr	cm580tr1n005cqo497o75j33g	cm5810y7i0078qo499o503inm	1.0000	0.0000	\N
cm5810y81007lqo49exho1d4t	cm580tx6t005dqo49iao7zwwu	cm5810y7i0078qo499o503inm	1.4000	0.0000	\N
cm5810y82007pqo494017vm6b	cm580u7tw005fqo493osdadwm	cm5810y7i0078qo499o503inm	0.8000	0.0000	\N
cm5810y81007mqo497vufqjhx	cm580u2e0005eqo49950rh66x	cm5810y7i0078qo499o503inm	1.8000	0.0000	\N
cm5810y82007qqo49n1ya97yo	cm580ucjs005gqo49kt2dd9xy	cm5810y7i0078qo499o503inm	150.0000	0.0000	\N
cm5810y90008dqo499vhvl8xe	cm580u2e0005eqo49950rh66x	cm5810y8g007zqo49ols1soqm	1.8000	0.0000	\N
cm5810y90008cqo49kjkqqoi5	cm580tr1n005cqo497o75j33g	cm5810y8g007zqo49ols1soqm	1.0000	0.0000	\N
cm5810y91008fqo49nc5bo76k	cm580ucjs005gqo49kt2dd9xy	cm5810y8g007zqo49ols1soqm	150.0000	0.0000	\N
cm5810y91008hqo498xum2yqr	cm580tx6t005dqo49iao7zwwu	cm5810y8g007zqo49ols1soqm	1.4000	0.0000	\N
cm5810y90008bqo49b1lxuu35	cm580u7tw005fqo493osdadwm	cm5810y8g007zqo49ols1soqm	0.8000	0.0000	\N
cm5810ya00090qo49vabrinze	cm580tr1n005cqo497o75j33g	cm5810y9e008qqo49xtdla4v6	1.0000	0.0000	\N
cm5810ya00094qo49vc4xxmao	cm580tx6t005dqo49iao7zwwu	cm5810y9e008qqo49xtdla4v6	1.4000	0.0000	\N
cm5810ya00093qo49yswqyrrl	cm580u2e0005eqo49950rh66x	cm5810y9e008qqo49xtdla4v6	1.8000	0.0000	\N
cm5810ya00096qo49ha8rl9cy	cm580u7tw005fqo493osdadwm	cm5810y9e008qqo49xtdla4v6	0.8000	0.0000	\N
cm5810ya10098qo49re8s6ecv	cm580ucjs005gqo49kt2dd9xy	cm5810y9e008qqo49xtdla4v6	150.0000	0.0000	\N
cm5810yao009rqo49vgeadouz	cm580tx6t005dqo49iao7zwwu	cm5810yab009hqo49c6c20v8u	1.4000	0.0000	\N
cm5810yap009uqo4945oplpng	cm580u7tw005fqo493osdadwm	cm5810yab009hqo49c6c20v8u	0.8000	0.0000	\N
cm5810yap009vqo4948x6r2rz	cm580u2e0005eqo49950rh66x	cm5810yab009hqo49c6c20v8u	1.8000	0.0000	\N
cm5810yap009yqo49jrpy29rw	cm580tr1n005cqo497o75j33g	cm5810yab009hqo49c6c20v8u	1.0000	0.0000	\N
cm5810yap009zqo49e686il2u	cm580ucjs005gqo49kt2dd9xy	cm5810yab009hqo49c6c20v8u	150.0000	0.0000	\N
cm5810ybq00aiqo492s1tyfl7	cm580tr1n005cqo497o75j33g	cm5810yb500a8qo49adwabm54	1.0000	0.0000	\N
cm5810ybq00amqo49gfjng18o	cm580u7tw005fqo493osdadwm	cm5810yb500a8qo49adwabm54	0.8000	0.0000	\N
cm5810ybq00aoqo49zicqpzdw	cm580ucjs005gqo49kt2dd9xy	cm5810yb500a8qo49adwabm54	150.0000	0.0000	\N
cm5810ybq00aqqo49pgbkoxf7	cm580u2e0005eqo49950rh66x	cm5810yb500a8qo49adwabm54	1.8000	0.0000	\N
cm5810ybq00alqo49z3ch61l2	cm580tx6t005dqo49iao7zwwu	cm5810yb500a8qo49adwabm54	1.4000	0.0000	\N
cm5810ycg00b9qo49cv0e69nw	cm580tr1n005cqo497o75j33g	cm5810yc200azqo495vlug6em	1.0000	0.0000	\N
cm5810ycg00bcqo49lex31fpb	cm580u2e0005eqo49950rh66x	cm5810yc200azqo495vlug6em	1.8000	0.0000	\N
cm5810ycg00bdqo49beqmd7fu	cm580u7tw005fqo493osdadwm	cm5810yc200azqo495vlug6em	0.8000	0.0000	\N
cm5810ycg00bfqo49fiqdb6je	cm580tx6t005dqo49iao7zwwu	cm5810yc200azqo495vlug6em	1.4000	0.0000	\N
cm5810ycg00bhqo49p5k82k0o	cm580ucjs005gqo49kt2dd9xy	cm5810yc200azqo495vlug6em	150.0000	0.0000	\N
cm5810yd800c0qo49porye3cf	cm580tr1n005cqo497o75j33g	cm5810ycr00bqqo493so45oku	1.0000	0.0000	\N
cm5810yd900c2qo49z98f48ma	cm580tx6t005dqo49iao7zwwu	cm5810ycr00bqqo493so45oku	1.4000	0.0000	\N
cm5810yd900c4qo49v6qutboq	cm580u2e0005eqo49950rh66x	cm5810ycr00bqqo493so45oku	1.8000	0.0000	\N
cm5810yd900c6qo49r0edxvfo	cm580u7tw005fqo493osdadwm	cm5810ycr00bqqo493so45oku	0.8000	0.0000	\N
cm5810yd900c8qo496v9we4qq	cm580ucjs005gqo49kt2dd9xy	cm5810ycr00bqqo493so45oku	150.0000	0.0000	\N
cm5810ydy00cqqo493c8243pt	cm580tr1n005cqo497o75j33g	cm5810ydl00chqo49zebe93hc	1.0000	0.0000	\N
cm5810ydy00csqo49ql03776q	cm580u2e0005eqo49950rh66x	cm5810ydl00chqo49zebe93hc	1.8000	0.0000	\N
cm5810ydy00cuqo49h72qkvmn	cm580u7tw005fqo493osdadwm	cm5810ydl00chqo49zebe93hc	0.8000	0.0000	\N
cm5810ydy00cwqo49h2junk5x	cm580tx6t005dqo49iao7zwwu	cm5810ydl00chqo49zebe93hc	1.4000	0.0000	\N
cm5810ydy00cyqo49949c2h23	cm580ucjs005gqo49kt2dd9xy	cm5810ydl00chqo49zebe93hc	150.0000	0.0000	\N
cm5810yeq00dhqo49ihrcttt7	cm580tr1n005cqo497o75j33g	cm5810yea00d7qo4930j2ndaa	1.0000	0.0000	\N
cm5810yeq00dlqo49goit5ifx	cm580u7tw005fqo493osdadwm	cm5810yea00d7qo4930j2ndaa	0.8000	0.0000	\N
cm5810yeq00dkqo497qr6ufnt	cm580u2e0005eqo49950rh66x	cm5810yea00d7qo4930j2ndaa	1.8000	0.0000	\N
cm5810yeq00dpqo49x9zxcpvv	cm580tx6t005dqo49iao7zwwu	cm5810yea00d7qo4930j2ndaa	1.4000	0.0000	\N
cm5810yeq00dnqo49dq79mqoh	cm580ucjs005gqo49kt2dd9xy	cm5810yea00d7qo4930j2ndaa	150.0000	0.0000	\N
cm5810yfl00e7qo497udhmy9m	cm580tr1n005cqo497o75j33g	cm5810yf200dyqo4927lfojk1	1.0000	0.0000	\N
cm5810yfl00e9qo49gzju6k1k	cm580u2e0005eqo49950rh66x	cm5810yf200dyqo4927lfojk1	1.8000	0.0000	\N
cm5810yfl00ecqo49causdaoc	cm580tx6t005dqo49iao7zwwu	cm5810yf200dyqo4927lfojk1	1.4000	0.0000	\N
cm5810yfl00efqo49obhbw0yy	cm580ucjs005gqo49kt2dd9xy	cm5810yf200dyqo4927lfojk1	150.0000	0.0000	\N
cm5810yfl00edqo49zyq6o5h5	cm580u7tw005fqo493osdadwm	cm5810yf200dyqo4927lfojk1	0.8000	0.0000	\N
cm5810yg700eyqo496s52y4dm	cm580tr1n005cqo497o75j33g	cm5810yfy00eoqo494kvxn0ds	1.0000	0.0000	\N
cm5810yg700f0qo490e7t62yc	cm580u2e0005eqo49950rh66x	cm5810yfy00eoqo494kvxn0ds	1.8000	0.0000	\N
cm5810yg700f4qo49qz7n49kz	cm580u7tw005fqo493osdadwm	cm5810yfy00eoqo494kvxn0ds	0.8000	0.0000	\N
cm5810yg700f2qo49jckqu5e9	cm580tx6t005dqo49iao7zwwu	cm5810yfy00eoqo494kvxn0ds	1.4000	0.0000	\N
cm5810yg700f6qo495ltzkeai	cm580ucjs005gqo49kt2dd9xy	cm5810yfy00eoqo494kvxn0ds	150.0000	0.0000	\N
cm5810ygt00foqo49judump9w	cm580tr1n005cqo497o75j33g	cm5810ygf00ffqo4962b8w9do	1.0000	0.0000	\N
cm5810ygt00fqqo49suumw20g	cm580tx6t005dqo49iao7zwwu	cm5810ygf00ffqo4962b8w9do	1.4000	0.0000	\N
cm5810ygt00fuqo4905leg00u	cm580ucjs005gqo49kt2dd9xy	cm5810ygf00ffqo4962b8w9do	150.0000	0.0000	\N
cm5810ygt00fsqo49b0pn7e0e	cm580u7tw005fqo493osdadwm	cm5810ygf00ffqo4962b8w9do	0.8000	0.0000	\N
cm5810ygt00fwqo49fzt85pzr	cm580u2e0005eqo49950rh66x	cm5810ygf00ffqo4962b8w9do	1.8000	0.0000	\N
cm5810yhf00glqo492u07cwrn	cm580u7tw005fqo493osdadwm	cm5810yh200g5qo49koq2jf25	0.8000	0.0000	\N
cm5810yic00hcqo49uni0biw9	cm580u2e0005eqo49950rh66x	cm5810yhs00gvqo49tnxikehp	1.8000	0.0000	\N
cm5810yj600i0qo496a5plhbj	cm580u7tw005fqo493osdadwm	cm5810yir00hlqo49x4sgzc5o	0.8000	0.0000	\N
cm5810yjq00iqqo49kex74yjg	cm580ucjs005gqo49kt2dd9xy	cm5810yjf00ibqo491rjrde6k	150.0000	0.0000	\N
cm5810ykj00jdqo494ea02lhx	cm580u7tw005fqo493osdadwm	cm5810yk200j1qo497tyy0f1d	0.8000	0.0000	\N
cm5810yld00k9qo497kztdwyv	cm580u7tw005fqo493osdadwm	cm5810ykw00jsqo492ek4wg2l	0.8000	0.0000	\N
cm5810ym900kzqo49c6r9u1cb	cm580ucjs005gqo49kt2dd9xy	cm5810ylu00kiqo49k40mv1mc	150.0000	0.0000	\N
cm5810ymv00llqo49kcie7dsz	cm580u2e0005eqo49950rh66x	cm5810ymk00l8qo49k9jp9nkc	1.8000	0.0000	\N
cm5810yno00mcqo49w9dl035h	cm580u7tw005fqo493osdadwm	cm5810yn600lyqo496zjvq41g	0.8000	0.0000	\N
cm5810yo800n5qo49lb71qph2	cm580tr1n005cqo497o75j33g	cm5810ynv00moqo4953xnkjjm	1.0000	0.0000	\N
cm5810yp000nwqo498zyd333f	cm580u7tw005fqo493osdadwm	cm5810yoh00neqo49yy7zofm5	0.8000	0.0000	\N
cm5810ypt00ogqo49hxf5pp9x	cm580u2e0005eqo49950rh66x	cm5810ypc00o5qo49ql1rf4ua	1.8000	0.0000	\N
cm5810yqh00p8qo49pfsn6jog	cm580u2e0005eqo49950rh66x	cm5810yq300ovqo4992ox61mw	1.8000	0.0000	\N
cm5810yr500q0qo49trgqn72p	cm580ucjs005gqo49kt2dd9xy	cm5810yqs00plqo49zl6utuot	150.0000	0.0000	\N
cm5810yru00qoqo49cha1xuej	cm580u7tw005fqo493osdadwm	cm5810yrf00qbqo49hinvhuyo	0.8000	0.0000	\N
cm5810ysl00rjqo49d16ycxb6	cm580u2e0005eqo49950rh66x	cm5810ys600r1qo491odxqsjz	1.8000	0.0000	\N
cm5810yt300s7qo4969skyb0z	cm580ucjs005gqo49kt2dd9xy	cm5810ysr00rsqo497k5s4ajz	150.0000	0.0000	\N
cm5810ytk00svqo49kivnhewx	cm580tx6t005dqo49iao7zwwu	cm5810ytc00siqo49gaaiy482	1.4000	0.0000	\N
cm5810yu200tnqo49p8y7q9um	cm580ucjs005gqo49kt2dd9xy	cm5810ytr00t8qo49pqe7l1jq	150.0000	0.0000	\N
cm5810yui00u7qo49uoi4dcjy	cm580tr1n005cqo497o75j33g	cm5810yua00tyqo49k4r6gcql	1.0000	0.0000	\N
cm5810yuz00v5qo49cy54keez	cm580tx6t005dqo49iao7zwwu	cm5810yur00uoqo49o5hcns7f	1.4000	0.0000	\N
cm5810yvh00vtqo49ejj33mql	cm580tx6t005dqo49iao7zwwu	cm5810yv900veqo49dgw78b0s	1.4000	0.0000	\N
cm5810yvv00wiqo49twc11dma	cm580u2e0005eqo49950rh66x	cm5810yvo00w5qo49foq2gu77	1.8000	0.0000	\N
cm5810ywk00x6qo49q0u0e6l8	cm580u2e0005eqo49950rh66x	cm5810yw500wvqo49qavnozo5	1.8000	0.0000	\N
cm5810yxg00xwqo4934xj1zq0	cm580tx6t005dqo49iao7zwwu	cm5810yx000xlqo49572q7567	1.4000	0.0000	\N
cm5810yy600ysqo496cn7vnps	cm580tr1n005cqo497o75j33g	cm5810yxq00ybqo493jjp1z4b	1.0000	0.0000	\N
cm5810yyl00zbqo49fsqq6sd0	cm580tr1n005cqo497o75j33g	cm5810yyc00z1qo49sflyb1q8	1.0000	0.0000	\N
cm5810yz10109qo49lhnpyqb5	cm580u2e0005eqo49950rh66x	cm5810yyu00zsqo49wutfl1ea	1.8000	0.0000	\N
cm5810yze010xqo49uiqgx3jh	cm580u7tw005fqo493osdadwm	cm5810yz8010iqo49322kfwlr	0.8000	0.0000	\N
cm5810yzs011hqo49q30nbin3	cm580tr1n005cqo497o75j33g	cm5810yzl0118qo49zpafwuyb	1.0000	0.0000	\N
cm5810z07012fqo49ig0j42y2	cm580tx6t005dqo49iao7zwwu	cm5810yzy011yqo49hw6vun56	1.4000	0.0000	\N
cm5810z0n0131qo495mhd1bqr	cm580u7tw005fqo493osdadwm	cm5810z0h012oqo49h0w3zpa7	0.8000	0.0000	\N
cm5810z11013uqo49746to1n4	cm580tx6t005dqo49iao7zwwu	cm5810z0t013fqo49okbn556w	1.4000	0.0000	\N
cm5810z1f014iqo49awuiajs7	cm580u2e0005eqo49950rh66x	cm5810z170145qo4990ezdi0e	1.8000	0.0000	\N
cm5810z1y0158qo49wfw9od0a	cm580u7tw005fqo493osdadwm	cm5810z1l014vqo495uhksngx	0.8000	0.0000	\N
cm5810z2y016tqo49oslfqya0	cm580ucjs005gqo49kt2dd9xy	cm5810z2q016cqo490h9vzsqj	150.0000	0.0000	\N
cm5810z3d017bqo49grgcu4hs	cm580tr1n005cqo497o75j33g	cm5810z360172qo499iquzrpl	1.0000	0.0000	\N
cm5810z3q0189qo496lxlij5i	cm580tr1n005cqo497o75j33g	cm5810z3i017sqo49095g2o6x	1.0000	0.0000	\N
cm5810z4h018tqo49mi9uos4i	cm580tx6t005dqo49iao7zwwu	cm5810z45018iqo49o7khwtct	1.4000	0.0000	\N
cm5810z4y019oqo49i87r4z2m	cm580ucjs005gqo49kt2dd9xy	cm5810z4n0198qo49mj7diyat	150.0000	0.0000	\N
cm5810z5a01adqo492tupiaev	cm580u7tw005fqo493osdadwm	cm5810z5401a0qo490i0mj0fy	0.8000	0.0000	\N
cm5810z5x01b3qo496fx3ebln	cm580tx6t005dqo49iao7zwwu	cm5810z5i01aqqo49zyp50aix	1.4000	0.0000	\N
cm5810z6i01bsqo49g1n346x5	cm580tr1n005cqo497o75j33g	cm5810z6501bgqo49cvp5l2l9	1.0000	0.0000	\N
cm5810z7201cfqo49onmlrgy8	cm580tr1n005cqo497o75j33g	cm5810z6s01c6qo495ha6n0p7	1.0000	0.0000	\N
cm5810z7v01deqo49u693y5f0	cm580tx6t005dqo49iao7zwwu	cm5810z7e01cwqo49543vrblm	1.4000	0.0000	\N
cm5810z8q01e2qo49nfhynjkt	cm580u2e0005eqo49950rh66x	cm5810z8901dnqo49qp0x9lvj	1.8000	0.0000	\N
cm5810z9q01enqo49k2tgyawe	cm580u2e0005eqo49950rh66x	cm5810z9501edqo495dnq830g	1.8000	0.0000	\N
cm5810zb601fkqo49w0wzr0nt	cm580u2e0005eqo49950rh66x	cm5810zaj01f3qo49bwhzd6me	1.8000	0.0000	\N
cm5810zbu01g4qo4993u6r77w	cm580u2e0005eqo49950rh66x	cm5810zbi01ftqo49t4rxkt1r	1.8000	0.0000	\N
cm5810zce01gzqo49wgu0phkn	cm580ucjs005gqo49kt2dd9xy	cm5810zc401gjqo49enoj2es0	150.0000	0.0000	\N
cm5810zcx01hnqo49l3r6m1eb	cm580tr1n005cqo497o75j33g	cm5810zco01haqo49ejcpoi8l	1.0000	0.0000	\N
cm5810zdi01idqo49v84ykv5y	cm580tr1n005cqo497o75j33g	cm5810zd501i1qo49youqq1py	1.0000	0.0000	\N
cm5810zdz01j8qo49s2oja8le	cm580u2e0005eqo49950rh66x	cm5810zdp01irqo494o0haro0	1.8000	0.0000	\N
cm5810zei01jvqo49w95w835n	cm580u7tw005fqo493osdadwm	cm5810ze501jhqo49yzo3clt5	0.8000	0.0000	\N
cm5810zfj01klqo493uqr4ikg	cm580u7tw005fqo493osdadwm	cm5810zet01k8qo49lolcl4b0	0.8000	0.0000	\N
cm5810zfz01lbqo49wmlf8mzv	cm580tx6t005dqo49iao7zwwu	cm5810zfq01kyqo49vx9k0byu	1.4000	0.0000	\N
cm5810zgf01m3qo49pf3ovsai	cm580u2e0005eqo49950rh66x	cm5810zg801loqo49p3ldvva9	1.8000	0.0000	\N
cm5810y590060qo497ktbdt6f	cm580tr1n005cqo497o75j33g	cm5810y46005pqo49ynbtedva	1.0000	0.0000	665251446636
cm5810y5r0068qo49hyi1qnmv	cm580tx6t005dqo49iao7zwwu	cm5810y46005pqo49ynbtedva	1.4000	0.0000	974136137777
cm5810y590062qo49unwsledn	cm580u2e0005eqo49950rh66x	cm5810y46005pqo49ynbtedva	1.8000	0.0000	676586627076
cm5810y5p0065qo49564t4t87	cm580u7tw005fqo493osdadwm	cm5810y46005pqo49ynbtedva	0.8000	0.0000	23058929340
cm5810y5p0066qo497l0tji2q	cm580ucjs005gqo49kt2dd9xy	cm5810y46005pqo49ynbtedva	150.0000	0.0000	846192412288
cm5dqod1z005toa40f7bgmap5	cm580tr1n005cqo497o75j33g	cm5dqod1r005roa40kxyhr1b6	11144.6300	0.0000	683950154424
cm5dqod20005uoa40kulcyix6	cm580tx6t005dqo49iao7zwwu	cm5dqod1r005roa40kxyhr1b6	0.0000	0.0000	262853376276
cm5dqod20005voa40zhkg9zy6	cm580u2e0005eqo49950rh66x	cm5dqod1r005roa40kxyhr1b6	0.0000	0.0000	786299278546
cm5dqod20005woa40ysw66kj0	cm580u7tw005fqo493osdadwm	cm5dqod1r005roa40kxyhr1b6	0.0000	0.0000	581096402956
cm5dqod20005xoa401ajt8mvh	cm580ucjs005gqo49kt2dd9xy	cm5dqod1r005roa40kxyhr1b6	11144.6300	0.0000	245307227698
cm5810yhf00ggqo49f6xkm3yz	cm580tr1n005cqo497o75j33g	cm5810yh200g5qo49koq2jf25	1.0000	0.0000	\N
cm5810yic00hbqo496rdsup82	cm580ucjs005gqo49kt2dd9xy	cm5810yhs00gvqo49tnxikehp	150.0000	0.0000	\N
cm5810yj500huqo49lnv7k36w	cm580tr1n005cqo497o75j33g	cm5810yir00hlqo49x4sgzc5o	1.0000	0.0000	\N
cm5810yjq00isqo49ac0t5qh6	cm580tx6t005dqo49iao7zwwu	cm5810yjf00ibqo491rjrde6k	1.4000	0.0000	\N
cm5810ykk00jfqo495ev522ob	cm580ucjs005gqo49kt2dd9xy	cm5810yk200j1qo497tyy0f1d	150.0000	0.0000	\N
cm5810yld00k7qo49tdv8mk40	cm580ucjs005gqo49kt2dd9xy	cm5810ykw00jsqo492ek4wg2l	150.0000	0.0000	\N
cm5810ym900krqo49y96qtzlp	cm580tr1n005cqo497o75j33g	cm5810ylu00kiqo49k40mv1mc	1.0000	0.0000	\N
cm5810ymv00lnqo49qtb44mbf	cm580u7tw005fqo493osdadwm	cm5810ymk00l8qo49k9jp9nkc	0.8000	0.0000	\N
cm5810yno00m7qo49ywbzdq77	cm580tr1n005cqo497o75j33g	cm5810yn600lyqo496zjvq41g	1.0000	0.0000	\N
cm5810yo800n3qo49u84t9lkl	cm580ucjs005gqo49kt2dd9xy	cm5810ynv00moqo4953xnkjjm	150.0000	0.0000	\N
cm5810yp000nqqo49kkaggju7	cm580u2e0005eqo49950rh66x	cm5810yoh00neqo49yy7zofm5	1.8000	0.0000	\N
cm5810ypt00oiqo49kbofzcfx	cm580tr1n005cqo497o75j33g	cm5810ypc00o5qo49ql1rf4ua	1.0000	0.0000	\N
cm5810yqh00p4qo49t3cq6mzd	cm580tr1n005cqo497o75j33g	cm5810yq300ovqo4992ox61mw	1.0000	0.0000	\N
cm5810yr500pyqo49f8qe91om	cm580tr1n005cqo497o75j33g	cm5810yqs00plqo49zl6utuot	1.0000	0.0000	\N
cm5810yru00qmqo49e7snu9m2	cm580ucjs005gqo49kt2dd9xy	cm5810yrf00qbqo49hinvhuyo	150.0000	0.0000	\N
cm5810ysk00rbqo49i7gn6hgs	cm580tr1n005cqo497o75j33g	cm5810ys600r1qo491odxqsjz	1.0000	0.0000	\N
cm5810yt300s9qo49po0rod8y	cm580u2e0005eqo49950rh66x	cm5810ysr00rsqo497k5s4ajz	1.8000	0.0000	\N
cm5810ytk00suqo491n72k0mf	cm580u7tw005fqo493osdadwm	cm5810ytc00siqo49gaaiy482	0.8000	0.0000	\N
cm5810yu200tkqo49f53mg7n7	cm580u2e0005eqo49950rh66x	cm5810ytr00t8qo49pqe7l1jq	1.8000	0.0000	\N
cm5810yui00ufqo499ro61gky	cm580tx6t005dqo49iao7zwwu	cm5810yua00tyqo49k4r6gcql	1.4000	0.0000	\N
cm5810yuz00uxqo499qs067i7	cm580tr1n005cqo497o75j33g	cm5810yur00uoqo49o5hcns7f	1.0000	0.0000	\N
cm5810yvh00vwqo490ny8icwk	cm580ucjs005gqo49kt2dd9xy	cm5810yv900veqo49dgw78b0s	150.0000	0.0000	\N
cm5810yvw00wmqo49r175pquy	cm580u7tw005fqo493osdadwm	cm5810yvo00w5qo49foq2gu77	0.8000	0.0000	\N
cm5810ywl00xaqo49phr7bbs1	cm580u7tw005fqo493osdadwm	cm5810yw500wvqo49qavnozo5	0.8000	0.0000	\N
cm5810yxg00xyqo492pxhbkis	cm580u7tw005fqo493osdadwm	cm5810yx000xlqo49572q7567	0.8000	0.0000	\N
cm5810yy500yoqo49is0wwqxc	cm580tx6t005dqo49iao7zwwu	cm5810yxq00ybqo493jjp1z4b	1.4000	0.0000	\N
cm5810yyl00zhqo49uadnqwqs	cm580u7tw005fqo493osdadwm	cm5810yyc00z1qo49sflyb1q8	0.8000	0.0000	\N
cm5810yz10104qo49e9ejsc1i	cm580tx6t005dqo49iao7zwwu	cm5810yyu00zsqo49wutfl1ea	1.4000	0.0000	\N
cm5810yze010rqo49zdlcldkw	cm580tr1n005cqo497o75j33g	cm5810yz8010iqo49322kfwlr	1.0000	0.0000	\N
cm5810yzt011pqo49kxm6v3fg	cm580ucjs005gqo49kt2dd9xy	cm5810yzl0118qo49zpafwuyb	150.0000	0.0000	\N
cm5810z07012aqo49ym2s7itc	cm580u2e0005eqo49950rh66x	cm5810yzy011yqo49hw6vun56	1.8000	0.0000	\N
cm5810z0o0136qo49ju1en6md	cm580u2e0005eqo49950rh66x	cm5810z0h012oqo49h0w3zpa7	1.8000	0.0000	\N
cm5810z11013qqo49w7j9itxu	cm580u2e0005eqo49950rh66x	cm5810z0t013fqo49okbn556w	1.8000	0.0000	\N
cm5810z1g014kqo49epg8v66c	cm580u7tw005fqo493osdadwm	cm5810z170145qo4990ezdi0e	0.8000	0.0000	\N
cm5810z1y015aqo49w8fy19gd	cm580ucjs005gqo49kt2dd9xy	cm5810z1l014vqo495uhksngx	150.0000	0.0000	\N
cm5810z2k015xqo49eq3k7x2e	cm580u2e0005eqo49950rh66x	cm5810z27015lqo494rs8lzi1	1.8000	0.0000	\N
cm5810z2y016pqo496m7kucit	cm580tx6t005dqo49iao7zwwu	cm5810z2q016cqo490h9vzsqj	1.4000	0.0000	\N
cm5810z3d017gqo49hv97w40d	cm580u7tw005fqo493osdadwm	cm5810z360172qo499iquzrpl	0.8000	0.0000	\N
cm5810z3q0187qo49dtua91sc	cm580ucjs005gqo49kt2dd9xy	cm5810z3i017sqo49095g2o6x	150.0000	0.0000	\N
cm5810z4h018rqo49c4d67w93	cm580tr1n005cqo497o75j33g	cm5810z45018iqo49o7khwtct	1.0000	0.0000	\N
cm5810z4y019rqo49kzqy4b6z	cm580tx6t005dqo49iao7zwwu	cm5810z4n0198qo49mj7diyat	1.4000	0.0000	\N
cm5810z5a01afqo492crbhx1s	cm580ucjs005gqo49kt2dd9xy	cm5810z5401a0qo490i0mj0fy	150.0000	0.0000	\N
cm5810z5x01b4qo49ra7n3zt3	cm580u7tw005fqo493osdadwm	cm5810z5i01aqqo49zyp50aix	0.8000	0.0000	\N
cm5810z6i01bxqo493d448v9j	cm580tx6t005dqo49iao7zwwu	cm5810z6501bgqo49cvp5l2l9	1.4000	0.0000	\N
cm5810z7201ciqo49f0isqwn3	cm580u2e0005eqo49950rh66x	cm5810z6s01c6qo495ha6n0p7	1.8000	0.0000	\N
cm5810z7v01d9qo49e4mmn0d3	cm580u7tw005fqo493osdadwm	cm5810z7e01cwqo49543vrblm	0.8000	0.0000	\N
cm5810z8q01dyqo49px5twace	cm580tr1n005cqo497o75j33g	cm5810z8901dnqo49qp0x9lvj	1.0000	0.0000	\N
cm5810z9r01etqo49gh4fshtw	cm580ucjs005gqo49kt2dd9xy	cm5810z9501edqo495dnq830g	150.0000	0.0000	\N
cm5810zb601feqo49mf0o3b3t	cm580tx6t005dqo49iao7zwwu	cm5810zaj01f3qo49bwhzd6me	1.4000	0.0000	\N
cm5810zbu01gaqo4977193xmp	cm580ucjs005gqo49kt2dd9xy	cm5810zbi01ftqo49t4rxkt1r	150.0000	0.0000	\N
cm5810zce01gxqo49v1xj5fod	cm580u7tw005fqo493osdadwm	cm5810zc401gjqo49enoj2es0	0.8000	0.0000	\N
cm5810zcx01hqqo49ky7z50ku	cm580u7tw005fqo493osdadwm	cm5810zco01haqo49ejcpoi8l	0.8000	0.0000	\N
cm5810zdi01igqo49b3exwkzm	cm580u7tw005fqo493osdadwm	cm5810zd501i1qo49youqq1py	0.8000	0.0000	\N
cm5810zdz01j5qo49mwmc16lv	cm580u7tw005fqo493osdadwm	cm5810zdp01irqo494o0haro0	0.8000	0.0000	\N
cm5810zei01jtqo49jc5kk5fc	cm580u2e0005eqo49950rh66x	cm5810ze501jhqo49yzo3clt5	1.8000	0.0000	\N
cm5810zfj01kpqo494dbxu3nr	cm580tx6t005dqo49iao7zwwu	cm5810zet01k8qo49lolcl4b0	1.4000	0.0000	\N
cm5810zfz01l9qo49zu9mbwnd	cm580u2e0005eqo49950rh66x	cm5810zfq01kyqo49vx9k0byu	1.8000	0.0000	\N
cm5810zgf01m1qo49q3527367	cm580ucjs005gqo49kt2dd9xy	cm5810zg801loqo49p3ldvva9	150.0000	0.0000	\N
cm5810yhf00gjqo49quauh3kl	cm580ucjs005gqo49kt2dd9xy	cm5810yh200g5qo49koq2jf25	150.0000	0.0000	\N
cm5810yic00h7qo49b0v7gnx2	cm580u7tw005fqo493osdadwm	cm5810yhs00gvqo49tnxikehp	0.8000	0.0000	\N
cm5810yj500hwqo4993lq9ee3	cm580u2e0005eqo49950rh66x	cm5810yir00hlqo49x4sgzc5o	1.8000	0.0000	\N
cm5810yjp00inqo49vh05lbo2	cm580u7tw005fqo493osdadwm	cm5810yjf00ibqo491rjrde6k	0.8000	0.0000	\N
cm5810ykj00jbqo49t33atlmx	cm580tr1n005cqo497o75j33g	cm5810yk200j1qo497tyy0f1d	1.0000	0.0000	\N
cm5810ylc00k3qo49kfwn3hqm	cm580u2e0005eqo49950rh66x	cm5810ykw00jsqo492ek4wg2l	1.8000	0.0000	\N
cm5810ym900kyqo49oekgnxrh	cm580u2e0005eqo49950rh66x	cm5810ylu00kiqo49k40mv1mc	1.8000	0.0000	\N
cm5810ymv00lpqo49ue9adw44	cm580ucjs005gqo49kt2dd9xy	cm5810ymk00l8qo49k9jp9nkc	150.0000	0.0000	\N
cm5810yno00m9qo495apxgojl	cm580u2e0005eqo49950rh66x	cm5810yn600lyqo496zjvq41g	1.8000	0.0000	\N
cm5810yo800n1qo4986daq11c	cm580tx6t005dqo49iao7zwwu	cm5810ynv00moqo4953xnkjjm	1.4000	0.0000	\N
cm5810yp000nsqo49d86c9sxn	cm580tx6t005dqo49iao7zwwu	cm5810yoh00neqo49yy7zofm5	1.4000	0.0000	\N
cm5810ypt00okqo49l50sqbij	cm580ucjs005gqo49kt2dd9xy	cm5810ypc00o5qo49ql1rf4ua	150.0000	0.0000	\N
cm5810yqh00p9qo4967r3zks9	cm580u7tw005fqo493osdadwm	cm5810yq300ovqo4992ox61mw	0.8000	0.0000	\N
cm5810yr500q2qo49ekl3a0pv	cm580tx6t005dqo49iao7zwwu	cm5810yqs00plqo49zl6utuot	1.4000	0.0000	\N
cm5810yru00qrqo49xo0zvlby	cm580u2e0005eqo49950rh66x	cm5810yrf00qbqo49hinvhuyo	1.8000	0.0000	\N
cm5810ysk00rhqo491ub1tzq9	cm580u7tw005fqo493osdadwm	cm5810ys600r1qo491odxqsjz	0.8000	0.0000	\N
cm5810yt300s3qo491ogyag72	cm580tx6t005dqo49iao7zwwu	cm5810ysr00rsqo497k5s4ajz	1.4000	0.0000	\N
cm5810ytk00srqo49ja1sry20	cm580tr1n005cqo497o75j33g	cm5810ytc00siqo49gaaiy482	1.0000	0.0000	\N
cm5810yu200tlqo49b9ln72k3	cm580u7tw005fqo493osdadwm	cm5810ytr00t8qo49pqe7l1jq	0.8000	0.0000	\N
cm5810yui00u9qo496agifjb5	cm580u2e0005eqo49950rh66x	cm5810yua00tyqo49k4r6gcql	1.8000	0.0000	\N
cm5810yuz00uzqo497ujwro16	cm580u2e0005eqo49950rh66x	cm5810yur00uoqo49o5hcns7f	1.8000	0.0000	\N
cm5810yvh00vvqo498tth4ql7	cm580u7tw005fqo493osdadwm	cm5810yv900veqo49dgw78b0s	0.8000	0.0000	\N
cm5810yvv00wgqo493w93rmyu	cm580tx6t005dqo49iao7zwwu	cm5810yvo00w5qo49foq2gu77	1.4000	0.0000	\N
cm5810ywl00xcqo49o1atpzh2	cm580ucjs005gqo49kt2dd9xy	cm5810yw500wvqo49qavnozo5	150.0000	0.0000	\N
cm5810yxg00xvqo49oz6bao02	cm580tr1n005cqo497o75j33g	cm5810yx000xlqo49572q7567	1.0000	0.0000	\N
cm5810yy600yrqo49hqouz6by	cm580ucjs005gqo49kt2dd9xy	cm5810yxq00ybqo493jjp1z4b	150.0000	0.0000	\N
cm5810yyl00zdqo49c5tdf3za	cm580u2e0005eqo49950rh66x	cm5810yyc00z1qo49sflyb1q8	1.8000	0.0000	\N
cm5810yz10107qo494h66eq55	cm580ucjs005gqo49kt2dd9xy	cm5810yyu00zsqo49wutfl1ea	150.0000	0.0000	\N
cm5810yze010wqo4916o6uqxy	cm580u2e0005eqo49950rh66x	cm5810yz8010iqo49322kfwlr	1.8000	0.0000	\N
cm5810yzt011lqo49yw9puk0i	cm580tx6t005dqo49iao7zwwu	cm5810yzl0118qo49zpafwuyb	1.4000	0.0000	\N
cm5810z07012dqo49u3rkn14p	cm580ucjs005gqo49kt2dd9xy	cm5810yzy011yqo49hw6vun56	150.0000	0.0000	\N
cm5810z0o0134qo49ex62xfa3	cm580tr1n005cqo497o75j33g	cm5810z0h012oqo49h0w3zpa7	1.0000	0.0000	\N
cm5810z10013oqo49hp4b5eaj	cm580u7tw005fqo493osdadwm	cm5810z0t013fqo49okbn556w	0.8000	0.0000	\N
cm5810z1y015cqo49izsejj2p	cm580u2e0005eqo49950rh66x	cm5810z1l014vqo495uhksngx	1.8000	0.0000	\N
cm5810z2k0161qo49260ydrwi	cm580ucjs005gqo49kt2dd9xy	cm5810z27015lqo494rs8lzi1	150.0000	0.0000	\N
cm5810z2y016nqo49vhwyslyi	cm580u2e0005eqo49950rh66x	cm5810z2q016cqo490h9vzsqj	1.8000	0.0000	\N
cm5810z3d017jqo49zcjf21o9	cm580tx6t005dqo49iao7zwwu	cm5810z360172qo499iquzrpl	1.4000	0.0000	\N
cm5810z3q0182qo49ww3m6hky	cm580tx6t005dqo49iao7zwwu	cm5810z3i017sqo49095g2o6x	1.4000	0.0000	\N
cm5810z4h018xqo49qzt2nj0n	cm580u7tw005fqo493osdadwm	cm5810z45018iqo49o7khwtct	0.8000	0.0000	\N
cm5810z4y019mqo49cjwn3po6	cm580u2e0005eqo49950rh66x	cm5810z4n0198qo49mj7diyat	1.8000	0.0000	\N
cm5810z5b01ahqo49bu5eree9	cm580u2e0005eqo49950rh66x	cm5810z5401a0qo490i0mj0fy	1.8000	0.0000	\N
cm5810z5x01azqo496h0377lc	cm580tr1n005cqo497o75j33g	cm5810z5i01aqqo49zyp50aix	1.0000	0.0000	\N
cm5810z6i01bvqo49v1tun0r3	cm580ucjs005gqo49kt2dd9xy	cm5810z6501bgqo49cvp5l2l9	150.0000	0.0000	\N
cm5810z7201clqo499gn9j6h3	cm580ucjs005gqo49kt2dd9xy	cm5810z6s01c6qo495ha6n0p7	150.0000	0.0000	\N
cm5810z7v01ddqo49ndm421w6	cm580ucjs005gqo49kt2dd9xy	cm5810z7e01cwqo49543vrblm	150.0000	0.0000	\N
cm5810z8q01e1qo49tpxxbe2e	cm580u7tw005fqo493osdadwm	cm5810z8901dnqo49qp0x9lvj	0.8000	0.0000	\N
cm5810z9q01eoqo49n6lh1yud	cm580tr1n005cqo497o75j33g	cm5810z9501edqo495dnq830g	1.0000	0.0000	\N
cm5810zb601fgqo497cvcwt1e	cm580u7tw005fqo493osdadwm	cm5810zaj01f3qo49bwhzd6me	0.8000	0.0000	\N
cm5810zbu01g8qo49vzr1s7r7	cm580u7tw005fqo493osdadwm	cm5810zbi01ftqo49t4rxkt1r	0.8000	0.0000	\N
cm5810zce01gwqo4971zvj9l2	cm580tr1n005cqo497o75j33g	cm5810zc401gjqo49enoj2es0	1.0000	0.0000	\N
cm5810zcx01hsqo49w3drunjb	cm580ucjs005gqo49kt2dd9xy	cm5810zco01haqo49ejcpoi8l	150.0000	0.0000	\N
cm5810zdi01icqo49m0duo40w	cm580u2e0005eqo49950rh66x	cm5810zd501i1qo49youqq1py	1.8000	0.0000	\N
cm5810zdz01j6qo49ieucjmtd	cm580ucjs005gqo49kt2dd9xy	cm5810zdp01irqo494o0haro0	150.0000	0.0000	\N
cm5810zei01juqo4934xdy5zd	cm580tr1n005cqo497o75j33g	cm5810ze501jhqo49yzo3clt5	1.0000	0.0000	\N
cm5810zfi01kjqo49igkoot0d	cm580u2e0005eqo49950rh66x	cm5810zet01k8qo49lolcl4b0	1.8000	0.0000	\N
cm5810zfz01l8qo49ya4gxmsw	cm580tr1n005cqo497o75j33g	cm5810zfq01kyqo49vx9k0byu	1.0000	0.0000	\N
cm5810zgf01m5qo49sp1z4xs3	cm580tr1n005cqo497o75j33g	cm5810zg801loqo49p3ldvva9	1.0000	0.0000	\N
cm5810yhf00gmqo49v3x3i9qo	cm580u2e0005eqo49950rh66x	cm5810yh200g5qo49koq2jf25	1.8000	0.0000	\N
cm5810yic00h4qo49v63p2vw7	cm580tr1n005cqo497o75j33g	cm5810yhs00gvqo49tnxikehp	1.0000	0.0000	\N
cm5810yj500hyqo49xsjintel	cm580tx6t005dqo49iao7zwwu	cm5810yir00hlqo49x4sgzc5o	1.4000	0.0000	\N
cm5810yjp00ilqo49q1iarevo	cm580tr1n005cqo497o75j33g	cm5810yjf00ibqo491rjrde6k	1.0000	0.0000	\N
cm5810ykk00jjqo49jy3eo849	cm580u2e0005eqo49950rh66x	cm5810yk200j1qo497tyy0f1d	1.8000	0.0000	\N
cm5810ylc00k5qo493uh4ey60	cm580tx6t005dqo49iao7zwwu	cm5810ykw00jsqo492ek4wg2l	1.4000	0.0000	\N
cm5810ym900kuqo490eph0yqm	cm580u7tw005fqo493osdadwm	cm5810ylu00kiqo49k40mv1mc	0.8000	0.0000	\N
cm5810ymu00lhqo49f91tsr45	cm580tr1n005cqo497o75j33g	cm5810ymk00l8qo49k9jp9nkc	1.0000	0.0000	\N
cm5810yno00mfqo49hxlolqzc	cm580tx6t005dqo49iao7zwwu	cm5810yn600lyqo496zjvq41g	1.4000	0.0000	\N
cm5810yo800mxqo498pyiqhkr	cm580u2e0005eqo49950rh66x	cm5810ynv00moqo4953xnkjjm	1.8000	0.0000	\N
cm5810yoz00noqo491ku6yntb	cm580tr1n005cqo497o75j33g	cm5810yoh00neqo49yy7zofm5	1.0000	0.0000	\N
cm5810ypt00omqo49rsxhz1n9	cm580tx6t005dqo49iao7zwwu	cm5810ypc00o5qo49ql1rf4ua	1.4000	0.0000	\N
cm5810yqh00paqo49mx35prz1	cm580ucjs005gqo49kt2dd9xy	cm5810yq300ovqo4992ox61mw	150.0000	0.0000	\N
cm5810yr500pwqo497zohlvib	cm580u2e0005eqo49950rh66x	cm5810yqs00plqo49zl6utuot	1.8000	0.0000	\N
cm5810yru00qkqo49ba0kqmzy	cm580tr1n005cqo497o75j33g	cm5810yrf00qbqo49hinvhuyo	1.0000	0.0000	\N
cm5810ysk00rgqo49j5bswam1	cm580ucjs005gqo49kt2dd9xy	cm5810ys600r1qo491odxqsjz	150.0000	0.0000	\N
cm5810yt300s4qo49f83gd96b	cm580tr1n005cqo497o75j33g	cm5810ysr00rsqo497k5s4ajz	1.0000	0.0000	\N
cm5810ytk00szqo49qz0bife5	cm580u2e0005eqo49950rh66x	cm5810ytc00siqo49gaaiy482	1.8000	0.0000	\N
cm5810yu200tpqo49bixh1xs6	cm580tx6t005dqo49iao7zwwu	cm5810ytr00t8qo49pqe7l1jq	1.4000	0.0000	\N
cm5810yui00ubqo49xuf5a63g	cm580u7tw005fqo493osdadwm	cm5810yua00tyqo49k4r6gcql	0.8000	0.0000	\N
cm5810yuz00v3qo49bwn7hkfn	cm580ucjs005gqo49kt2dd9xy	cm5810yur00uoqo49o5hcns7f	150.0000	0.0000	\N
cm5810yvg00voqo49q71cylkb	cm580tr1n005cqo497o75j33g	cm5810yv900veqo49dgw78b0s	1.0000	0.0000	\N
cm5810yvw00wlqo49anl8hhtp	cm580ucjs005gqo49kt2dd9xy	cm5810yvo00w5qo49foq2gu77	150.0000	0.0000	\N
cm5810ywk00x4qo49iw89pib2	cm580tr1n005cqo497o75j33g	cm5810yw500wvqo49qavnozo5	1.0000	0.0000	\N
cm5810yxh00y2qo49sdhwfa95	cm580u2e0005eqo49950rh66x	cm5810yx000xlqo49572q7567	1.8000	0.0000	\N
cm5810yy500ykqo492549htwx	cm580u2e0005eqo49950rh66x	cm5810yxq00ybqo493jjp1z4b	1.8000	0.0000	\N
cm5810yyl00zjqo49mzlwdxkh	cm580tx6t005dqo49iao7zwwu	cm5810yyc00z1qo49sflyb1q8	1.4000	0.0000	\N
cm5810yz10105qo494t8poa0u	cm580u7tw005fqo493osdadwm	cm5810yyu00zsqo49wutfl1ea	0.8000	0.0000	\N
cm5810yze010tqo49gk8yrpz8	cm580tx6t005dqo49iao7zwwu	cm5810yz8010iqo49322kfwlr	1.4000	0.0000	\N
cm5810yzt011jqo49f56vau43	cm580u2e0005eqo49950rh66x	cm5810yzl0118qo49zpafwuyb	1.8000	0.0000	\N
cm5810z070128qo492qwwcdbe	cm580tr1n005cqo497o75j33g	cm5810yzy011yqo49hw6vun56	1.0000	0.0000	\N
cm5810z0n0132qo492u4lk1b5	cm580ucjs005gqo49kt2dd9xy	cm5810z0h012oqo49h0w3zpa7	150.0000	0.0000	\N
cm5810z11013wqo49m8myd3b6	cm580tr1n005cqo497o75j33g	cm5810z0t013fqo49okbn556w	1.0000	0.0000	\N
cm5810z1f014eqo49u4j00auu	cm580tr1n005cqo497o75j33g	cm5810z170145qo4990ezdi0e	1.0000	0.0000	\N
cm5810z1g014mqo49qy8a8lyr	cm580ucjs005gqo49kt2dd9xy	cm5810z170145qo4990ezdi0e	150.0000	0.0000	\N
cm5810z1y0156qo49zh44noz1	cm580tx6t005dqo49iao7zwwu	cm5810z1l014vqo495uhksngx	1.4000	0.0000	\N
cm5810z2j015vqo492beu7s12	cm580tx6t005dqo49iao7zwwu	cm5810z27015lqo494rs8lzi1	1.4000	0.0000	\N
cm5810z2k0163qo49x1mq9lou	cm580tr1n005cqo497o75j33g	cm5810z27015lqo494rs8lzi1	1.0000	0.0000	\N
cm5810z2y016lqo49nd3jenvf	cm580tr1n005cqo497o75j33g	cm5810z2q016cqo490h9vzsqj	1.0000	0.0000	\N
cm5810z3d017hqo490a9vt67i	cm580u2e0005eqo49950rh66x	cm5810z360172qo499iquzrpl	1.8000	0.0000	\N
cm5810z3q0185qo49wezdijbs	cm580u7tw005fqo493osdadwm	cm5810z3i017sqo49095g2o6x	0.8000	0.0000	\N
cm5810z4h018vqo497mg3i89z	cm580u2e0005eqo49950rh66x	cm5810z45018iqo49o7khwtct	1.8000	0.0000	\N
cm5810z4y019pqo499doc3fg9	cm580u7tw005fqo493osdadwm	cm5810z4n0198qo49mj7diyat	0.8000	0.0000	\N
cm5810z5a01a9qo49b0vaz8mr	cm580tr1n005cqo497o75j33g	cm5810z5401a0qo490i0mj0fy	1.0000	0.0000	\N
cm5810z5x01b7qo493uiyowh0	cm580u2e0005eqo49950rh66x	cm5810z5i01aqqo49zyp50aix	1.8000	0.0000	\N
cm5810z6i01btqo49vjh9s7yj	cm580u7tw005fqo493osdadwm	cm5810z6501bgqo49cvp5l2l9	0.8000	0.0000	\N
cm5810z7201cjqo49t1fr07jx	cm580u7tw005fqo493osdadwm	cm5810z6s01c6qo495ha6n0p7	0.8000	0.0000	\N
cm5810z7v01daqo4983qjbpex	cm580u2e0005eqo49950rh66x	cm5810z7e01cwqo49543vrblm	1.8000	0.0000	\N
cm5810z8q01dxqo49bw153sdz	cm580tx6t005dqo49iao7zwwu	cm5810z8901dnqo49qp0x9lvj	1.4000	0.0000	\N
cm5810z9r01euqo49zgvn349d	cm580tx6t005dqo49iao7zwwu	cm5810z9501edqo495dnq830g	1.4000	0.0000	\N
cm5810zb601fiqo49ic3jx2sk	cm580ucjs005gqo49kt2dd9xy	cm5810zaj01f3qo49bwhzd6me	150.0000	0.0000	\N
cm5810zbu01g6qo49p6ft4iz9	cm580tx6t005dqo49iao7zwwu	cm5810zbi01ftqo49t4rxkt1r	1.4000	0.0000	\N
cm5810zce01guqo498tg7gl7p	cm580tx6t005dqo49iao7zwwu	cm5810zc401gjqo49enoj2es0	1.4000	0.0000	\N
cm5810zcx01hmqo498vqr31lf	cm580tx6t005dqo49iao7zwwu	cm5810zco01haqo49ejcpoi8l	1.4000	0.0000	\N
cm5810zdi01iiqo49cpqd0sxs	cm580ucjs005gqo49kt2dd9xy	cm5810zd501i1qo49youqq1py	150.0000	0.0000	\N
cm5810zdz01j2qo49p9h134lv	cm580tx6t005dqo49iao7zwwu	cm5810zdp01irqo494o0haro0	1.4000	0.0000	\N
cm5810zej01jzqo49ijngpwsc	cm580tx6t005dqo49iao7zwwu	cm5810ze501jhqo49yzo3clt5	1.4000	0.0000	\N
cm5810zfi01khqo497uge846a	cm580tr1n005cqo497o75j33g	cm5810zet01k8qo49lolcl4b0	1.0000	0.0000	\N
cm5810zfz01lfqo49t233hp29	cm580u7tw005fqo493osdadwm	cm5810zfq01kyqo49vx9k0byu	0.8000	0.0000	\N
cm5810zgf01lyqo49saudufgr	cm580tx6t005dqo49iao7zwwu	cm5810zg801loqo49p3ldvva9	1.4000	0.0000	\N
cm5810yhf00gfqo49wpr6ht6g	cm580tx6t005dqo49iao7zwwu	cm5810yh200g5qo49koq2jf25	1.4000	0.0000	\N
cm5810yic00h8qo4940elbu8p	cm580tx6t005dqo49iao7zwwu	cm5810yhs00gvqo49tnxikehp	1.4000	0.0000	\N
cm5810yj600i2qo491p9szoje	cm580ucjs005gqo49kt2dd9xy	cm5810yir00hlqo49x4sgzc5o	150.0000	0.0000	\N
cm5810yjp00ioqo49x6t42ico	cm580u2e0005eqo49950rh66x	cm5810yjf00ibqo491rjrde6k	1.8000	0.0000	\N
cm5810ykk00jhqo49r6ngqpek	cm580tx6t005dqo49iao7zwwu	cm5810yk200j1qo497tyy0f1d	1.4000	0.0000	\N
cm5810ylb00k1qo495lk2qjd1	cm580tr1n005cqo497o75j33g	cm5810ykw00jsqo492ek4wg2l	1.0000	0.0000	\N
cm5810ym900kvqo495semaovg	cm580tx6t005dqo49iao7zwwu	cm5810ylu00kiqo49k40mv1mc	1.4000	0.0000	\N
cm5810ymv00ljqo499n6pgsra	cm580tx6t005dqo49iao7zwwu	cm5810ymk00l8qo49k9jp9nkc	1.4000	0.0000	\N
cm5810yno00mdqo49xye8n65b	cm580ucjs005gqo49kt2dd9xy	cm5810yn600lyqo496zjvq41g	150.0000	0.0000	\N
cm5810yo800mzqo49ijdlw55n	cm580u7tw005fqo493osdadwm	cm5810ynv00moqo4953xnkjjm	0.8000	0.0000	\N
cm5810yp000nuqo494d8lc6w2	cm580ucjs005gqo49kt2dd9xy	cm5810yoh00neqo49yy7zofm5	150.0000	0.0000	\N
cm5810ypt00ofqo49it8urrx3	cm580u7tw005fqo493osdadwm	cm5810ypc00o5qo49ql1rf4ua	0.8000	0.0000	\N
cm5810yqh00pcqo497obdmhr6	cm580tx6t005dqo49iao7zwwu	cm5810yq300ovqo4992ox61mw	1.4000	0.0000	\N
cm5810yr500pvqo49iedb578p	cm580u7tw005fqo493osdadwm	cm5810yqs00plqo49zl6utuot	0.8000	0.0000	\N
cm5810yru00qsqo49w1imasvc	cm580tx6t005dqo49iao7zwwu	cm5810yrf00qbqo49hinvhuyo	1.4000	0.0000	\N
cm5810ysk00rfqo493a8y9kfd	cm580tx6t005dqo49iao7zwwu	cm5810ys600r1qo491odxqsjz	1.4000	0.0000	\N
cm5810yt300s5qo49tz6hjfst	cm580u7tw005fqo493osdadwm	cm5810ysr00rsqo497k5s4ajz	0.8000	0.0000	\N
cm5810ytk00sxqo49qd1tdyfu	cm580ucjs005gqo49kt2dd9xy	cm5810ytc00siqo49gaaiy482	150.0000	0.0000	\N
cm5810yu200tjqo49rmeauz98	cm580tr1n005cqo497o75j33g	cm5810ytr00t8qo49pqe7l1jq	1.0000	0.0000	\N
cm5810yui00udqo49dhs20eme	cm580ucjs005gqo49kt2dd9xy	cm5810yua00tyqo49k4r6gcql	150.0000	0.0000	\N
cm5810yuz00v4qo49xdq6ensc	cm580u7tw005fqo493osdadwm	cm5810yur00uoqo49o5hcns7f	0.8000	0.0000	\N
cm5810yvh00vqqo494w1cxbu9	cm580u2e0005eqo49950rh66x	cm5810yv900veqo49dgw78b0s	1.8000	0.0000	\N
cm5810yvv00weqo49l90aiu19	cm580tr1n005cqo497o75j33g	cm5810yvo00w5qo49foq2gu77	1.0000	0.0000	\N
cm5810ywl00x8qo49edo5tsvn	cm580tx6t005dqo49iao7zwwu	cm5810yw500wvqo49qavnozo5	1.4000	0.0000	\N
cm5810yxh00y0qo49tza7oas8	cm580ucjs005gqo49kt2dd9xy	cm5810yx000xlqo49572q7567	150.0000	0.0000	\N
cm5810yy500ymqo49xsccryef	cm580u7tw005fqo493osdadwm	cm5810yxq00ybqo493jjp1z4b	0.8000	0.0000	\N
cm5810yyl00zgqo49t940wyj2	cm580ucjs005gqo49kt2dd9xy	cm5810yyc00z1qo49sflyb1q8	150.0000	0.0000	\N
cm5810yz10102qo49dq4nms4e	cm580tr1n005cqo497o75j33g	cm5810yyu00zsqo49wutfl1ea	1.0000	0.0000	\N
cm5810yze010zqo491dya83k0	cm580ucjs005gqo49kt2dd9xy	cm5810yz8010iqo49322kfwlr	150.0000	0.0000	\N
cm5810yzt011nqo49eqdpnxkc	cm580u7tw005fqo493osdadwm	cm5810yzl0118qo49zpafwuyb	0.8000	0.0000	\N
cm5810z07012bqo497fzucze4	cm580u7tw005fqo493osdadwm	cm5810yzy011yqo49hw6vun56	0.8000	0.0000	\N
cm5810z0n012yqo491gqq82pl	cm580tx6t005dqo49iao7zwwu	cm5810z0h012oqo49h0w3zpa7	1.4000	0.0000	\N
cm5810z11013sqo497qebiwk7	cm580ucjs005gqo49kt2dd9xy	cm5810z0t013fqo49okbn556w	150.0000	0.0000	\N
cm5810z1f014gqo49agmvuenm	cm580tx6t005dqo49iao7zwwu	cm5810z170145qo4990ezdi0e	1.4000	0.0000	\N
cm5810z1y0154qo4940fixtye	cm580tr1n005cqo497o75j33g	cm5810z1l014vqo495uhksngx	1.0000	0.0000	\N
cm5810z2k015zqo49qysv72bn	cm580u7tw005fqo493osdadwm	cm5810z27015lqo494rs8lzi1	0.8000	0.0000	\N
cm5810z2y016rqo49rkmtqmk3	cm580u7tw005fqo493osdadwm	cm5810z2q016cqo490h9vzsqj	0.8000	0.0000	\N
cm5810z3d017fqo49nadfksot	cm580ucjs005gqo49kt2dd9xy	cm5810z360172qo499iquzrpl	150.0000	0.0000	\N
cm5810z3q0184qo49zms8zqvi	cm580u2e0005eqo49950rh66x	cm5810z3i017sqo49095g2o6x	1.8000	0.0000	\N
cm5810z4i018zqo49bdrnwuv3	cm580ucjs005gqo49kt2dd9xy	cm5810z45018iqo49o7khwtct	150.0000	0.0000	\N
cm5810z4y019kqo4932e1t8u1	cm580tr1n005cqo497o75j33g	cm5810z4n0198qo49mj7diyat	1.0000	0.0000	\N
cm5810z5a01aeqo49munws0zr	cm580tx6t005dqo49iao7zwwu	cm5810z5401a0qo490i0mj0fy	1.4000	0.0000	\N
cm5810z5x01b5qo49egd3ljq6	cm580ucjs005gqo49kt2dd9xy	cm5810z5i01aqqo49zyp50aix	150.0000	0.0000	\N
cm5810z6i01brqo49j43t905j	cm580u2e0005eqo49950rh66x	cm5810z6501bgqo49cvp5l2l9	1.8000	0.0000	\N
cm5810z7301cnqo496a0h4gdr	cm580tx6t005dqo49iao7zwwu	cm5810z6s01c6qo495ha6n0p7	1.4000	0.0000	\N
cm5810z7v01d6qo4994hug7dg	cm580tr1n005cqo497o75j33g	cm5810z7e01cwqo49543vrblm	1.0000	0.0000	\N
cm5810z8r01e4qo49b6h5wcm4	cm580ucjs005gqo49kt2dd9xy	cm5810z8901dnqo49qp0x9lvj	150.0000	0.0000	\N
cm5810z9q01eqqo49gk61s0nc	cm580u7tw005fqo493osdadwm	cm5810z9501edqo495dnq830g	0.8000	0.0000	\N
cm5810zb601fdqo49vpopd954	cm580tr1n005cqo497o75j33g	cm5810zaj01f3qo49bwhzd6me	1.0000	0.0000	\N
cm5810zbu01g2qo49uq8b1bg9	cm580tr1n005cqo497o75j33g	cm5810zbi01ftqo49t4rxkt1r	1.0000	0.0000	\N
cm5810zcf01h1qo490bt3vcjq	cm580u2e0005eqo49950rh66x	cm5810zc401gjqo49enoj2es0	1.8000	0.0000	\N
cm5810zcx01hoqo49i7rrfzjj	cm580u2e0005eqo49950rh66x	cm5810zco01haqo49ejcpoi8l	1.8000	0.0000	\N
cm5810zdi01ieqo49vq5zqfqy	cm580tx6t005dqo49iao7zwwu	cm5810zd501i1qo49youqq1py	1.4000	0.0000	\N
cm5810zdz01j1qo49a1nqficp	cm580tr1n005cqo497o75j33g	cm5810zdp01irqo494o0haro0	1.0000	0.0000	\N
cm5810zei01jxqo49w9fjpyfo	cm580ucjs005gqo49kt2dd9xy	cm5810ze501jhqo49yzo3clt5	150.0000	0.0000	\N
cm5810zfj01knqo49lwa5lmni	cm580ucjs005gqo49kt2dd9xy	cm5810zet01k8qo49lolcl4b0	150.0000	0.0000	\N
cm5810zfz01ldqo49pcul21yz	cm580ucjs005gqo49kt2dd9xy	cm5810zfq01kyqo49vx9k0byu	150.0000	0.0000	\N
cm5810zgf01lzqo49c0f5rbwh	cm580u7tw005fqo493osdadwm	cm5810zg801loqo49p3ldvva9	0.8000	0.0000	\N
\.


--
-- Data for Name: StockCardTaxRate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardTaxRate" (id, "stockCardId", "taxName", "taxRate") FROM stdin;
\.


--
-- Data for Name: StockCardVariation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardVariation" (id, "stockCardId", "variationName", "variationCode", "variationValue") FROM stdin;
\.


--
-- Data for Name: StockCardWarehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockCardWarehouse" (id, "stockCardId", "warehouseId", quantity) FROM stdin;
cm5810yde00ceqo49hylxtmdt	cm5810ycr00bqqo493so45oku	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ye400d4qo49cjj2ya8j	cm5810ydl00chqo49zebe93hc	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yey00dvqo49203z98tr	cm5810yea00d7qo4930j2ndaa	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yfr00elqo490n710uxb	cm5810yf200dyqo4927lfojk1	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ygb00fcqo49rcd1s38z	cm5810yfy00eoqo494kvxn0ds	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ygx00g2qo498brzvokl	cm5810ygf00ffqo4962b8w9do	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yhm00gsqo49qxisea92	cm5810yh200g5qo49koq2jf25	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yij00hiqo49gvyq1ut8	cm5810yhs00gvqo49tnxikehp	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yja00i8qo49y2p3eptq	cm5810yir00hlqo49x4sgzc5o	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yjx00iyqo49ai5clrx7	cm5810yjf00ibqo491rjrde6k	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ykr00jpqo49buezjz0z	cm5810yk200j1qo497tyy0f1d	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ylj00kfqo49n9gb1n9k	cm5810ykw00jsqo492ek4wg2l	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ymf00l5qo49aah56y6u	cm5810ylu00kiqo49k40mv1mc	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yn200lvqo494pl9q9yv	cm5810ymk00l8qo49k9jp9nkc	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yns00mlqo49n9gcm35s	cm5810yn600lyqo496zjvq41g	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yod00nbqo49e74n3jgs	cm5810ynv00moqo4953xnkjjm	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yp600o2qo49lw87p4rq	cm5810yoh00neqo49yy7zofm5	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ypz00osqo491cwlfa5d	cm5810ypc00o5qo49ql1rf4ua	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yqn00piqo49ki1jg326	cm5810yq300ovqo4992ox61mw	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yrb00q8qo49oki015wx	cm5810yqs00plqo49zl6utuot	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ys100qyqo49njbewikh	cm5810yrf00qbqo49hinvhuyo	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yso00rpqo49rdkt3i32	cm5810ys600r1qo491odxqsjz	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yt600sfqo49wmpcuoiv	cm5810ysr00rsqo497k5s4ajz	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ytn00t5qo49o294r8u9	cm5810ytc00siqo49gaaiy482	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yu700tvqo49v7upibma	cm5810ytr00t8qo49pqe7l1jq	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yun00ulqo49zpqvis56	cm5810yua00tyqo49k4r6gcql	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yv600vbqo49mgb3duzm	cm5810yur00uoqo49o5hcns7f	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yvl00w2qo49rlxehjxf	cm5810yv900veqo49dgw78b0s	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yw100wsqo49g5e0na0e	cm5810yvo00w5qo49foq2gu77	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ywq00xiqo491wdfgpgu	cm5810yw500wvqo49qavnozo5	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yxl00y8qo49phf8y2md	cm5810yx000xlqo49572q7567	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yya00yyqo49o3z5g4t3	cm5810yxq00ybqo493jjp1z4b	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yyr00zpqo49s83vudoi	cm5810yyc00z1qo49sflyb1q8	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yz5010fqo49v4n7xmny	cm5810yyu00zsqo49wutfl1ea	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yzh0115qo499rxtrw33	cm5810yz8010iqo49322kfwlr	cm580wneu005iqo493rmbwzp0	50.0000
cm5810yzv011vqo494kb9517h	cm5810yzl0118qo49zpafwuyb	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z0d012lqo49big0rbnv	cm5810yzy011yqo49hw6vun56	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z0q013cqo49ehk16qa4	cm5810z0h012oqo49h0w3zpa7	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z140142qo49hs5zs3kc	cm5810z0t013fqo49okbn556w	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z1j014sqo494ql3d6ik	cm5810z170145qo4990ezdi0e	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z23015iqo49t7kls600	cm5810z1l014vqo495uhksngx	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z2n0169qo49lpmqlvx9	cm5810z27015lqo494rs8lzi1	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z32016zqo49ew2n702a	cm5810z2q016cqo490h9vzsqj	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z3f017pqo49pbfcuacp	cm5810z360172qo499iquzrpl	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z3x018fqo49mtgt1b0t	cm5810z3i017sqo49095g2o6x	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z4k0195qo49atstmamc	cm5810z45018iqo49o7khwtct	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z51019xqo49syqgajha	cm5810z4n0198qo49mj7diyat	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z5e01anqo49irvy80zb	cm5810z5401a0qo490i0mj0fy	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z6201bdqo49kuq0qhje	cm5810z5i01aqqo49zyp50aix	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z6m01c3qo49qx04o7s9	cm5810z6501bgqo49cvp5l2l9	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z7801ctqo491gkz5u34	cm5810z6s01c6qo495ha6n0p7	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z8001dkqo49f8h7brtf	cm5810z7e01cwqo49543vrblm	cm580wneu005iqo493rmbwzp0	50.0000
cm5810z8w01eaqo496qbaf2ki	cm5810z8901dnqo49qp0x9lvj	cm580wneu005iqo493rmbwzp0	50.0000
cm5810za301f0qo49umuj9ga6	cm5810z9501edqo495dnq830g	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zbe01fqqo49s9ze4w0m	cm5810zaj01f3qo49bwhzd6me	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zby01ggqo49qy9lbz9c	cm5810zbi01ftqo49t4rxkt1r	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zci01h7qo49pm3j27m9	cm5810zc401gjqo49enoj2es0	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zd201hyqo49qics4gmw	cm5810zco01haqo49ejcpoi8l	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zdm01ioqo49tk46amyr	cm5810zd501i1qo49youqq1py	cm580wneu005iqo493rmbwzp0	50.0000
cm5810ze201jeqo49iprjeb19	cm5810zdp01irqo494o0haro0	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zen01k5qo490gus78j3	cm5810ze501jhqo49yzo3clt5	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zfm01kvqo49ft7c0acx	cm5810zet01k8qo49lolcl4b0	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zg301llqo49xl0gj19r	cm5810zfq01kyqo49vx9k0byu	cm580wneu005iqo493rmbwzp0	50.0000
cm5810zgi01mbqo496cq3m0f7	cm5810zg801loqo49p3ldvva9	cm580wneu005iqo493rmbwzp0	50.0000
cm5810y780075qo49ioas2ttc	cm5810y6f006hqo494yk8ct6a	cm580wneu005iqo493rmbwzp0	51.0000
cm5810y87007wqo49tevfhf2e	cm5810y7i0078qo499o503inm	cm580wneu005iqo493rmbwzp0	34.0000
cm5810y99008nqo493f2cg3yu	cm5810y8g007zqo49ols1soqm	cm580wneu005iqo493rmbwzp0	48.0000
cm5810ya6009eqo494yievf42	cm5810y9e008qqo49xtdla4v6	cm580wneu005iqo493rmbwzp0	48.0000
cm5810yaw00a5qo494yj31w7m	cm5810yab009hqo49c6c20v8u	cm580wneu005iqo493rmbwzp0	48.0000
cm5810ybx00awqo49ckrs1v8v	cm5810yb500a8qo49adwabm54	cm580wneu005iqo493rmbwzp0	48.0000
cm5810ycl00bnqo49ut61onr6	cm5810yc200azqo495vlug6em	cm580wneu005iqo493rmbwzp0	48.0000
cm5810y63006eqo49wz3se31d	cm5810y46005pqo49ynbtedva	cm580wneu005iqo493rmbwzp0	49.0000
cm5dqod28005yoa40cglfx904	cm5dqod1r005roa40kxyhr1b6	cm580wneu005iqo493rmbwzp0	2.0000
\.


--
-- Data for Name: StockMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockMovement" (id, "productCode", "warehouseCode", "branchCode", "currentCode", "documentType", "invoiceType", "movementType", "documentNo", "gcCode", type, description, quantity, "unitPrice", "totalPrice", "unitOfMeasure", "outWarehouseCode", "priceListId", "createdAt", "createdBy", "updatedAt", "updatedBy") FROM stdin;
cm5c6mywf0062qx3x74tx8uhi	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	\N	Cikis	\N	QRS2024000000004 no'lu hızlı satış için stok hareketi	3.0000	0.8000	2.4000	Adet	\N	\N	2024-12-31 08:04:25.263	\N	2024-12-31 08:04:25.263	\N
cm5c2m66l005kpe3x602txt9m	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	\N	Cikis	\N	QRS2024000000001 no'lu hızlı satış için stok hareketi	1.0000	0.8000	0.8000	Adet	\N	\N	2024-12-31 06:11:49.581	\N	2024-12-31 06:11:49.581	\N
cm5c6kreo005kqx3xi0sc3mu5	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	\N	Cikis	\N	QRS2024000000002 no'lu hızlı satış için stok hareketi	2.0000	0.8000	1.6000	Adet	\N	\N	2024-12-31 08:02:42.241	\N	2024-12-31 08:02:42.241	\N
cm5ce5wxd005rnp3zydtwgp6x	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	\N	Cikis	\N	QRS2024000000001 no'lu hızlı satış için stok hareketi	1.0000	0.8000	0.8000	Adet	\N	\N	2024-12-31 11:35:06.481	\N	2024-12-31 11:35:06.481	\N
cm5dqtrqp0063oa409kk7ao2z	KARGOPOSETI/BASKILI	ETC	ETC	20-T001	Invoice	Purchase	AlisFaturasi	PUR2025000000001	Giris	\N	PUR2025000000001 no'lu alış faturası için stok hareketi	2.0000	11144.6300	22289.2600	Adet	\N	cm580ucjs005gqo49kt2dd9xy	2025-01-01 10:17:21.074	\N	2025-01-01 10:17:21.074	\N
cm5ceb42a005lnv3suzk256gb	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	QRS2024000000002	Cikis	\N	QRS2024000000002 no'lu hızlı satış için stok hareketi	2.0000	0.8000	1.6000	Adet	\N	\N	2024-12-31 11:39:09.011	\N	2024-12-31 11:39:09.011	\N
cm5c6m9oa005uqx3xsjqke7zu	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	\N	Cikis	\N	QRS2024000000003 no'lu hızlı satış için stok hareketi	2.0000	0.8000	1.6000	Adet	\N	\N	2024-12-31 08:03:52.571	\N	2024-12-31 08:03:52.571	\N
cm5ce6dsh0061np3z6y524o72	REMA/iP-11/AçıkMavi	ETC	ETC	\N	Order	Sales	HizliSatis	QRS2024000000002	Cikis	\N	QRS2024000000001 no'lu hızlı satış için stok hareketi	1.0000	0.8000	0.8000	Adet	\N	\N	2024-12-31 11:35:28.337	\N	2024-12-31 11:35:28.337	\N
\.


--
-- Data for Name: StockTake; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockTake" (id, "stockCardIds", "warehouseId") FROM stdin;
\.


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Store" (id, name, "marketPlaceId", "apiCredentials") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, email, "firstName", "lastName", phone, address, "isActive", "companyCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580safx0006qo5zrg6txe8w	admin_user	$2b$10$rD7cDEhU6xPpvlCNwer2F.sx3jPdkdFd2UM/93IeSCA1zLcdpTSUy	admin@example.com	Admin	User	123456789	Admin Address	t	\N	2024-12-28 10:09:31.102	2024-12-28 10:09:31.102	\N	\N
cm5caej64005knp3zf9r3cyzu	Ali Rıza SELÇUK	$2b$10$terkHvogXz8xrAlP3JRiiOK.VRJShgprRq0BYffGi.zfn8rWGzah.	info@alirizaselcuk.com	Ali Rıza 	SELÇUK	05387019410	Denizli	t	VIP	2024-12-31 09:49:50.092	2024-12-31 09:49:50.092	\N	\N
\.


--
-- Data for Name: Vault; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vault" (id, "vaultName", "branchCode", balance, currency) FROM stdin;
cm5857ch0005cpa40wgqseq4y	Nakit	ETC	0.00	TRY
cm5857kdp005dpa40rzbjydtc	Nakit	ETC	-1.60	USD
\.


--
-- Data for Name: VaultMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VaultMovement" (id, "vaultId", "invoiceId", "receiptId", description, entering, emerging, "vaultDirection", "vaultType", "vaultDocumentType", "currentMovementId") FROM stdin;
\.


--
-- Data for Name: Warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Warehouse" (id, "warehouseName", "warehouseCode", address, "countryCode", city, district, phone, email, "companyCode", "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
cm580wneu005iqo493rmbwzp0	E-Ticaret	ETC	15 Mayıs Mahallesi 559/2 Sokak Kızılelma İş Merkezi No: 8A	TR	Denizli	Pamukkale	05387018419	info@alirizaselcuk.com	VIP	2024-12-28 10:12:54.534	2024-12-28 10:12:54.534	\N	\N
\.


--
-- Data for Name: _MarketPlaceAttributesToMarketPlaceProducts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_MarketPlaceAttributesToMarketPlaceProducts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _OrderToStore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_OrderToStore" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _PermissionToRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_PermissionToRole" ("A", "B") FROM stdin;
cm580sacc0000qo5z0arzwyfc	cm580sadk0004qo5zlau6ruuv
cm580sacv0001qo5z018yvkp1	cm580sadk0004qo5zlau6ruuv
cm580sadc0002qo5z0ou3mm9q	cm580sadk0004qo5zlau6ruuv
cm580sadg0003qo5z2mbn68vl	cm580sadk0004qo5zlau6ruuv
cm580sacv0001qo5z018yvkp1	cm580sadx0005qo5z8ztd4oyr
\.


--
-- Data for Name: _PermissionToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_PermissionToUser" ("A", "B") FROM stdin;
cm580rpie0008qo490rjlunch	cm5caej64005knp3zf9r3cyzu
\.


--
-- Data for Name: _ProductsOnCategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProductsOnCategories" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _RoleToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_RoleToUser" ("A", "B") FROM stdin;
cm580sadk0004qo5zlau6ruuv	cm580safx0006qo5zrg6txe8w
cm580sadk0004qo5zlau6ruuv	cm5caej64005knp3zf9r3cyzu
\.


--
-- Data for Name: _StockCardBarcodeToStockCardVariation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_StockCardBarcodeToStockCardVariation" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _StockCardPriceListItemsToStockCardVariation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_StockCardPriceListItemsToStockCardVariation" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _StockCardToStore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_StockCardToStore" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d75e4a67-9a12-48bd-83a5-5cfc8c3a62a9	b796cf712cad1d0495dbd5ccf6ecbb16ec29f61746e45e643ef70b0eaff7efc6	2024-12-28 10:08:55.536477+00	20241228072451_init	\N	\N	2024-12-28 10:08:55.254392+00	1
253658d4-f595-4aa4-b45d-10b2d79e9971	95cb6a51b617192c148181ee8f439d1c92f6d045e0194f531a0797bd334a778b	\N	20250102082723_init	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250102082723_init\n\nDatabase error code: 23502\n\nDatabase error:\nERROR: column "companyCode" of relation "User" contains null values\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23502), message: "column \\"companyCode\\" of relation \\"User\\" contains null values", detail: None, hint: None, position: None, where_: None, schema: Some("public"), table: Some("User"), column: Some("companyCode"), datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(6111), routine: Some("ATRewriteTable") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250102082723_init"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20250102082723_init"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	\N	2025-01-02 08:28:31.981269+00	0
\.


--
-- Name: BankMovement BankMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankMovement"
    ADD CONSTRAINT "BankMovement_pkey" PRIMARY KEY (id);


--
-- Name: Bank Bank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bank"
    ADD CONSTRAINT "Bank_pkey" PRIMARY KEY (id);


--
-- Name: BranchWarehouse BranchWarehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BranchWarehouse"
    ADD CONSTRAINT "BranchWarehouse_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: CurrentAddress CurrentAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentAddress"
    ADD CONSTRAINT "CurrentAddress_pkey" PRIMARY KEY (id);


--
-- Name: CurrentBranch CurrentBranch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentBranch"
    ADD CONSTRAINT "CurrentBranch_pkey" PRIMARY KEY (id);


--
-- Name: CurrentCategoryItem CurrentCategoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentCategoryItem"
    ADD CONSTRAINT "CurrentCategoryItem_pkey" PRIMARY KEY (id);


--
-- Name: CurrentCategory CurrentCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentCategory"
    ADD CONSTRAINT "CurrentCategory_pkey" PRIMARY KEY (id);


--
-- Name: CurrentFinancial CurrentFinancial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentFinancial"
    ADD CONSTRAINT "CurrentFinancial_pkey" PRIMARY KEY (id);


--
-- Name: CurrentMovement CurrentMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_pkey" PRIMARY KEY (id);


--
-- Name: CurrentOfficials CurrentOfficials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentOfficials"
    ADD CONSTRAINT "CurrentOfficials_pkey" PRIMARY KEY (id);


--
-- Name: CurrentRisk CurrentRisk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentRisk"
    ADD CONSTRAINT "CurrentRisk_pkey" PRIMARY KEY (id);


--
-- Name: Current Current_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Current"
    ADD CONSTRAINT "Current_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceDetail InvoiceDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceDetail"
    ADD CONSTRAINT "InvoiceDetail_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceAttributes MarketPlaceAttributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceAttributes"
    ADD CONSTRAINT "MarketPlaceAttributes_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceBrands MarketPlaceBrands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceBrands"
    ADD CONSTRAINT "MarketPlaceBrands_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceCategories MarketPlaceCategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceCategories"
    ADD CONSTRAINT "MarketPlaceCategories_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceProductImages MarketPlaceProductImages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProductImages"
    ADD CONSTRAINT "MarketPlaceProductImages_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceProductMatch MarketPlaceProductMatch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProductMatch"
    ADD CONSTRAINT "MarketPlaceProductMatch_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlaceProducts MarketPlaceProducts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProducts"
    ADD CONSTRAINT "MarketPlaceProducts_pkey" PRIMARY KEY (id);


--
-- Name: MarketPlace MarketPlace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlace"
    ADD CONSTRAINT "MarketPlace_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderCargo OrderCargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderCargo"
    ADD CONSTRAINT "OrderCargo_pkey" PRIMARY KEY (id);


--
-- Name: OrderInvoiceAddress OrderInvoiceAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderInvoiceAddress"
    ADD CONSTRAINT "OrderInvoiceAddress_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: PermissionGroup PermissionGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PermissionGroup"
    ADD CONSTRAINT "PermissionGroup_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PosMovement PosMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PosMovement"
    ADD CONSTRAINT "PosMovement_pkey" PRIMARY KEY (id);


--
-- Name: Pos Pos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pos"
    ADD CONSTRAINT "Pos_pkey" PRIMARY KEY (id);


--
-- Name: ReceiptDetail ReceiptDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiptDetail"
    ADD CONSTRAINT "ReceiptDetail_pkey" PRIMARY KEY (id);


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: StockCardAttributeItems StockCardAttributeItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardAttributeItems"
    ADD CONSTRAINT "StockCardAttributeItems_pkey" PRIMARY KEY (id);


--
-- Name: StockCardAttribute StockCardAttribute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardAttribute"
    ADD CONSTRAINT "StockCardAttribute_pkey" PRIMARY KEY (id);


--
-- Name: StockCardBarcode StockCardBarcode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardBarcode"
    ADD CONSTRAINT "StockCardBarcode_pkey" PRIMARY KEY (id);


--
-- Name: StockCardCategoryItem StockCardCategoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardCategoryItem"
    ADD CONSTRAINT "StockCardCategoryItem_pkey" PRIMARY KEY (id);


--
-- Name: StockCardCategory StockCardCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardCategory"
    ADD CONSTRAINT "StockCardCategory_pkey" PRIMARY KEY (id);


--
-- Name: StockCardEFatura StockCardEFatura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardEFatura"
    ADD CONSTRAINT "StockCardEFatura_pkey" PRIMARY KEY (id);


--
-- Name: StockCardManufacturer StockCardManufacturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardManufacturer"
    ADD CONSTRAINT "StockCardManufacturer_pkey" PRIMARY KEY (id);


--
-- Name: StockCardMarketNames StockCardMarketNames_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardMarketNames"
    ADD CONSTRAINT "StockCardMarketNames_pkey" PRIMARY KEY (id);


--
-- Name: StockCardPriceListItems StockCardPriceListItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardPriceListItems"
    ADD CONSTRAINT "StockCardPriceListItems_pkey" PRIMARY KEY (id);


--
-- Name: StockCardPriceList StockCardPriceList_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardPriceList"
    ADD CONSTRAINT "StockCardPriceList_pkey" PRIMARY KEY (id);


--
-- Name: StockCardTaxRate StockCardTaxRate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardTaxRate"
    ADD CONSTRAINT "StockCardTaxRate_pkey" PRIMARY KEY (id);


--
-- Name: StockCardVariation StockCardVariation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardVariation"
    ADD CONSTRAINT "StockCardVariation_pkey" PRIMARY KEY (id);


--
-- Name: StockCardWarehouse StockCardWarehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardWarehouse"
    ADD CONSTRAINT "StockCardWarehouse_pkey" PRIMARY KEY (id);


--
-- Name: StockCard StockCard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCard"
    ADD CONSTRAINT "StockCard_pkey" PRIMARY KEY (id);


--
-- Name: StockMovement StockMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY (id);


--
-- Name: StockTake StockTake_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockTake"
    ADD CONSTRAINT "StockTake_pkey" PRIMARY KEY (id);


--
-- Name: Store Store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VaultMovement VaultMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaultMovement"
    ADD CONSTRAINT "VaultMovement_pkey" PRIMARY KEY (id);


--
-- Name: Vault Vault_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vault"
    ADD CONSTRAINT "Vault_pkey" PRIMARY KEY (id);


--
-- Name: Warehouse Warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY (id);


--
-- Name: _MarketPlaceAttributesToMarketPlaceProducts _MarketPlaceAttributesToMarketPlaceProducts_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_MarketPlaceAttributesToMarketPlaceProducts"
    ADD CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _OrderToStore _OrderToStore_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_OrderToStore"
    ADD CONSTRAINT "_OrderToStore_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _PermissionToRole _PermissionToRole_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToRole"
    ADD CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _PermissionToUser _PermissionToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToUser"
    ADD CONSTRAINT "_PermissionToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProductsOnCategories _ProductsOnCategories_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductsOnCategories"
    ADD CONSTRAINT "_ProductsOnCategories_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _RoleToUser _RoleToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RoleToUser"
    ADD CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _StockCardBarcodeToStockCardVariation _StockCardBarcodeToStockCardVariation_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardBarcodeToStockCardVariation"
    ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _StockCardPriceListItemsToStockCardVariation _StockCardPriceListItemsToStockCardVariation_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardPriceListItemsToStockCardVariation"
    ADD CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _StockCardToStore _StockCardToStore_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardToStore"
    ADD CONSTRAINT "_StockCardToStore_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BranchWarehouse_branchId_warehouseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BranchWarehouse_branchId_warehouseId_key" ON public."BranchWarehouse" USING btree ("branchId", "warehouseId");


--
-- Name: Branch_branchCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Branch_branchCode_key" ON public."Branch" USING btree ("branchCode");


--
-- Name: Branch_branchName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Branch_branchName_key" ON public."Branch" USING btree ("branchName");


--
-- Name: Brand_brandCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_brandCode_key" ON public."Brand" USING btree ("brandCode");


--
-- Name: Brand_brandName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_brandName_key" ON public."Brand" USING btree ("brandName");


--
-- Name: Company_companyCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Company_companyCode_key" ON public."Company" USING btree ("companyCode");


--
-- Name: Company_companyName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Company_companyName_key" ON public."Company" USING btree ("companyName");


--
-- Name: Company_taxNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Company_taxNumber_key" ON public."Company" USING btree ("taxNumber");


--
-- Name: CurrentCategory_categoryCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CurrentCategory_categoryCode_key" ON public."CurrentCategory" USING btree ("categoryCode");


--
-- Name: CurrentRisk_currentCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CurrentRisk_currentCode_key" ON public."CurrentRisk" USING btree ("currentCode");


--
-- Name: Current_currentCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Current_currentCode_key" ON public."Current" USING btree ("currentCode");


--
-- Name: Invoice_invoiceNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON public."Invoice" USING btree ("invoiceNo");


--
-- Name: PermissionGroup_groupName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PermissionGroup_groupName_key" ON public."PermissionGroup" USING btree ("groupName");


--
-- Name: Permission_permissionName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_permissionName_key" ON public."Permission" USING btree ("permissionName");


--
-- Name: Permission_route_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_route_key" ON public."Permission" USING btree (route);


--
-- Name: Role_roleName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_roleName_key" ON public."Role" USING btree ("roleName");


--
-- Name: StockCardBarcode_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardBarcode_barcode_key" ON public."StockCardBarcode" USING btree (barcode);


--
-- Name: StockCardCategory_categoryCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardCategory_categoryCode_key" ON public."StockCardCategory" USING btree ("categoryCode");


--
-- Name: StockCardCategory_categoryName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardCategory_categoryName_key" ON public."StockCardCategory" USING btree ("categoryName");


--
-- Name: StockCardEFatura_productCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardEFatura_productCode_key" ON public."StockCardEFatura" USING btree ("productCode");


--
-- Name: StockCardManufacturer_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardManufacturer_barcode_key" ON public."StockCardManufacturer" USING btree (barcode);


--
-- Name: StockCardPriceList_priceListName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardPriceList_priceListName_key" ON public."StockCardPriceList" USING btree ("priceListName");


--
-- Name: StockCardVariation_variationCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardVariation_variationCode_key" ON public."StockCardVariation" USING btree ("variationCode");


--
-- Name: StockCardWarehouse_stockCardId_warehouseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCardWarehouse_stockCardId_warehouseId_key" ON public."StockCardWarehouse" USING btree ("stockCardId", "warehouseId");


--
-- Name: StockCard_productCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockCard_productCode_key" ON public."StockCard" USING btree ("productCode");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Warehouse_warehouseCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Warehouse_warehouseCode_key" ON public."Warehouse" USING btree ("warehouseCode");


--
-- Name: Warehouse_warehouseName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Warehouse_warehouseName_key" ON public."Warehouse" USING btree ("warehouseName");


--
-- Name: _MarketPlaceAttributesToMarketPlaceProducts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_MarketPlaceAttributesToMarketPlaceProducts_B_index" ON public."_MarketPlaceAttributesToMarketPlaceProducts" USING btree ("B");


--
-- Name: _OrderToStore_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_OrderToStore_B_index" ON public."_OrderToStore" USING btree ("B");


--
-- Name: _PermissionToRole_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_PermissionToRole_B_index" ON public."_PermissionToRole" USING btree ("B");


--
-- Name: _PermissionToUser_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_PermissionToUser_B_index" ON public."_PermissionToUser" USING btree ("B");


--
-- Name: _ProductsOnCategories_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProductsOnCategories_B_index" ON public."_ProductsOnCategories" USING btree ("B");


--
-- Name: _RoleToUser_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_RoleToUser_B_index" ON public."_RoleToUser" USING btree ("B");


--
-- Name: _StockCardBarcodeToStockCardVariation_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_StockCardBarcodeToStockCardVariation_B_index" ON public."_StockCardBarcodeToStockCardVariation" USING btree ("B");


--
-- Name: _StockCardPriceListItemsToStockCardVariation_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_StockCardPriceListItemsToStockCardVariation_B_index" ON public."_StockCardPriceListItemsToStockCardVariation" USING btree ("B");


--
-- Name: _StockCardToStore_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_StockCardToStore_B_index" ON public."_StockCardToStore" USING btree ("B");


--
-- Name: BankMovement BankMovement_bankId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankMovement"
    ADD CONSTRAINT "BankMovement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES public."Bank"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BankMovement BankMovement_currentMovementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankMovement"
    ADD CONSTRAINT "BankMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES public."CurrentMovement"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BankMovement BankMovement_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankMovement"
    ADD CONSTRAINT "BankMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BankMovement BankMovement_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankMovement"
    ADD CONSTRAINT "BankMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Bank Bank_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bank"
    ADD CONSTRAINT "Bank_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BranchWarehouse BranchWarehouse_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BranchWarehouse"
    ADD CONSTRAINT "BranchWarehouse_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BranchWarehouse BranchWarehouse_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BranchWarehouse"
    ADD CONSTRAINT "BranchWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Branch Branch_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Brand Brand_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(username) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CurrentAddress CurrentAddress_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentAddress"
    ADD CONSTRAINT "CurrentAddress_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentBranch CurrentBranch_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentBranch"
    ADD CONSTRAINT "CurrentBranch_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentBranch CurrentBranch_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentBranch"
    ADD CONSTRAINT "CurrentBranch_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentCategoryItem CurrentCategoryItem_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentCategoryItem"
    ADD CONSTRAINT "CurrentCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."CurrentCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CurrentCategoryItem CurrentCategoryItem_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentCategoryItem"
    ADD CONSTRAINT "CurrentCategoryItem_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CurrentCategory CurrentCategory_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentCategory"
    ADD CONSTRAINT "CurrentCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public."CurrentCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CurrentFinancial CurrentFinancial_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentFinancial"
    ADD CONSTRAINT "CurrentFinancial_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentMovement CurrentMovement_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentMovement CurrentMovement_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentMovement CurrentMovement_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CurrentMovement CurrentMovement_documentNo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_documentNo_fkey" FOREIGN KEY ("documentNo") REFERENCES public."Invoice"("invoiceNo") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CurrentMovement CurrentMovement_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentMovement"
    ADD CONSTRAINT "CurrentMovement_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."StockCardPriceList"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CurrentOfficials CurrentOfficials_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentOfficials"
    ADD CONSTRAINT "CurrentOfficials_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CurrentRisk CurrentRisk_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CurrentRisk"
    ADD CONSTRAINT "CurrentRisk_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Current Current_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Current"
    ADD CONSTRAINT "Current_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."StockCardPriceList"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InvoiceDetail InvoiceDetail_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceDetail"
    ADD CONSTRAINT "InvoiceDetail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InvoiceDetail InvoiceDetail_productCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceDetail"
    ADD CONSTRAINT "InvoiceDetail_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES public."StockCard"("productCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_outBranchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_outBranchCode_fkey" FOREIGN KEY ("outBranchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."StockCardPriceList"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_warehouseCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES public."Warehouse"("warehouseCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MarketPlaceAttributes MarketPlaceAttributes_marketPlaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceAttributes"
    ADD CONSTRAINT "MarketPlaceAttributes_marketPlaceId_fkey" FOREIGN KEY ("marketPlaceId") REFERENCES public."MarketPlace"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MarketPlaceCategories MarketPlaceCategories_marketPlaceCategoryParentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceCategories"
    ADD CONSTRAINT "MarketPlaceCategories_marketPlaceCategoryParentId_fkey" FOREIGN KEY ("marketPlaceCategoryParentId") REFERENCES public."MarketPlaceCategories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlaceProductImages MarketPlaceProductImages_marketPlaceProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProductImages"
    ADD CONSTRAINT "MarketPlaceProductImages_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES public."MarketPlaceProducts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MarketPlaceProductMatch MarketPlaceProductMatch_marketPlaceProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProductMatch"
    ADD CONSTRAINT "MarketPlaceProductMatch_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES public."MarketPlaceProducts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlaceProductMatch MarketPlaceProductMatch_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProductMatch"
    ADD CONSTRAINT "MarketPlaceProductMatch_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlaceProducts MarketPlaceProducts_marketPlaceBrandsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProducts"
    ADD CONSTRAINT "MarketPlaceProducts_marketPlaceBrandsId_fkey" FOREIGN KEY ("marketPlaceBrandsId") REFERENCES public."MarketPlaceBrands"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlaceProducts MarketPlaceProducts_parentProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProducts"
    ADD CONSTRAINT "MarketPlaceProducts_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES public."MarketPlaceProducts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlaceProducts MarketPlaceProducts_storeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlaceProducts"
    ADD CONSTRAINT "MarketPlaceProducts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MarketPlace MarketPlace_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketPlace"
    ADD CONSTRAINT "MarketPlace_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_readBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_readBy_fkey" FOREIGN KEY ("readBy") REFERENCES public."User"(username) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderCargo OrderCargo_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderCargo"
    ADD CONSTRAINT "OrderCargo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_billingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES public."OrderInvoiceAddress"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_shippingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES public."OrderInvoiceAddress"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Permission Permission_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."PermissionGroup"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PosMovement PosMovement_currentMovementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PosMovement"
    ADD CONSTRAINT "PosMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES public."CurrentMovement"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PosMovement PosMovement_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PosMovement"
    ADD CONSTRAINT "PosMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PosMovement PosMovement_posId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PosMovement"
    ADD CONSTRAINT "PosMovement_posId_fkey" FOREIGN KEY ("posId") REFERENCES public."Pos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PosMovement PosMovement_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PosMovement"
    ADD CONSTRAINT "PosMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pos Pos_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pos"
    ADD CONSTRAINT "Pos_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiptDetail ReceiptDetail_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiptDetail"
    ADD CONSTRAINT "ReceiptDetail_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiptDetail ReceiptDetail_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiptDetail"
    ADD CONSTRAINT "ReceiptDetail_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Receipt Receipt_inWarehouse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_inWarehouse_fkey" FOREIGN KEY ("inWarehouse") REFERENCES public."Warehouse"("warehouseCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Receipt Receipt_outWarehouse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_outWarehouse_fkey" FOREIGN KEY ("outWarehouse") REFERENCES public."Warehouse"("warehouseCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockCardAttributeItems StockCardAttributeItems_attributeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardAttributeItems"
    ADD CONSTRAINT "StockCardAttributeItems_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES public."StockCardAttribute"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardAttributeItems StockCardAttributeItems_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardAttributeItems"
    ADD CONSTRAINT "StockCardAttributeItems_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardBarcode StockCardBarcode_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardBarcode"
    ADD CONSTRAINT "StockCardBarcode_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardCategoryItem StockCardCategoryItem_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardCategoryItem"
    ADD CONSTRAINT "StockCardCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."StockCardCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardCategoryItem StockCardCategoryItem_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardCategoryItem"
    ADD CONSTRAINT "StockCardCategoryItem_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardCategory StockCardCategory_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardCategory"
    ADD CONSTRAINT "StockCardCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public."StockCardCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockCardEFatura StockCardEFatura_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardEFatura"
    ADD CONSTRAINT "StockCardEFatura_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardManufacturer StockCardManufacturer_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardManufacturer"
    ADD CONSTRAINT "StockCardManufacturer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockCardManufacturer StockCardManufacturer_currentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardManufacturer"
    ADD CONSTRAINT "StockCardManufacturer_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES public."Current"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardManufacturer StockCardManufacturer_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardManufacturer"
    ADD CONSTRAINT "StockCardManufacturer_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardMarketNames StockCardMarketNames_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardMarketNames"
    ADD CONSTRAINT "StockCardMarketNames_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockCardPriceListItems StockCardPriceListItems_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardPriceListItems"
    ADD CONSTRAINT "StockCardPriceListItems_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."StockCardPriceList"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardPriceListItems StockCardPriceListItems_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardPriceListItems"
    ADD CONSTRAINT "StockCardPriceListItems_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardTaxRate StockCardTaxRate_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardTaxRate"
    ADD CONSTRAINT "StockCardTaxRate_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardVariation StockCardVariation_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardVariation"
    ADD CONSTRAINT "StockCardVariation_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardWarehouse StockCardWarehouse_stockCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardWarehouse"
    ADD CONSTRAINT "StockCardWarehouse_stockCardId_fkey" FOREIGN KEY ("stockCardId") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCardWarehouse StockCardWarehouse_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCardWarehouse"
    ADD CONSTRAINT "StockCardWarehouse_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockCard StockCard_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCard"
    ADD CONSTRAINT "StockCard_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockCard StockCard_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCard"
    ADD CONSTRAINT "StockCard_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockCard StockCard_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockCard"
    ADD CONSTRAINT "StockCard_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockMovement StockMovement_currentCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_currentCode_fkey" FOREIGN KEY ("currentCode") REFERENCES public."Current"("currentCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_documentNo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_documentNo_fkey" FOREIGN KEY ("documentNo") REFERENCES public."Invoice"("invoiceNo") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_outWarehouseCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_outWarehouseCode_fkey" FOREIGN KEY ("outWarehouseCode") REFERENCES public."Warehouse"("warehouseCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_priceListId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES public."StockCardPriceList"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_productCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_productCode_fkey" FOREIGN KEY ("productCode") REFERENCES public."StockCard"("productCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockMovement StockMovement_warehouseCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_warehouseCode_fkey" FOREIGN KEY ("warehouseCode") REFERENCES public."Warehouse"("warehouseCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StockTake StockTake_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockTake"
    ADD CONSTRAINT "StockTake_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Store Store_marketPlaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "Store_marketPlaceId_fkey" FOREIGN KEY ("marketPlaceId") REFERENCES public."MarketPlace"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VaultMovement VaultMovement_currentMovementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaultMovement"
    ADD CONSTRAINT "VaultMovement_currentMovementId_fkey" FOREIGN KEY ("currentMovementId") REFERENCES public."CurrentMovement"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VaultMovement VaultMovement_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaultMovement"
    ADD CONSTRAINT "VaultMovement_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VaultMovement VaultMovement_receiptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaultMovement"
    ADD CONSTRAINT "VaultMovement_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VaultMovement VaultMovement_vaultId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VaultMovement"
    ADD CONSTRAINT "VaultMovement_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES public."Vault"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vault Vault_branchCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vault"
    ADD CONSTRAINT "Vault_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES public."Branch"("branchCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Warehouse Warehouse_companyCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES public."Company"("companyCode") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _MarketPlaceAttributesToMarketPlaceProducts _MarketPlaceAttributesToMarketPlaceProducts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_MarketPlaceAttributesToMarketPlaceProducts"
    ADD CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_A_fkey" FOREIGN KEY ("A") REFERENCES public."MarketPlaceAttributes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _MarketPlaceAttributesToMarketPlaceProducts _MarketPlaceAttributesToMarketPlaceProducts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_MarketPlaceAttributesToMarketPlaceProducts"
    ADD CONSTRAINT "_MarketPlaceAttributesToMarketPlaceProducts_B_fkey" FOREIGN KEY ("B") REFERENCES public."MarketPlaceProducts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _OrderToStore _OrderToStore_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_OrderToStore"
    ADD CONSTRAINT "_OrderToStore_A_fkey" FOREIGN KEY ("A") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _OrderToStore _OrderToStore_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_OrderToStore"
    ADD CONSTRAINT "_OrderToStore_B_fkey" FOREIGN KEY ("B") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PermissionToRole _PermissionToRole_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToRole"
    ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PermissionToRole _PermissionToRole_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToRole"
    ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PermissionToUser _PermissionToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToUser"
    ADD CONSTRAINT "_PermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _PermissionToUser _PermissionToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_PermissionToUser"
    ADD CONSTRAINT "_PermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductsOnCategories _ProductsOnCategories_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductsOnCategories"
    ADD CONSTRAINT "_ProductsOnCategories_A_fkey" FOREIGN KEY ("A") REFERENCES public."MarketPlaceCategories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductsOnCategories _ProductsOnCategories_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductsOnCategories"
    ADD CONSTRAINT "_ProductsOnCategories_B_fkey" FOREIGN KEY ("B") REFERENCES public."MarketPlaceProducts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _RoleToUser _RoleToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RoleToUser"
    ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _RoleToUser _RoleToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RoleToUser"
    ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardBarcodeToStockCardVariation _StockCardBarcodeToStockCardVariation_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardBarcodeToStockCardVariation"
    ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES public."StockCardBarcode"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardBarcodeToStockCardVariation _StockCardBarcodeToStockCardVariation_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardBarcodeToStockCardVariation"
    ADD CONSTRAINT "_StockCardBarcodeToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES public."StockCardVariation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardPriceListItemsToStockCardVariation _StockCardPriceListItemsToStockCardVariation_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardPriceListItemsToStockCardVariation"
    ADD CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_A_fkey" FOREIGN KEY ("A") REFERENCES public."StockCardPriceListItems"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardPriceListItemsToStockCardVariation _StockCardPriceListItemsToStockCardVariation_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardPriceListItemsToStockCardVariation"
    ADD CONSTRAINT "_StockCardPriceListItemsToStockCardVariation_B_fkey" FOREIGN KEY ("B") REFERENCES public."StockCardVariation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardToStore _StockCardToStore_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardToStore"
    ADD CONSTRAINT "_StockCardToStore_A_fkey" FOREIGN KEY ("A") REFERENCES public."StockCard"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _StockCardToStore _StockCardToStore_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_StockCardToStore"
    ADD CONSTRAINT "_StockCardToStore_B_fkey" FOREIGN KEY ("B") REFERENCES public."Store"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

