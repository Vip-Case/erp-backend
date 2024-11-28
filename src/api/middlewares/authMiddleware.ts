import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

export const authMiddleware = async (ctx: any) => {
  const authHeader = ctx.request.headers.get('authorization');
  if (!authHeader) {
    return { status: 401, message: 'Yetkilendirme başlığı eksik.' };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    ctx.request.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
      permissions: decoded.permissions,
    };


    const currentRoute = ctx.path; // Şu anki rota
    const permission = await prisma.permission.findUnique({
      where: { route: currentRoute },
    });

    if (!permission) {
      return { status: 403, message: 'Bu rota için izin tanımlanmamış.' };
    }

    const hasPermission = decoded.permissions.includes(permission.permissionName);

    if (!hasPermission) {
      return { status: 403, message: 'Erişim izniniz yok.' };
    }

    return { status: 200, message: 'Erişim başarılı.' };
  } catch (error: any) {
    console.error('Token doğrulama hatası:', error.message);
    return { status: 403, message: 'Geçersiz veya süresi dolmuş token.' };
  }
};
