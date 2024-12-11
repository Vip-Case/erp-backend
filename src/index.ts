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
import PermissionRoutes from './api/routes/v1/permissionRoute';
import syncPermissionsWithRoutes from './utils/permissionSync';
import wooCommerceRoutes from './api/routes/v1/productRoutes';
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
import { authRoutes } from './api/routes/v1/authRoutes';
import OrderRoutes from './api/routes/v1/orderRoutes';
import VaultRoutes from './api/routes/v1/vaultRoutes';
import BrandRoutes from './api/routes/v1/brandRoutes';
import BankRoutes from './api/routes/v1/bankRoutes';
import UserRoutes from './api/routes/v1/userRoutes';
import RoleRoutes from './api/routes/v1/roleRoutes';
import PosRoutes from './api/routes/v1/posRoutes';
import { PrismaClient } from '@prisma/client';
import { appConfig } from './config/app';
import jwt from 'jsonwebtoken';
import cron from "node-cron";
import { backupDatabase, cleanOldBackups } from "./utils/backup";
import NotificationRoutes from './api/routes/v1/notificationRoutes';
import { NotificationService } from './services/concrete/NotificationService';
import logger from './utils/logger';
import InvoiceService from './services/concrete/invoiceService';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET ortam değişkeni tanımlanmamış.");
}

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

// Uygulama instance'ı oluşturuluyor
const app = new Elysia()

app.use(
  cors({
    origin: [`${process.env.CORS_URL}`], // İzin verilen frontend kökeni
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // İzin verilen HTTP yöntemleri
    allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen başlıklar
    credentials: true, // Çerez ve yetkilendirme bilgilerini paylaş
    preflight: true, // Preflight isteğini otomatik yanıtlZa
    maxAge: 86400, // Preflight yanıtının önbellek süresi
  })
);

app.onRequest(async (ctx) => {
  if (ctx.request.method === "OPTIONS") {
    ctx.set.status = 204; // Preflight istekleri için 204 No Content döndür
    return; // İleri işlem yapmadan middleware'den çık
  }
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
  if (ctx.request.method === "OPTIONS") {
    ctx.set.status = 204; // Preflight istekleri için 204 No Content döndür
    return; // İleri işlem yapmadan middleware'den çık
  }
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

// Stok seviyesi kontrolü için cron job
const notificationService = new NotificationService();
cron.schedule('*/30 * * * *', async () => {
  try {
    logger.info('Stok seviyesi kontrolü başlatılıyor...');
    await notificationService.checkStockLevels(
      process.env.SYSTEM_TOKEN || '', // Sistem tarafından yapılan kontroller için token
      process.env.CRITICAL_STOCK_LEVEL ? Number(process.env.CRITICAL_STOCK_LEVEL) : undefined,
      process.env.WARNING_STOCK_LEVEL ? Number(process.env.WARNING_STOCK_LEVEL) : undefined
    );
    logger.info('Stok seviyesi kontrolü tamamlandı');
  } catch (error) {
    logger.error('Stok seviyesi kontrolü sırasında hata:', error);
  }
});
console.log("Bildirimler kontrol ediliyor...");

app.get("/secure/data", () => {
  return { message: "Secure data accessed." };
})
  .use(swagger({
    path: "/docs", // Swagger UI'nin erişim yolu
    provider: 'scalar', // API provider'ı
    documentation: {
      info: {
        title: "ERP API", // API başlığı
        version: "1.0.0", // API versiyonu
        description: "ERP API Documentation", // API açıklaması
      },
    },
  }))

app.get("/", () => "Elysia is running!"); // Ana route tanımlanıyor

app.onError(async ({ error, set, request }) => {
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
  NotificationRoutes,
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

// Her gece saat 02:00'da yedekleme ve eski dosyaları temizleme işlemi
//cron.schedule("*/30 * * * *", () => {
//console.log("Günlük yedekleme başlıyor...");
//  backupDatabase().then(cleanOldBackups);
//});

//console.log("Yedekleme zamanlayıcı çalışıyor...");

export default app;