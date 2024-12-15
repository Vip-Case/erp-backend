import { Elysia } from 'elysia';
import { register, login } from '../../controllers/authController';

export const authRoutes = (app: Elysia) => {
  // Kullanıcı kayıt (Admin erişimi gerekli)
  app.post('/auth/register', register);

  // Kullanıcı giriş
  app.post('/auth/login', login);

  app.get('/auth/me', async (ctx: any) => {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      return {
        status: 403,
        body: { message: "Auth header is missing" },
      };
    }

    const token = authHeader.split(" ")[1];
  });

  return app;
};

