import { Elysia } from 'elysia';
import { register, login } from '../../controllers/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const authRoutes = (app: Elysia) => {
  app.post('/auth/register', async (ctx: any) => {
    await authMiddleware(ctx, ['create']); // Middleware'i çağırıyoruz
    return register(ctx); // Kontrolcüye yönlendiriyoruz
  });

  app.post('/auth/login', login);

  // Admin için özel rota, sadece "admin" rolü gerektirir
  app.get('/auth/admin-protected', async (ctx: any) => {
    const middlewareResult = await authMiddleware(ctx, ['read', 'create'], ['admin']); // Sadece "admin" rolü izinli
    if (middlewareResult.status !== 200) {
      return middlewareResult; // Middleware kontrolü başarısızsa, sonucu dön
    }

    return { status: 200, message: `Hoş geldiniz, ${ctx.request.user.username} (Admin)` };
  });

  // User için özel rota, sadece "user" rolü gerektirir
  app.get('/auth/protected', async (ctx: any) => {
    const middlewareResult = await authMiddleware(ctx, ['read'], ['user']); // Sadece "user" rolü izinli
    if (middlewareResult.status !== 200) {
      return middlewareResult; // Middleware kontrolü başarısızsa, sonucu dön
    }
  
    return { status: 200, message: `Hoş geldiniz, ${ctx.request.user.username} (User)` };
  });
  
};
