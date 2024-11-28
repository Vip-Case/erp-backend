import { Context } from "elysia";
import OrderService from "../../services/concrete/orderService";

interface WebhookData {
  id: string; // WooCommerce'den gelen sipariş ID'si
  [key: string]: any; // Diğer dinamik alanlar
}

const OrderController = {
  createOrder: async (ctx: Context) => {
    try {
      const webhookData = ctx.body;
      const transformedData = OrderService.transformWooCommerceOrder(webhookData);
      const newOrder = await OrderService.createOrder(transformedData);

      ctx.set.status = 201;
      return { message: "Sipariş başarıyla oluşturuldu.", data: newOrder };
    } catch (error: any) {
      console.error("Sipariş oluşturma hatası:", error);
      ctx.set.status = 500;
      return { error: "Sipariş oluşturulamadı.", details: error.message };
    }
  },

  updateOrder: async (ctx: Context) => {
    try {
        const webhookData = ctx.body as WebhookData;

        console.log("Gelen Webhook Verisi:", webhookData);
        

        // WooCommerce Webhook Doğrulama İsteği
        if (webhookData.webhook_id) {
            console.log("WooCommerce Webhook doğrulama isteği alındı:", webhookData);
            ctx.set.status = 200; // Başarıyla yanıt döndür
            return { message: "Webhook doğrulandı." };
        }

        // Gerçek Sipariş Güncelleme Verisi
        if (!webhookData || (!webhookData.id && typeof webhookData.id !== "number")) {
          console.error("Geçersiz Webhook Verisi:", webhookData);
          ctx.set.status = 400;
          return { error: "Geçersiz webhook verisi veya ID eksik." };
        }

        console.log("Doğru Webhook Verisi Alındı:", webhookData);

        // WooCommerce webhook verisini dönüştür
        const transformedData = OrderService.transformWooCommerceOrder(webhookData);

        // Siparişi güncelle
        const updatedOrder = await OrderService.updateOrder(webhookData.id.toString(), transformedData);

        ctx.set.status = 200;
        return { message: "Sipariş başarıyla güncellendi.", data: updatedOrder };
    } catch (error: any) {
        console.error("Webhook sipariş güncelleme hatası:", error);
        ctx.set.status = 500;
        return { error: "Sipariş güncellenemedi.", details: error.message };
    }
},


  getAllOrders: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrders();

      ctx.set.status = 200;
      return orders;
    } catch (error: any) {
      console.error("Tüm siparişleri getirme hatası:", error);
      ctx.set.status = 500;
      return { error: "Siparişler alınamadı.", details: error.message };
    }
  },

  getAllOrdersWithDetails: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrdersWithDetails();

      ctx.set.status = 200;
      return orders;
    } catch (error: any) {
      console.error("Tüm siparişleri getirme hatası:", error);
      ctx.set.status = 500;
      return { error: "Siparişler alınamadı.", details: error.message };
    }
  },

  getAllOrdersWithInfos: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrdersWithInfos();

      ctx.set.status = 200;
      return orders;
    } catch (error: any) {
      console.error("Tüm siparişleri getirme hatası:", error);
      ctx.set.status = 500;
      return { error: "Siparişler alınamadı.", details: error.message };
    }
  },

};

export default OrderController;
