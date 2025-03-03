import { Context } from "elysia";
import { HepsiburadaService } from "../../services/concrete/hepsiburadaService";

export class HepsiburadaController {
  private hepsiburadaService: HepsiburadaService;

  constructor(private readonly storeId: string) {
    this.hepsiburadaService = new HepsiburadaService(storeId);
  }

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

      const hepsiburadaService = new HepsiburadaService(storeId);
      const isConnected = await hepsiburadaService.testConnection();

      if (isConnected) {
        return {
          status: 200,
          body: {
            success: true,
            message: "Hepsiburada bağlantısı başarılı",
            storeId
          }
        };
      } else {
        return {
          status: 500,
          body: {
            success: false,
            error: "Hepsiburada bağlantısı başarısız"
          }
        };
      }
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

  // Kategorileri getirme
  static async getCategories(ctx: Context) {
    try {
      const { storeId, page, size } = ctx.query as { storeId: string; page?: string; size?: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const categories = await hepsiburadaService.getCategories(
        page ? parseInt(page) : 0,
        size ? parseInt(size) : 1000
      );

      return {
        status: 200,
        body: categories
      };
    } catch (error: any) {
      console.error("Kategoriler alınamadı:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kategoriler alınamadı'
        }
      };
    }
  }

  // Kategori özelliklerini getirme
  static async getCategoryAttributes(ctx: Context) {
    try {
      const { storeId, categoryId } = ctx.query as { storeId: string; categoryId: string };

      if (!storeId || !categoryId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId ve categoryId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const attributes = await hepsiburadaService.getCategoryAttributes(parseInt(categoryId));

      return {
        status: 200,
        body: attributes
      };
    } catch (error: any) {
      console.error("Kategori özellikleri alınamadı:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kategori özellikleri alınamadı'
        }
      };
    }
  }

  // Özellik değerlerini getirme
  static async getAttributeValues(ctx: Context) {
    try {
      const { storeId, categoryId, attributeId, page, limit } = ctx.query as { 
        storeId: string; 
        categoryId: string; 
        attributeId: string;
        page?: string;
        limit?: string;
      };

      if (!storeId || !categoryId || !attributeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId, categoryId ve attributeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const attributeValues = await hepsiburadaService.getAttributeValues(
        parseInt(categoryId),
        attributeId,
        page ? parseInt(page) : 0,
        limit ? parseInt(limit) : 1000
      );

      return {
        status: 200,
        body: attributeValues
      };
    } catch (error: any) {
      console.error("Özellik değerleri alınamadı:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Özellik değerleri alınamadı'
        }
      };
    }
  }

  // Kategorileri senkronize etme
  static async syncCategories(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.syncCategories();

      return {
        status: 200,
        body: {
          success: true,
          message: `${result.totalSaved} kategori başarıyla senkronize edildi`,
          ...result
        }
      };
    } catch (error: any) {
      console.error("Kategoriler senkronize edilemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kategoriler senkronize edilemedi'
        }
      };
    }
  }

  // Kategori özelliklerini senkronize etme
  static async syncCategoryAttributes(ctx: Context) {
    try {
      const { storeId, categoryId } = ctx.query as { storeId: string; categoryId: string };

      if (!storeId || !categoryId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId ve categoryId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.syncCategoryAttributes(categoryId);

      return {
        status: 200,
        body: {
          success: true,
          message: `${result.totalSaved} kategori özelliği başarıyla senkronize edildi`,
          ...result
        }
      };
    } catch (error: any) {
      console.error("Kategori özellikleri senkronize edilemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Kategori özellikleri senkronize edilemedi'
        }
      };
    }
  }

  // Listing bilgilerini getirme
  static async getListings(ctx: Context) {
    try {
      const { storeId, page, size } = ctx.query as { storeId: string; page?: string; size?: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const listings = await hepsiburadaService.getListings(
        page ? parseInt(page) : 0,
        size ? parseInt(size) : 100
      );

      return {
        status: 200,
        body: listings
      };
    } catch (error: any) {
      console.error("Listing bilgileri alınamadı:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Listing bilgileri alınamadı'
        }
      };
    }
  }

  // Listing güncelleme
  static async updateListing(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };
      const listingData = ctx.body as any;

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      if (!listingData) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "Listing verisi zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.updateListing(listingData);

      return {
        status: 200,
        body: {
          success: true,
          message: "Listing başarıyla güncellendi",
          data: result
        }
      };
    } catch (error: any) {
      console.error("Listing güncellenemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Listing güncellenemedi'
        }
      };
    }
  }

  // Listing silme
  static async deleteListing(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };
      const { listingId } = ctx.params as { listingId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      if (!listingId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "listingId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.deleteListing(listingId);

      return {
        status: 200,
        body: {
          success: true,
          message: "Listing başarıyla silindi",
          data: result
        }
      };
    } catch (error: any) {
      console.error("Listing silinemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Listing silinemedi'
        }
      };
    }
  }

  // Listing satışa açma/kapatma
  static async toggleListingStatus(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };
      const { hepsiburadaSku, isSalable } = ctx.body as { hepsiburadaSku: string; isSalable: boolean };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      if (!hepsiburadaSku) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "hepsiburadaSku zorunludur" 
          }
        };
      }

      if (isSalable === undefined) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "isSalable zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.toggleListingStatus(hepsiburadaSku, isSalable);

      return {
        status: 200,
        body: {
          success: true,
          message: `Listing durumu ${isSalable ? 'satışa açık' : 'satışa kapalı'} olarak güncellendi`,
          data: result
        }
      };
    } catch (error: any) {
      console.error("Listing durumu değiştirilemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Listing durumu değiştirilemedi'
        }
      };
    }
  }

  // Ürünleri getirme
  static async getProducts(ctx: Context) {
    try {
      const { storeId, page, size } = ctx.query as { storeId: string; page?: string; size?: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const products = await hepsiburadaService.getProducts(
        page ? parseInt(page) : 0,
        size ? parseInt(size) : 100
      );

      return {
        status: 200,
        body: products
      };
    } catch (error: any) {
      console.error("Ürün bilgileri alınamadı:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Ürün bilgileri alınamadı'
        }
      };
    }
  }

  // Ürünleri senkronize etme
  static async syncProducts(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.syncProducts();

      return {
        status: 200,
        body: {
          success: true,
          message: `${result.totalSaved} ürün başarıyla senkronize edildi`,
          ...result
        }
      };
    } catch (error: any) {
      console.error("Ürünler senkronize edilemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Ürünler senkronize edilemedi'
        }
      };
    }
  }

  // Listingleri senkronize etme
  static async syncListings(ctx: Context) {
    try {
      const { storeId } = ctx.query as { storeId: string };

      if (!storeId) {
        return {
          status: 400,
          body: { 
            success: false,
            error: "storeId zorunludur" 
          }
        };
      }

      const hepsiburadaService = new HepsiburadaService(storeId);
      const result = await hepsiburadaService.syncListings();

      return {
        status: 200,
        body: {
          success: true,
          message: `${result.totalSaved} listing başarıyla senkronize edildi`,
          ...result
        }
      };
    } catch (error: any) {
      console.error("Listingler senkronize edilemedi:", error);
      return {
        status: 500,
        body: {
          success: false,
          error: error.message || 'Listingler senkronize edilemedi'
        }
      };
    }
  }
} 