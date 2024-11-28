import { Context } from 'elysia';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CustomUser {
  id: string;
  username: string;
  permissions: string[];
}

interface CustomStore {
  user?: CustomUser;
}

const dynamicMiddleware = async ({ request, set, store }: Context & { store: CustomStore }) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      set.status = 401;
      return { error: 'Yetkilendirme başlığı eksik.' };
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY') as CustomUser;
  
      store.user = decoded;
  
      const url = new URL(request.url, `http://${request.headers.get('host')}`);
      const currentRoute = url.pathname;
  
      const permission = await prisma.permission.findUnique({
        where: { route: currentRoute },
      });
  
      if (!permission) {
        set.status = 403;
        return { error: 'Bu rota için izin tanımlanmamış.' };
      }
  
      if (!decoded.permissions.includes(permission.permissionName || '')) {
        set.status = 403;
        return { error: 'Erişim izniniz yok.' };
      }
    } catch (error: any) {
      console.error('JWT doğrulama hatası:', error.message);
      set.status = 403;
      return { error: 'Geçersiz veya süresi dolmuş token.' };
    }
  
    return true;
  };
  

export default dynamicMiddleware;
