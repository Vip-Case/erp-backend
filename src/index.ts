import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { appConfig } from './config/app';
import { StockCardRoutes } from './api/routes/v1/stockCardRoutes'; // Rotayı dahil ediyoruz

// Uygulama instance'ı oluşturuluyor
const app = new Elysia()
  .use(swagger({
    path: "/docs", // Swagger UI'nin erişim yolu
    theme: "flattop", // Swagger UI teması
    autoDarkMode: true, // Otomatik karanlık mod
    documentation: {
      info: {
        title: "Elysia API", // API başlığı
        version: "1.0.0", // API versiyonu
        description: "Elysia API Documentation", // API açıklaması
      },
    },
  })) // Swagger middleware'i ekleniyor
  .get("/", () => "Elysia is running!"); // Ana route tanımlanıyor

// API rotalarını dahil ediyoruz
StockCardRoutes(app);

// Uygulama belirtilen portta dinlemeye başlıyor
app.listen(appConfig.port, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});