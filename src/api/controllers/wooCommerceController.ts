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
    this.wooCommerceService = new WooCommerceService();

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

  async addToStockCard(productIds: string[], branchCode?: string): Promise<void> {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Geçersiz ürün ID'leri sağlandı.");
    }
    
    // WooCommerceService'deki metodu çağır
    await this.wooCommerceService.addToStockCard(productIds, branchCode);
  }

  async addStockCardToStockCardWarehouse(): Promise<any> {
    try {
      await this.wooCommerceService.addStockCardToStockCardWarehouse();
      return { success: true, message: "StockCard'lar başarıyla StockCardWarehouse'a eklendi." };
    } catch (error) {
      console.error("StockCardWarehouse eklerken hata oluştu:", error);
      return {
        success: false,
        message: "StockCardWarehouse ekleme sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  }

  async syncStockCardWithWooCommerce(): Promise<any> {
    try {
      return await this.wooCommerceService.syncStockCardWithWooCommerce();
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyonu sırasında hata oluştu:", error);
      throw error;
    }
  }
}
