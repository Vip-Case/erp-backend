import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const prisma = new PrismaClient();

export async function syncPermissionsWithRoutes(app: any) {
  try {
    logger.info("İzin senkronizasyonu başlatılıyor...");
    console.log("İzin senkronizasyonu başlatılıyor...");

    const routes = app.routes
      .filter(
        (route: any) =>
          !route.path.startsWith("/docs") && !route.path.startsWith("/health")
      )
      .map((route: any) => ({
        path: `${route.path}`,
        method: route.method,
      }));

    console.log(`Toplam ${routes.length} rota bulundu.`);
    logger.info(`Toplam ${routes.length} rota bulundu.`);

    let processedCount = 0;
    for (const route of routes) {
      try {
        const permissionName = `${route.method}:${route.path}`;

        await prisma.permission.upsert({
          where: { permissionName },
          update: {
            description: `${route.method} ${route.path} için izin`,
          },
          create: {
            permissionName,
            description: `${route.method} ${route.path} için izin`,
          },
        });

        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(
            `İzin işlemi: ${processedCount}/${routes.length} tamamlandı.`
          );
        }
      } catch (routeError) {
        logger.error(
          `Rota izni işlenirken hata: ${route.method}:${route.path}`,
          routeError
        );
        console.error(
          `Rota izni işlenirken hata: ${route.method}:${route.path}`,
          routeError
        );
        // Tek bir rota hatası tüm işlemi durdurmayacak
      }
    }

    console.log(`Toplam ${processedCount} izin güncellendi/oluşturuldu.`);

    // Admin rolü için tüm izinleri otomatik ekle
    try {
      console.log("Admin rolü için izinler alınıyor...");
      const allPermissions = await prisma.permission.findMany();
      console.log(`Toplam ${allPermissions.length} izin bulundu.`);

      console.log("Admin rolü güncelleniyor...");
      await prisma.role.upsert({
        where: { roleName: "admin" },
        update: {
          permissions: {
            set: allPermissions.map((p) => ({ id: p.id })),
          },
        },
        create: {
          roleName: "admin",
          description: "Tüm yetkilere sahip yönetici rolü",
          permissions: {
            connect: allPermissions.map((p) => ({ id: p.id })),
          },
        },
      });
      console.log("Admin rolü ve izinleri güncellendi");
    } catch (error) {
      logger.error("Admin rolü güncellenirken hata:", error);
      console.error("Admin rolü güncellenirken hata:", error);
      // Admin rolü hatası senkronizasyonu durdurmayacak
    }

    logger.info("İzin senkronizasyonu tamamlandı");
    console.log("İzin senkronizasyonu tamamlandı");
    return true;
  } catch (error) {
    logger.error("İzin senkronizasyonu sırasında hata:", error);
    console.error("İzin senkronizasyonu sırasında hata:", error);
    throw error;
  } finally {
    // Bağlantıyı kapatmaya çalış
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Prisma bağlantısı kapatılırken hata:", disconnectError);
    }
  }
}

export default syncPermissionsWithRoutes;
