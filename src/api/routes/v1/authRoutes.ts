import { Elysia } from 'elysia';
import { register, login, me } from '../../controllers/authController';

export const authRoutes = (app: Elysia) => {
  // Kullanıcı kayıt (Admin erişimi gerekli)
  app.post('/auth/register', register);

  // Kullanıcı giriş
  app.post('/auth/login', login);

  app.get('/auth/me', me);

  return app;
};

