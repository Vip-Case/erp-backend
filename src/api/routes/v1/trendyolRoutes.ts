// routes/trendyolRoutes.ts
import { Elysia } from "elysia";
import { TrendyolController } from "../../controllers/trendyolController";

const TrendyolRoutes = (app: Elysia) => {
  // Bağlantı testi endpoint'i
  app.post("/api/test-connection", async (ctx) => {
    return await TrendyolController.testConnection(ctx);
  });

  app.post("/api/sync/all", async (ctx) => {
    return await TrendyolController.syncAll(ctx);
  });

  app.post("/api/sync/brands", async (ctx) => {
    return await TrendyolController.syncBrands(ctx);
  });

  app.post("/api/sync/categories", async (ctx) => {
    return await TrendyolController.syncCategories(ctx);
  });

  app.post("/api/sync/products", async (ctx) => {
    return await TrendyolController.syncProducts(ctx);
  });

  // Eşleştirme route'ları
  app.post("/api/match-stockcard", async (ctx) => {
    return await TrendyolController.matchAndCreateStockCard(ctx);
  });

  app.post("/api/sync-and-match-all", async (ctx) => {
    return await TrendyolController.syncAndMatchAll(ctx);
  });

  app.post("/api/add-to-warehouse", async (ctx) => {
    return await TrendyolController.addToStockCardWarehouse(ctx);
  });
  
  app.post("/api/add-all-to-warehouse", async (ctx) => {
    return await TrendyolController.addAllToStockCardWarehouse(ctx);
  });

  app.post("/api/update-stock", async (ctx) => {
    return await TrendyolController.updateStockInTrendyol(ctx);
  });

  // Durum kontrolü route'u
  app.get("/api/match-status", async (ctx) => {
    return await TrendyolController.checkMatchStatus(ctx);
  });

  // Webhook routes
  app.post("/api/webhooks/create", async (ctx) => {
    return await TrendyolController.createWebhook(ctx);
  });
  
  app.get("/api/webhooks/list", async (ctx) => {
    return await TrendyolController.listWebhooks(ctx);
  });

  // Webhook silme endpoint'i
  app.delete("/api/webhooks/:webhookId/delete", async (ctx) => {
    return await TrendyolController.deleteWebhook(ctx);
  });

  // Webhook handler endpoint'i
  app.post("/api/webhook-handler", async (ctx) => {
    // Gelen isteği logla
    console.log('Webhook request received');
    console.log('Headers:', JSON.stringify(ctx.headers, null, 2));
    console.log('Body:', JSON.stringify(ctx.body, null, 2));
    
    // Basic Auth kontrolü
    const authHeader = ctx.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      
      console.log(`Webhook auth: ${username}:${password.substring(0, 2)}***`);
    }
    
    return await TrendyolController.handleWebhookEvent(ctx);
  });

  // Webhook aktivasyon/deaktivasyon endpoint'leri
  app.put("/api/webhooks/:id/activate", async (ctx) => {
    return await TrendyolController.activateWebhook(ctx);
  });
  
  app.put("/api/webhooks/:id/deactivate", async (ctx) => {
    return await TrendyolController.deactivateWebhook(ctx);
  });

  // Webhook güncelleme endpoint'i
  app.put("/api/webhooks/:id/update", async (ctx) => {
    return await TrendyolController.updateWebhook(ctx);
  });
  
  app.post("/api/sync/orders", async (ctx) => {
    return await TrendyolController.syncOrders(ctx);
  });

  // Yeni eklenen sipariş güncelleme route'ları
  app.put("/api/orders/:orderNumber", async (ctx) => {
    return await TrendyolController.updateOrder(ctx);
  });

  app.post("/api/orders/update-recent", async (ctx) => {
    return await TrendyolController.updateRecentOrders(ctx);
  });

  return app;
};

export default TrendyolRoutes;