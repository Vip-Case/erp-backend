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
import { PrismaClient } from '@prisma/client';
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
import exportRoutes from './api/routes/v1/exportRoutes';
import VaultMovementRoutes from './api/routes/v1/vaultMovementRoutes';
import OrderRoutes from './api/routes/v1/orderRoutes';
import { authRoutes } from './api/routes/v1/authRoutes';
import PermissionRoutes from './api/routes/v1/permissionRoute';
import { syncPermissionsWithRoutes } from './utils/permissionSync';
import jwt from 'jsonwebtoken';
import { wooCommerceRoutes } from './api/routes/v1/productRoutes';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET ortam değişkeni tanımlanmamış.");
}

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

// Uygulama instance'ı oluşturuluyor
const app = new Elysia()

// Global middleware: Kullanıcı doğrulama

app.onRequest(async (ctx) => {
  const publicRoutes = ["/auth/login", "/auth/register"];
  const route = new URL(ctx.request.url).pathname;

  // Public route kontrolü
  if (publicRoutes.includes(route)) {
    console.log("Public route, skipping auth.");
    return;
  }

  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Unauthorized: Authorization header is missing.");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;

    // Kullanıcı bilgilerini ctx.request'e bağlama
    (ctx.request as any).user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin || false,
      permissions: decoded.permissions || [],
    };

    console.log("Kullanıcı doğrulandı:", (ctx.request as any).user);
  } catch (error) {
    throw new Error("Unauthorized: Invalid or expired token.");
  }
});

app.onRequest(async (ctx) => {
  const route = new URL(ctx.request.url).pathname; // Geçerli rota
  const publicRoutes = ["/auth/login", "/auth/register"]; // Public rotalar

  // Public rotalarda izin kontrolü yapılmaz
  if (publicRoutes.includes(route)) {
    console.log("Public route, skipping permission check.");
    return;
  }

  const user = (ctx.request as any).user; // Kullanıcı bilgisi
  if (!user) {
    console.error("User not authenticated.");
    throw new Error("Unauthorized: User not authenticated.");
  }

  // Admin kullanıcı kontrolü
  if (user.isAdmin) {
    console.log("Admin kullanıcı, tüm izinlere sahip.");
    return; // Admin kullanıcılar tüm rotalara erişebilir
  }

  // Rota için gerekli izinleri al
  const requiredPermissions = await prisma.permission.findMany({
    where: { route }, // Route'a göre gerekli izinleri kontrol et
    select: { permissionName: true },
  });

  if (!requiredPermissions.length) {
    console.error(`Hata: '${route}' rotası için izinler bulunamadı.`);
    throw new Error(`Permission configuration is missing for the route '${route}'.`);
  }

  // Kullanıcının iznini kontrol et
  const hasPermission = requiredPermissions.every((p) =>
    user.permissions.includes(p.permissionName)
  );

  console.log("Has Permission:", hasPermission);
  if (!hasPermission) {
    console.error("Kullanıcı gerekli izne sahip değil.");
    throw new Error("Permission denied.");
  }

  console.log("Kullanıcı gerekli izne sahip.");
});


app.get("/secure/data", () => {
  return { message: "Secure data accessed." };
});


app.use(cors({
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
        { name: "Permissions", description: "Permission operations" },
        { name: "Products", description: "Product operations" },
      ]
    },
  }))

app.get("/", () => "Elysia is running!"); // Ana route tanımlanıyor

app.onError(({ error }: { error: Error }) => {
  console.error("Hata:", error.message);
  return { message: error.message || "Beklenmeyen bir hata oluştu." };
});

const routes = [
  StockCardRoutes,
  PriceListRoutes,
  AttributeRoutes,
  StockMovementRoutes,
  CompanyRoutes,
  WarehouseRoutes,
  BranchRoutes,
  CurrentRoutes,
  CurrentMovementRoutes,
  UserRoutes,
  RoleRoutes,
  InvoiceRoutes,
  CategoryRoutes,
  ReceiptRoutes,
  VaultRoutes,
  VaultMovementRoutes,
  BrandRoutes,
  importRoutes,
  exportRoutes,
  OrderRoutes,
  authRoutes,
  PermissionRoutes,
];

wooCommerceRoutes(app);

routes.forEach((route) => app.use(route));

// Dinamik izin ekleme
syncPermissionsWithRoutes(app)
  .then(() => {
    console.log("Permission senkronizasyonu tamamlandı.");
  })
  .catch((err) => {
    console.error("Permission senkronizasyon hatası:", err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// Uygulama belirtilen portta dinlemeye başlıyor
app.listen(appConfig.port, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});

export default app;