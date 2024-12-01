import { Elysia } from 'elysia';
import { register, login } from '../../controllers/authController';

export const authRoutes = (app: Elysia) => {
  // Kullanıcı kayıt (Admin erişimi gerekli)
  app.post('/auth/register', register);

  // Kullanıcı giriş
  app.post('/auth/login', login);

  return app;
};

