import { Elysia } from 'elysia';
import { authMiddleware } from '../../middlewares/authMiddleware';
import prisma from '../../../config/prisma';
import logger from '../../../utils/logger';

export const loadDynamicRoutes = async (app: Elysia) => {
    // Veritabanından dinamik rotaları çek
    const permissions = await prisma.permission.findMany();
  
    permissions.forEach((permission) => {
      // Eğer route null ise atla
      if (!permission.route) {
        logger.warn(`Geçersiz rota: ${permission.permissionName} için route null.`);
        return;
      }
  
      // Rota oluştur
      app.get(permission.route, async (ctx) => {
        try {
          // Middleware ile erişim kontrolü
          const middlewareResult = await authMiddleware(ctx);
  
          if (middlewareResult.status !== 200) {
            return middlewareResult;
          }
  
          return { status: 200, message: `Bu rota: ${permission.route}` };
        } catch (error) {
          logger.error(`Rota yüklenirken hata oluştu: ${permission.route}`, error);
          return { status: 500, message: 'Rota yüklenirken bir hata oluştu.' };
        }
      });
    });
  
    return app;
  };
  