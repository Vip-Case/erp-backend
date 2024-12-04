import { WooCommerceService } from "../../services/concrete/wooCommerceService";

interface SyncProductsRequestBody {
  storeId?: string;
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export class WooCommerceController {
  private wooCommerceService: WooCommerceService;

  constructor() {
    // Service başlatma işlemi
    this.wooCommerceService = new WooCommerceService(
      "https://demo.novent.com.tr",
      "ck_e30acc3a659a40fb789d65613b7e8689225a1f20",
      "cs_b99e1995a511141733e56f25f32dfa721a514f57"
    );
  }

  async syncProducts(body: SyncProductsRequestBody) {
    const { storeId, storeUrl, consumerKey, consumerSecret } = body;

    // Eksik parametre kontrolü
    if (!storeId || !storeUrl || !consumerKey || !consumerSecret) {
      return { success: false, message: "Eksik parametreler" };
    }

    try {
      // Servis üzerinden ürün senkronizasyonu
      await this.wooCommerceService.syncProducts(storeId);
      return { success: true, message: "WooCommerce ürünleri başarıyla senkronize edildi." };
    } catch (error) {
      console.error("Error syncing products:", error);
      return {
        success: false,
        message: "Senkronizasyon sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  }
}
