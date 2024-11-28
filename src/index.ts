import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { CustomError } from './utils/CustomError';
import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import loggerWithCaller from './utils/logger';

import CurrentMovementRoutes from './api/routes/v1/currentMovementRoutes';
import CurrentCategoryRoutes from './api/routes/v1/currentCategoryRoutes';
import StockMovementRoutes from './api/routes/v1/stockMovementRoutes';
import VaultMovementRoutes from './api/routes/v1/vaultMovementRoutes';
import ManufacturerRoutes from './api/routes/v1/manufacturerRoutes';
import BankMovementRoutes from './api/routes/v1/bankMovementRoutes';
import PosMovementRoutes from './api/routes/v1/posMovementRoutes';
import StockCardRoutes from './api/routes/v1/stockCardRoutes';
import PriceListRoutes from './api/routes/v1/priceListRoutes';
import AttributeRoutes from './api/routes/v1/attributeRoutes';
import WarehouseRoutes from './api/routes/v1/warehouseRoutes';
import importRoutes from './api/routes/v1/importExcelRoutes';
import CategoryRoutes from './api/routes/v1/categoryRoutes';
import CompanyRoutes from './api/routes/v1/companyRoutes';
import CurrentRoutes from './api/routes/v1/currentRoutes';
import InvoiceRoutes from './api/routes/v1/invoiceRoutes';
import ReceiptRoutes from './api/routes/v1/receiptRoutes';
import BranchRoutes from './api/routes/v1/branchRoutes';
import exportRoutes from './api/routes/v1/exportRoutes';
import VaultRoutes from './api/routes/v1/vaultRoutes';
import BrandRoutes from './api/routes/v1/brandRoutes';
import BankRoutes from './api/routes/v1/bankRoutes';
import UserRoutes from './api/routes/v1/userRoutes';
import RoleRoutes from './api/routes/v1/roleRoutes';
import PosRoutes from './api/routes/v1/posRoutes';
import OrderRoutes from './api/routes/v1/orderRoutes';
import authRoutes from './api/routes/v1/authRoutes';
dotenv.config();
// Uygulama instance'ı oluşturuluyor
const app = new Elysia()
  .use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600
  }))
  .use(swagger({
    path: "/docs", // Swagger UI'nin erişim yolu
    provider: 'scalar', // API provider'ı
    documentation: {
      info: {
        title: "ERP API", // API başlığı
        version: "1.0.0", // API versiyonu
        description: "ERP API Documentation", // API açıklaması
      },
      tags: [
        { name: "Stock Cards", description: "Stock Card operations" }, // Stock Card'lar için tag
        { name: "Price Lists", description: "Price List operations" }, // Price List'ler için tag
        { name: "Attributes", description: "Attribute operations" }, // Attribute'lar için tag
        { name: "Stock Movements", description: "Stock Movement operations" }, // Stock Movement'lar için tag
        { name: "Companies", description: "Company operations" }, // Company'ler için tag
        { name: "Branches", description: "Branch operations" }, // Branch'ler için tag
        { name: "Warehouses", description: "Warehouse operations" }, // Warehouse'lar için tag
        { name: "Categories", description: "Category operations" }, // Category'ler için tag
        { name: "Currents", description: "Current operations" }, // Current'lar için tag
        { name: "Current Movements", description: "Current Movement operations" }, // Current Movement'lar için tag
        { name: "Current Groups", description: "Current Group operations" }, // Current Group'lar için tag
        { name: "Users", description: "User operations" }, // User'lar için tag
        { name: "Roles", description: "Role operations" }, // Role'lar için tag
        { name: "Invoices", description: "Invoice operations" }, // Invoice'lar için
        { name: "Receipts", description: "Receipt operations" }, // Receipt'lar için
        { name: "Brands", description: "Brand operations" }, // Brand'ler için
        { name: "Vaults", description: "Vaults operations" }, // Banks'lar için
        { name: "Imports", description: "Import operations" }, // Import'lar için
        { name: "Exports", description: "Export operations" }, // Export'lar için
      ]
    },
  }))
  .get("/", () => "Elysia is running!") // Ana route tanımlanıyor
  .onError(async ({ error, set, request }) => {
    // Varsayılan hata yanıtı
    let statusCode = 500;
    let message = 'Beklenmeyen bir hata oluştu.';
    let errorCode: string | undefined;
    let meta: any;

    // Bilinen hata türlerini işleyin
    if (error instanceof CustomError) {
      statusCode = error.statusCode;
      message = error.message;
      errorCode = error.errorCode;
      meta = error.meta;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = 400; // Bad Request
      message = 'Veritabanı hatası oluştu.';
      errorCode = error.code;
      meta = error.meta;
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      statusCode = 400;
      message = 'Doğrulama hatası oluştu.';
      meta = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    // İstekten gelen body'yi alın
    const body = await request.json().catch(() => null);

    // Hataları loglayın
    loggerWithCaller.error(
      {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: body,
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
        meta: (error as any).meta,
        prisma: error instanceof Prisma.PrismaClientKnownRequestError ? {
          clientVersion: error.clientVersion,
          errorCode: error.code,
          meta: error.meta,
        } : undefined,
      },
      'Hata oluştu'
    );
    // Yanıtı ayarlayın ve gönderin
    set.status = statusCode;

    return {
      error: {
        message,
        errorCode,
        meta,
      },
    };
  });


// API rotalarını dahil ediyoruz
StockCardRoutes(app);
PriceListRoutes(app);
AttributeRoutes(app);
StockMovementRoutes(app);
CompanyRoutes(app);
BranchRoutes(app);
WarehouseRoutes(app);
CategoryRoutes(app);
CurrentRoutes(app);
CurrentMovementRoutes(app);
UserRoutes(app);
RoleRoutes(app);
InvoiceRoutes(app);
ReceiptRoutes(app);
VaultRoutes(app);
VaultMovementRoutes(app);
VaultMovementRoutes(app);
BrandRoutes(app);
importRoutes(app);
exportRoutes(app);
OrderRoutes(app);
authRoutes(app);
ManufacturerRoutes(app);
CurrentCategoryRoutes(app);
BankRoutes(app);
BankMovementRoutes(app);
PosRoutes(app);
PosMovementRoutes(app);

export default app;