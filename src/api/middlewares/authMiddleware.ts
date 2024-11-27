import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

export const authMiddleware = async (ctx: any, requiredPermissions: string[],
  allowRoles: string[] = [] ) => {
  const authHeader = ctx.request.headers.get('authorization');
  if (!authHeader) {
    return { status: 401, message: 'Yetkilendirme başlığı eksik.' };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    console.log('Decoded Token:', decoded);

    ctx.request.user = decoded;

    // Rol bazlı kontrol (opsiyonel)
    if (allowRoles.length > 0 && !allowRoles.some((role) => decoded.roles.includes(role))) {
      console.log('Role check failed');
      return { status: 403, message: 'Bu rota için gerekli role sahip değilsiniz.' };
    }

    const userPermissions = decoded.permissions || [];
    console.log('User Permissions:', userPermissions);

    const hasRequiredPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermission) {
      return { status: 403, message: 'Erişim reddedildi: Yetersiz izin.' };
    }

    if (!decoded.roles.includes('admin') && requiredPermissions.some((p) => p.includes('admin'))) {
      return { status: 403, message: 'Erişim reddedildi: Admin izinlerine sahip değilsiniz.' };
    }

    return {
      status: 200,
      message: `Hoş geldiniz, ${ctx.request.user.username}!`,
    };
  } catch (error: any) {
    console.error('Token doğrulama hatası:', error.message);
    return { status: 403, message: 'Geçersiz veya süresi dolmuş token.' };
  }
};
