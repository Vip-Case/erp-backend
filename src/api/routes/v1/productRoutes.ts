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
  
    const { storeId, storeUrl, consumerKey, consumerSecret } = body;
  
    try {
      const response = await wooCommerceController.syncProducts({
        storeId,
        storeUrl,
        consumerKey,
        consumerSecret,
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
    const { productIds, includeAll, branchCode } = body as { productIds?: string[]; includeAll?: boolean; branchCode?: string };
  
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
        throw new Error("Geçersiz veya eksik ürün ID'leri."); // Hata mesajı eklenir
      }
  
      await wooCommerceController.addToStockCard(finalProductIds, branchCode);
  
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

  // StockCard'ları StockCardWarehouse'a ekleyen yeni route
  app.post("/add-to-stockcard-warehouse", async ({ body, set }) => {
    try {
      const response = await wooCommerceController.addStockCardToStockCardWarehouse();
      return response;
    } catch (error) {
      console.error("StockCardWarehouse eklerken hata oluştu:", error);
      set.status = 500;
      return {
        success: false,
        message: "StockCardWarehouse ekleme sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  });

  app.post("/sync-stockcard-woocommerce", async ({ set }) => {
    try {
      const response = await wooCommerceController.syncStockCardWithWooCommerce();
      return response;
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyonu sırasında hata oluştu:", error);
      set.status = 500;
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
    "storeId" in body &&
    "storeUrl" in body &&
    "consumerKey" in body &&
    "consumerSecret" in body &&
    (typeof body.storeId === "string" || body.storeId === null) &&
    typeof body.storeUrl === "string" &&
    typeof body.consumerKey === "string" &&
    typeof body.consumerSecret === "string"
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
