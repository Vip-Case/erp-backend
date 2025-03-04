import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { CustomError } from "./utils/CustomError";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import loggerWithCaller from "./utils/logger";
import CurrentMovementRoutes from "./api/routes/v1/currentMovementRoutes";
import CurrentCategoryRoutes from "./api/routes/v1/currentCategoryRoutes";
import StockMovementRoutes from "./api/routes/v1/stockMovementRoutes";
import VaultMovementRoutes from "./api/routes/v1/vaultMovementRoutes";
import ManufacturerRoutes from "./api/routes/v1/manufacturerRoutes";
import BankMovementRoutes from "./api/routes/v1/bankMovementRoutes";
import PosMovementRoutes from "./api/routes/v1/posMovementRoutes";
import PermissionRoutes from "./api/routes/v1/permissionRoute";
import syncPermissionsWithRoutes from "./utils/permissionSync";
import wooCommerceRoutes from "./api/routes/v1/wooCommerceRoutes";
import StockCardRoutes from "./api/routes/v1/stockCardRoutes";
import PriceListRoutes from "./api/routes/v1/priceListRoutes";
import AttributeRoutes from "./api/routes/v1/attributeRoutes";
import WarehouseRoutes from "./api/routes/v1/warehouseRoutes";
import importRoutes from "./api/routes/v1/importExcelRoutes";
import CategoryRoutes from "./api/routes/v1/categoryRoutes";
import CompanyRoutes from "./api/routes/v1/companyRoutes";
import CurrentRoutes from "./api/routes/v1/currentRoutes";
import InvoiceRoutes from "./api/routes/v1/invoiceRoutes";
import ReceiptRoutes from "./api/routes/v1/receiptRoutes";
import BranchRoutes from "./api/routes/v1/branchRoutes";
import exportRoutes from "./api/routes/v1/exportRoutes";
import { authRoutes } from "./api/routes/v1/authRoutes";
import OrderRoutes from "./api/routes/v1/orderRoutes";
import VaultRoutes from "./api/routes/v1/vaultRoutes";
import BrandRoutes from "./api/routes/v1/brandRoutes";
import BankRoutes from "./api/routes/v1/bankRoutes";
import UserRoutes from "./api/routes/v1/userRoutes";
import RoleRoutes from "./api/routes/v1/roleRoutes";
import PosRoutes from "./api/routes/v1/posRoutes";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import NotificationRoutes from "./api/routes/v1/notificationRoutes";
import { NotificationService } from "./services/concrete/NotificationService";
import logger from "./utils/logger";
import OrderInvoiceRoutes from "./api/routes/v1/orderInvoiceRoutes";
import MarketPlaceRoutes from "./api/routes/v1/marketPlaceRoutes";
import StoreRoutes from "./api/routes/v1/storeRoutes";
import PrintQueueRoutes from "./api/routes/v1/printQueueRoutes";
import { AuthenticationError, AuthorizationError } from "./utils/CustomError";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET ortam değişkeni tanımlanmamış.");
}

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

// Uygulama instance'ı oluşturuluyor
const app = new Elysia();

// Health endpoint'i ayrı bir instance olarak tanımlayıp, ana uygulamaya bağlıyoruz
const healthCheck = new Elysia().get("/health", () => ({ status: "ok" }));

app.use(healthCheck);

app.use(
  cors({
    origin: [`${process.env.CORS_URL}`],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    preflight: true,
    maxAge: 86400,
  })
);

app.onRequest(async (ctx) => {
  if (ctx.request.method === "OPTIONS") {
    ctx.set.status = 204;
    return;
  }

  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/docs",
  ];
  const route = new URL(ctx.request.url).pathname;
  const method = ctx.request.method;

  // Health endpoint kontrolü
  if (route === "/health") {
    return;
  }

  // Public route kontrolü
  if (publicRoutes.some((r) => route.startsWith(r))) {
    return;
  }

  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    throw new AuthenticationError("Yetkilendirme başlığı eksik");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AuthenticationError("Token bulunamadı");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const requiredPermission = `${method}:${route}`;

    // Admin kontrolü
    if (decoded.isAdmin) {
      return;
    }

    // İzin kontrolü
    if (!decoded.permissions.includes(requiredPermission)) {
      throw new AuthorizationError("Bu işlem için yetkiniz bulunmuyor", {
        route,
        method,
        requiredPermission,
        userPermissions: decoded.permissions,
      });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("Token süresi dolmuş", {
        error: "TOKEN_EXPIRED",
        message: "Lütfen oturumunuzu yenileyin",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("Geçersiz token");
    }
    throw error;
  }
});

// Stok seviyesi kontrolü için cron job
const notificationService = new NotificationService();
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Stok seviyesi kontrolü başlatılıyor...");
    logger.info("Stok seviyesi kontrolü başlatılıyor...");

    // Stok seviyelerini kontrol et
    await notificationService.checkStockLevels();
    console.log("Stok seviyesi kontrolü tamamlandı");
    logger.info("Stok seviyesi kontrolü tamamlandı");
  } catch (error) {
    console.error("Stok seviyesi kontrolü sırasında hata:", error);
    logger.error("Stok seviyesi kontrolü sırasında hata:", error);
  }
});
console.log("Bildirimler kontrol ediliyor...");
app
  .get("/secure/data", () => {
    return { message: "Secure data accessed." };
  })
  .use(
    swagger({
      path: "/docs", // Swagger UI'nin erişim yolu
      provider: "scalar", // API provider'ı
      documentation: {
        info: {
          title: "ERP API", // API başlığı
          version: "1.0.0", // API versiyonu
          description: "ERP API Documentation", // API açıklaması
        },
      },
    })
  );

app.get("/", () => "Elysia is running!"); // Ana route tanımlanıyor

app.onError(async ({ error, set, request }) => {
  let statusCode = 500;
  let message = "Beklenmeyen bir hata oluştu.";
  let errorCode: string | undefined;
  let meta: any;

  const errorMessage = error instanceof Error ? error.message : String(error);

  // JWT hataları için özel kontrol
  if (error instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Geçersiz veya süresi dolmuş token.";
    errorCode = "INVALID_TOKEN";
  } else if (error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token süresi dolmuş. Lütfen yeniden giriş yapın.";
    errorCode = "TOKEN_EXPIRED";
  } else if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = errorMessage;
    errorCode = error.errorCode;
    meta = error.meta;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Veritabanı işlemi sırasında bir hata oluştu.";
    errorCode = error.code;
    meta = error.meta;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Veri doğrulama hatası oluştu.";
    meta = errorMessage;
  } else if (errorMessage.includes("Permission denied")) {
    statusCode = 403;
    message = "Bu işlem için yetkiniz bulunmuyor.";
    errorCode = "PERMISSION_DENIED";
  } else if (errorMessage.includes("Unauthorized")) {
    statusCode = 401;
    message = "Oturum açmanız gerekiyor.";
    errorCode = "UNAUTHORIZED";
  }

  const body = await request.json().catch(() => null);

  loggerWithCaller.error(
    {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: body,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
      meta: meta,
      prisma:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? {
              clientVersion: error.clientVersion,
              errorCode: error.code,
              meta: error.meta,
            }
          : undefined,
    },
    "Hata oluştu"
  );

  set.status = statusCode;
  return {
    error: {
      message,
      errorCode,
      meta,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };
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
  CurrentCategoryRoutes,
  ManufacturerRoutes,
  BankRoutes,
  BankMovementRoutes,
  PosRoutes,
  PosMovementRoutes,
  MarketPlaceRoutes,
  StoreRoutes,
  PrintQueueRoutes,
];

app.use(NotificationRoutes(app));
wooCommerceRoutes(app);
OrderInvoiceRoutes(app);

routes.forEach((route) => app.use(route));

// Uygulama başlatıldığında izinleri senkronize et
app.listen(process.env.PORT || 3000, async () => {
  try {
    await syncPermissionsWithRoutes(app);
    console.log(
      `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
    );
  } catch (error) {
    console.error("İzin senkronizasyonu sırasında hata:", error);
  }
});
