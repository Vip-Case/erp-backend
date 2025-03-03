import { Elysia } from "elysia";
import { HepsiburadaController } from "../../controllers/hepsiburadaController";

const HepsiburadaRoutes = (app: Elysia) => {
  // Bağlantı testi endpoint'i
  app.post("/api/hepsiburada/test-connection", async (ctx) => {
    return await HepsiburadaController.testConnection(ctx);
  });

  // Kategorileri getirme endpoint'i
  app.get("/api/hepsiburada/categories", async (ctx) => {
    return await HepsiburadaController.getCategories(ctx);
  });

  // Kategori özelliklerini getirme endpoint'i
  app.get("/api/hepsiburada/categories/attributes", async (ctx) => {
    return await HepsiburadaController.getCategoryAttributes(ctx);
  });

  // Özellik değerlerini getirme endpoint'i
  app.get("/api/hepsiburada/categories/attributes/values", async (ctx) => {
    return await HepsiburadaController.getAttributeValues(ctx);
  });

  // Kategorileri senkronize etme endpoint'i
  app.post("/api/hepsiburada/categories/sync", async (ctx) => {
    return await HepsiburadaController.syncCategories(ctx);
  });

  // Kategori özelliklerini senkronize etme endpoint'i
  app.post("/api/hepsiburada/categories/attributes/sync", async (ctx) => {
    return await HepsiburadaController.syncCategoryAttributes(ctx);
  });

  // Listing bilgilerini getirme endpoint'i
  app.get("/api/hepsiburada/listings", async (ctx) => {
    return await HepsiburadaController.getListings(ctx);
  });

  // Listing güncelleme endpoint'i
  app.post("/api/hepsiburada/listings/update", async (ctx) => {
    return await HepsiburadaController.updateListing(ctx);
  });

  // Listing silme endpoint'i
  app.delete("/api/hepsiburada/listings/:listingId", async (ctx) => {
    return await HepsiburadaController.deleteListing(ctx);
  });

  // Listing satışa açma/kapatma endpoint'i
  app.post("/api/hepsiburada/listings/toggle-status", async (ctx) => {
    return await HepsiburadaController.toggleListingStatus(ctx);
  });

  // Ürünleri getirme endpoint'i
  app.get("/api/hepsiburada/products", async (ctx) => {
    return await HepsiburadaController.getProducts(ctx);
  });

  // Ürünleri senkronize etme endpoint'i
  app.post("/api/hepsiburada/products/sync", async (ctx) => {
    return await HepsiburadaController.syncProducts(ctx);
  });

  // Listingleri senkronize etme endpoint'i
  app.post("/api/hepsiburada/listings/sync", async (ctx) => {
    return await HepsiburadaController.syncListings(ctx);
  });

  return app;
};

export default HepsiburadaRoutes; 