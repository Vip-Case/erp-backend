import invoiceService, { InvoiceService } from "../../services/concrete/invoiceService";
import { WooCommerceService } from "../../services/concrete/wooCommerceService";

interface SyncProductsRequestBody {
  storeId?: string;
  storeUrl: string;
}

export class WooCommerceController {
  private wooCommerceService!: WooCommerceService;

  constructor() { }

  /**
   * WooCommerce servisini başlatır.
   */
  private async initializeWooCommerceService(storeId: string): Promise<void> {
    if (!this.wooCommerceService) {
      try {
        this.wooCommerceService = new WooCommerceService(storeId);
        await this.wooCommerceService.initializeWooCommerce();
        console.log("WooCommerce servisi başarıyla başlatıldı.");
      } catch (error) {
        console.error("WooCommerce servisi başlatılırken hata oluştu:", error);
        throw new Error("WooCommerce servisi başlatılamadı.");
      }
    }
  }

  async syncProducts(body: SyncProductsRequestBody) {
    const { storeId } = body;

    if (!storeId) {
      throw new Error("storeId eksik. Lütfen geçerli bir storeId sağlayın.");
    }
    try {
      if (!this.wooCommerceService) {
        await this.initializeWooCommerceService(storeId); // Dinamik başlatma
      }
      const result = await this.wooCommerceService.syncProducts({ storeId });
      return result;
    } catch (error) {
      console.error("Error syncing products:", error);
      return {
        success: false,
        message: "Senkronizasyon sırasında bir hata oluştu.",
        error: error instanceof Error ? error.message : error,
      };
    }
  }

  async addToStockCard(
    productIds: string[] = [],
    branchCode?: string,
    storeId?: string,
    warehouseId?: string,
    useWooCommercePrice: boolean = true,
    useWooCommerceQuantity: boolean = true,
    includeAll: boolean = false
  ): Promise<void> {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Geçersiz ürün ID'leri sağlandı.");
    }

    if (!storeId) {
      throw new Error("storeId eksik. Lütfen geçerli bir storeId sağlayın.");
    }

    try {
      console.log("addToStockCard çağrıldı:", {
        productIds,
        branchCode,
        storeId,
        warehouseId,
        useWooCommercePrice,
        useWooCommerceQuantity,
        includeAll,
      });
      // WooCommerce servisini dinamik olarak başlat
      const wooCommerceService = await WooCommerceService.getInstance(storeId);

      // Servisi çağır ve parametreleri ilet
      await wooCommerceService.addToStockCard(
        productIds,
        branchCode,
        warehouseId,
        useWooCommercePrice,
        useWooCommerceQuantity,
        includeAll
      );

      console.log("Ürünler başarıyla StockCard'a eklendi.");
    } catch (error) {
      console.error("StockCard eklenirken bir hata oluştu:", error);
      throw new Error("StockCard ekleme işlemi sırasında bir hata oluştu.");
    }
  }

  async syncStockCardWithWooCommerce(storeId: string,
    updatePrice: boolean = true,
    updateQuantity: boolean = true,
    specificStockCardIds: string[] = []): Promise<any> {
    try {
      if (!storeId) {
        throw new Error("storeId eksik. Lütfen geçerli bir storeId sağlayın.");
      }

      // WooCommerce servisini başlat
      if (!this.wooCommerceService) {
        await this.initializeWooCommerceService(storeId); // Dinamik başlatma
      }

      return await this.wooCommerceService.syncStockCardWithWooCommerce(storeId,
        updatePrice,
        updateQuantity,
        specificStockCardIds);
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyonu sırasında hata oluştu:", error);
      throw error;
    }
  }

  public async createOrderFromInvoice(invoiceId: string, storeId: string): Promise<any> {
    try {
      if (!this.wooCommerceService) {
        await this.initializeWooCommerceService(storeId);
      }

      // ERP'den fatura bilgilerini al
      const invoiceService = new InvoiceService();
      const invoiceDetails = await invoiceService.getInvoiceInfoById(invoiceId);
      if (!invoiceDetails) {
        throw new Error(`Fatura bulunamadı: ${invoiceId}`);
      }

      // WooCommerce sipariş oluştur
      await this.wooCommerceService.createOrder(invoiceDetails);

      console.log(`WooCommerce siparişi başarıyla oluşturuldu. Invoice ID: ${invoiceId}`);
      return { success: true, message: `Sipariş başarıyla oluşturuldu. Invoice ID: ${invoiceId}` };
    } catch (error) {
      console.error("WooCommerce siparişi oluşturulurken hata oluştu:", error);
      return {
        success: false,
        message: "WooCommerce siparişi oluşturulamadı.",
        error: error instanceof Error ? error.message : error,
      };
    }
  }

}
