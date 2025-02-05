// routes/trendyolRoutes.ts
import { Elysia } from "elysia";
import { TrendyolController } from "../../controllers/trendyolController";

const TrendyolRoutes = (app: Elysia) => {
  // Bağlantı testi endpoint'i
  app.post("/api/trendyol/test-connection", async (ctx) => {
    return await TrendyolController.testConnection(ctx);
  });

  app.post("/api/trendyol/sync/all", async (ctx) => {
    return await TrendyolController.syncAll(ctx);
  });

  app.post("/api/trendyol/sync/brands", async (ctx) => {
    return await TrendyolController.syncBrands(ctx);
  });

  app.post("/api/trendyol/sync/categories", async (ctx) => {
    return await TrendyolController.syncCategories(ctx);
  });

  app.post("/api/trendyol/sync/products", async (ctx) => {
    return await TrendyolController.syncProducts(ctx);
  });

  // Eşleştirme route'ları
  app.post("/api/trendyol/match-stockcard", async (ctx) => {
    return await TrendyolController.matchAndCreateStockCard(ctx);
  });

  app.post("/api/trendyol/sync-and-match-all", async (ctx) => {
    return await TrendyolController.syncAndMatchAll(ctx);
  });

  app.post("/api/trendyol/add-to-warehouse", async (ctx) => {
    return await TrendyolController.addToStockCardWarehouse(ctx);
  });
  
  app.post("/api/trendyol/add-all-to-warehouse", async (ctx) => {
    return await TrendyolController.addAllToStockCardWarehouse(ctx);
  });

  app.post("/api/trendyol/update-stock", async (ctx) => {
    return await TrendyolController.updateStockInTrendyol(ctx);
  });

  app.post("/api/trendyol/update-all-stock", async (ctx) => {
    return await TrendyolController.updateAllStockInTrendyol(ctx);
  });

  // Durum kontrolü route'u
  app.get("/api/trendyol/match-status", async (ctx) => {
    return await TrendyolController.checkMatchStatus(ctx);
  });
  
  return app;
};

export default TrendyolRoutes;