import { Elysia } from "elysia";
import { WooCommerceController } from "../../controllers/wooCommerceController";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SyncProductsRequestBody {
  storeId?: string;
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

interface AddToStockCardRequestBody {
  productIds: string[];

}

// WooCommerceController örneği
const wooCommerceController = new WooCommerceController();

export const wooCommerceRoutes = (app: Elysia) => {
  app.post("/sync-products/woocommerce", async ({ body, set }) => {
    if (!isSyncProductsRequestBody(body)) {
      set.status = 400;
      return { success: false, message: "Geçersiz veya eksik body parametreleri" };
    }

    const { storeId, storeUrl } = body;

    try {
      const response = await wooCommerceController.syncProducts({
        storeId,
        storeUrl
      });
      return response;
    } catch (error) {
      console.error("Error syncing products:", error);
      set.status = 500;
      return {
        success: false,
        message: "Senkronizasyon sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  });

  // StockCard'a ürün ekleme route'u
  app.post("/add-to-stockcard", async ({ body, set }) => {
    const {
      productIds,
      includeAll,
      branchCode,
      storeId,
      warehouseId,
      useWooCommercePrice = true,
      useWooCommerceQuantity = true,
    } = body as {
      productIds?: string[];
      includeAll?: boolean;
      branchCode?: string;
      storeId?: string;
      warehouseId?: string;
      useWooCommercePrice?: boolean;
      useWooCommerceQuantity?: boolean;
    };

    // Parametrelerin doğrulanması
    if (!storeId) {
      set.status = 400;
      return { success: false, message: "storeId eksik. Lütfen geçerli bir storeId sağlayın." };
    }

    if (!Array.isArray(productIds) && !includeAll) {
      set.status = 400;
      return { success: false, message: "Lütfen geçerli ürün ID'leri veya tüm ürünleri ekleme seçeneği sağlayın." };
    }

    try {
      let finalProductIds: string[] = [];

      if (includeAll) {
        // Tüm ürünleri getir
        const allProducts = await prisma.marketPlaceProducts.findMany({
          select: { id: true },
        });
        finalProductIds = allProducts.map((product) => product.id);
      } else if (productIds && Array.isArray(productIds)) {
        finalProductIds = productIds;
      } else {
        throw new Error("Geçersiz veya eksik ürün ID'leri.");
      }

      // Log parametreler
      console.log("addToStockCard için parametreler:", {
        productIds: finalProductIds,
        branchCode,
        storeId,
        warehouseId,
        useWooCommercePrice,
        useWooCommerceQuantity,
        includeAll,
      });

      // Kontrolör metodunu çağır
      await wooCommerceController.addToStockCard(
        finalProductIds,
        branchCode,
        storeId,
        warehouseId,
        useWooCommercePrice,
        useWooCommerceQuantity,
        includeAll
      );

      return { success: true, message: `${finalProductIds.length} ürün başarıyla StockCard'a eklendi.` };
    } catch (error) {
      console.error("StockCard ekleme sırasında bir hata oluştu:", error);

      set.status = 500;
      return {
        success: false,
        message: "StockCard ekleme sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  });

  app.post("/sync-stockcard-woocommerce", async (ctx) => {
    try {
      // JSON body'yi al
      const body = await ctx.request.json().catch(() => null);
  
      if (!body) {
        ctx.set.status = 400;
        return { success: false, message: "Geçersiz body. Lütfen JSON formatında bir body gönderin." };
      }
  
      // Gerekli parametreleri al ve kontrol et
      const { storeId, specificStockCardIds, updatePrice, updateQuantity } = body as {
        storeId: string;
        specificStockCardIds: string[];
        updatePrice?: boolean;
        updateQuantity?: boolean;
      };
  
      if (!storeId) {
        ctx.set.status = 400;
        return { success: false, message: "storeId eksik. Lütfen geçerli bir storeId sağlayın." };
      }
  
      if (specificStockCardIds && !Array.isArray(specificStockCardIds)) {
        ctx.set.status = 400;
        return { success: false, message: "specificStockCardIds geçersiz bir formatta. Array olmalı." };
    }
  
      // Metoda aktar ve sonucu döndür
      const response = await wooCommerceController.syncStockCardWithWooCommerce(
        storeId,
        updatePrice ?? true,
        updateQuantity ?? true,
        specificStockCardIds
      );
  
      return response;
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyonu sırasında hata oluştu:", error);
      ctx.set.status = 500;
      return {
        success: false,
        message: "StockCard ve WooCommerce senkronizasyonu sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  });
  

};

// Type guard fonksiyonu
function isSyncProductsRequestBody(body: any): body is SyncProductsRequestBody {
  return (
    body &&
    typeof body === "object" &&
    typeof body.storeUrl === "string" &&
    body.storeUrl.trim().length > 0 // storeUrl zorunlu, boş olamaz
  );
}


// Type guard fonksiyonu
function isAddToStockCardRequestBody(body: any): body is AddToStockCardRequestBody {
  return (
    body &&
    typeof body === "object" &&
    "productIds" in body &&
    Array.isArray(body.productIds) &&
    body.productIds.every((id: any) => typeof id === "string")
  );
}

export default wooCommerceRoutes;
