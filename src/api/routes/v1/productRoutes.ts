import { Elysia } from "elysia";
import { WooCommerceController } from "../../controllers/wooCommerceController";
interface SyncProductsRequestBody {
  storeId?: string;
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}
// WooCommerceController örneği
const wooCommerceController = new WooCommerceController();

export const wooCommerceRoutes = (app: Elysia) => {
  app.post("/sync-products/woocommerce", async ({ body, set }) => {
    // Gövde tip kontrolü
    if (!isSyncProductsRequestBody(body)) {
      set.status = 400; // Hatalı istek
      return { success: false, message: "Geçersiz veya eksik body parametreleri" };
    }

    // Varsayılan değer atama (örneğin storeId eksikse varsayılan değer kullanabilirsiniz)
    const storeId = body.storeId || "default-store-id"; // Varsayılan storeId
    const storeUrl = body.storeUrl;
    const consumerKey = body.consumerKey;
    const consumerSecret = body.consumerSecret;

    try {
      // Controller'ı çağır
      const response = await wooCommerceController.syncProducts({
        storeId,
        storeUrl,
        consumerKey,
        consumerSecret,
      });

      return response;
    } catch (error) {
      console.error("Error syncing products:", error);
      set.status = 500; // Sunucu hatası
      return {
        success: false,
        message: "Senkronizasyon sırasında bir hata oluştu.",
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

export default wooCommerceRoutes;