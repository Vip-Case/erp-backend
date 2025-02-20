// controllers/trendyolController.ts
import { Context } from "elysia";
import { TrendyolService } from "../../services/concrete/trendyolService";
import prisma from "../../config/prisma";

export class TrendyolController {
  static async testConnection(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();

      return {
        status: 200,
        body: {
          success: true,
          message: "Trendyol bağlantısı başarılı",
          storeId
        }
      };
    } catch (error: any) {
      console.error("Bağlantı test hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Bağlantı testi başarısız'
        }
      };
    }
  }

  static async syncAll(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
      await trendyolService.syncAll();

      return {
        status: 200,
        body: {
          success: true,
          message: "Tüm veriler başarıyla senkronize edildi",
          storeId
        }
      };
    } catch (error: any) {
      console.error("Senkronizasyon hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Senkronizasyon başarısız'
        }
      };
    }
  }

  static async syncBrands(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
      await trendyolService.syncBrands();

      return {
        status: 200,
        body: {
          success: true,
          message: "Markalar başarıyla senkronize edildi",
          storeId
        }
      };
    } catch (error: any) {
      console.error("Marka senkronizasyon hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Marka senkronizasyonu başarısız'
        }
      };
    }
  }

  static async syncCategories(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
      await trendyolService.syncCategories();

      return {
        status: 200,
        body: {
          success: true,
          message: "Kategoriler başarıyla senkronize edildi",
          storeId
        }
      };
    } catch (error: any) {
      console.error("Kategori senkronizasyon hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kategori senkronizasyonu başarısız'
        }
      };
    }
  }

  static async syncProducts(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
      await trendyolService.syncProducts();

      return {
        status: 200,
        body: {
          success: true,
          message: "Ürünler başarıyla senkronize edildi",
          storeId
        }
      };
    } catch (error: any) {
      console.error("Ürün senkronizasyon hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Ürün senkronizasyonu başarısız'
        }
      };
    }
  }

  static async matchAndCreateStockCard(ctx: Context) {
    try {
      const { storeId, marketPlaceProductId } = ctx.body as { 
        storeId: string; 
        marketPlaceProductId: string;
      };
  
      if (!storeId || !marketPlaceProductId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId ve marketPlaceProductId zorunludur" 
          }
        };
      }
  
      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
  
      // MarketPlace ürününü bul
      const marketPlaceProduct = await prisma.marketPlaceProducts.findUnique({
        where: { id: marketPlaceProductId },
        include: { // İlişkili verileri de getir
          marketPlaceAttributes: true,
          MarketPlaceCategories: true,
          marketPlaceBrands: true
        }
      });
  
      if (!marketPlaceProduct) {
        return {
          status: 404,
          body: {
            success: false,
            error: "Ürün bulunamadı"
          }
        };
      }
  
      // StockCard oluştur ve eşleştir
      await trendyolService.matchAndCreateStockCard(marketPlaceProduct);
  
      return {
        status: 200,
        body: {
          success: true,
          message: "Ürün başarıyla StockCard'a eşleştirildi",
          storeId,
          marketPlaceProductId
        }
      };
    } catch (error: any) {
      console.error("Ürün eşleştirme hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Ürün eşleştirme işlemi başarısız'
        }
      };
    }
  }
  
  static async syncAndMatchAll(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };
  
      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }
  
      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
  
      // Önce senkronizasyon yap
      await trendyolService.syncAll();
  
      // Sonra tüm ürünleri StockCard'a eşle
      const marketPlaceProducts = await prisma.marketPlaceProducts.findMany({
        where: { storeId },
        include: { // İlişkili verileri de getir
          marketPlaceAttributes: true,
          MarketPlaceCategories: true,
          marketPlaceBrands: true
        }
      });
  
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
      };

      for (const product of marketPlaceProducts) {
        try {
          await trendyolService.matchAndCreateStockCard(product);
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`${product.productName}: ${error.message}`);
        }
      }
  
      return {
        status: 200,
        body: {
          success: true,
          message: "Senkronizasyon ve eşleştirme tamamlandı",
          results,
          storeId
        }
      };
    } catch (error: any) {
      console.error("Senkronizasyon ve eşleştirme hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'İşlem başarısız'
        }
      };
    }
  }
  
  static async addToStockCardWarehouse(ctx: Context) {
    try {
      const { storeId, marketPlaceProductId } = ctx.body as { 
        storeId: string; 
        marketPlaceProductId: string;
      };
  
      if (!storeId || !marketPlaceProductId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId ve marketPlaceProductId zorunludur" 
          }
        };
      }
  
      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
  
      // MarketPlace ürününü bul
      const marketPlaceProduct = await prisma.marketPlaceProducts.findUnique({
        where: { id: marketPlaceProductId },
        include: { 
          marketPlaceAttributes: true,
          MarketPlaceCategories: true,
          marketPlaceBrands: true
        }
      });
  
      if (!marketPlaceProduct) {
        return {
          status: 404,
          body: {
            success: false,
            error: "Ürün bulunamadı"
          }
        };
      }
  
      // StockCard'ı bul
      const stockCard = await prisma.stockCard.findFirst({
        where: {
          barcodes: {
            some: {
              barcode: marketPlaceProduct.barcode || undefined
            }
          }
        }
      });
  
      if (!stockCard) {
        return {
          status: 404,
          body: {
            success: false,
            error: "StockCard bulunamadı"
          }
        };
      }
  
      // StockCardWarehouse'a ekle
      if (marketPlaceProduct.barcode) {
        await trendyolService.addToStockCardWarehouse(stockCard, marketPlaceProduct.barcode);
      } else {
        throw new Error("Barcode is null or undefined");
      }
  
      return {
        status: 200,
        body: {
          success: true,
          message: "Ürün başarıyla StockCardWarehouse'a eklendi",
          storeId,
          marketPlaceProductId
        }
      };
    } catch (error: any) {
      console.error("StockCardWarehouse ekleme hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'StockCardWarehouse ekleme işlemi başarısız'
        }
      };
    }
  }
  
  // Toplu ekleme için yeni metod
  static async addAllToStockCardWarehouse(ctx: Context) {
    try {
      const { storeId } = ctx.body as { storeId: string };
  
      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }
  
      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
  
      // Tüm StockCard'ları bul
      const stockCards = await prisma.stockCard.findMany({
        include: {
          barcodes: true
        }
      });
  
      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
      };
  
      for (const stockCard of stockCards) {
        try {
          const barcode = stockCard.barcodes[0]?.barcode;
          if (barcode) {
            await trendyolService.addToStockCardWarehouse(stockCard, barcode);
            results.success++;
          }
        } catch (error: any) {
          results.failed++;
          results.errors.push(`${stockCard.productCode}: ${error.message}`);
        }
      }
  
      return {
        status: 200,
        body: {
          success: true,
          message: "Tüm ürünler StockCardWarehouse'a eklendi",
          results,
          storeId
        }
      };
    } catch (error: any) {
      console.error("Toplu StockCardWarehouse ekleme hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Toplu ekleme işlemi başarısız'
        }
      };
    }
  }

  static async updateStockInTrendyol(ctx: Context) {
    try {
      const { stockCardWarehouseId, storeId } = ctx.body as {
        stockCardWarehouseId: string;
        storeId: string;
      };
  
      if (!stockCardWarehouseId) {
        return {
          status: 400,
          body: {
            success: false,
            error: "stockCardWarehouseId zorunludur"
          }
        };
      }
  
      const trendyolService = new TrendyolService(storeId);
      await trendyolService.initialize();
      await trendyolService.updateTrendyolStock(stockCardWarehouseId);
  
      return {
        status: 200,
        body: {
          success: true,
          message: "Trendyol stok güncellendi"
        }
      };
    } catch (error: any) {
      console.error("Stok güncelleme hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Stok güncelleme başarısız'
        }
      };
    }
  }


  static async checkMatchStatus(ctx: Context) {
    try {
      const { storeId, barcode } = ctx.query as { 
        storeId: string;
        barcode?: string;
      };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const where = {
        storeId,
        ...(barcode ? { barcode } : {})
      };

      const matches = await prisma.productMatch.findMany({
        where: where,
        include: {
          product: true
        }
      });

      return {
        status: 200,
        body: {
          success: true,
          matches
        }
      };
    } catch (error: any) {
      console.error("Eşleştirme durumu kontrolü hatası:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kontrol işlemi başarısız'
        }
      };
    }
  }

}