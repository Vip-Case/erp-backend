import { Elysia } from 'elysia';
import { register, login } from '../../controllers/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const authRoutes = (app: Elysia) => {
  // Kullanıcı kayıt (Admin erişimi gerekli)
  app.post('/auth/register', async (ctx: any) => {
    await authMiddleware(ctx);
    return register(ctx);
  });

  // Kullanıcı giriş
  app.post('/auth/login', login);

  return app;
};