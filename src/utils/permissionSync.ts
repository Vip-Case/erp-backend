import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function syncPermissionsWithRoutes(app: any) {
  try {
    const routes = app.routes
      .filter(
        (route: any) =>
          !route.path.startsWith("/docs") && !route.path.startsWith("/health")
      )
      .map((route: any) => ({
        path: `${route.path}`,
        method: route.method,
      }));

    console.log("Mevcut rotalar:", routes);

    for (const route of routes) {
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

      console.log(`İzin güncellendi/oluşturuldu: ${permissionName}`);
    }

    // Admin rolü için tüm izinleri otomatik ekle
    try {
      const allPermissions = await prisma.permission.findMany();
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
      console.error("Admin rolü güncellenirken hata:", error);
    }

    console.log("İzin senkronizasyonu tamamlandı");
  } catch (error) {
    console.error("İzin senkronizasyonu sırasında hata:", error);
    throw error;
  }
}

export default syncPermissionsWithRoutes;
