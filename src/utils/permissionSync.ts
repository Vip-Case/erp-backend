import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function syncPermissionsWithRoutes(app: any) {
  const routePaths = app.routes.map((route: any) => route.path);

  for (const route of routePaths) {
    try {
      await prisma.permission.upsert({
        where: { route },
        update: {},
        create: {
          route,
          permissionName: route.replace(/\//g, "_"),
          description: `Permission for ${route}`,
        },
      });
    } catch (error) {
      console.error(`Hata: '${route}' için izin eklenirken bir sorun oluştu:`, error);
    }
  }
}

export default syncPermissionsWithRoutes;
