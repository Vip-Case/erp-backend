import { Context } from "elysia";
import OrderService from "../../services/concrete/orderService";

const OrderController = {
  // Sipariş oluşturma
  createOrder: async (ctx: Context) => {
    try {
      // Gelen webhook verisini al
      const webhookData = ctx.body as Record<string, any>;

      if (!webhookData) {
        throw new Error("Webhook verisi eksik.");
      }

      // Gelen veriyi dönüştür
      const transformedData = OrderService.transformWooCommerceOrder(webhookData);
      
      // Sipariş oluşturma servisini çağır
      const order = await OrderService.createOrder(transformedData);

      return {
        status: 201,
        body: {
          message: "Sipariş başarıyla oluşturuldu.",
          data: order,
        },
      };
    } catch (error: any) {
      console.error("Sipariş oluşturma hatası:", error.message || error);
      return {
        status: 500,
        body: {
          error: "Sipariş oluşturulamadı.",
          details: error.message || "Bilinmeyen bir hata oluştu.",
        },
      };
    }
  },

  // Sipariş güncelleme
  updateOrder: async (ctx: Context) => {
    try {
      const webhookData = ctx.body as Record<string, any>;
      if (!webhookData.id) {
      throw new Error("Webhook verisinde 'id' eksik.");
    }

      const transformedData = OrderService.transformWooCommerceOrder(webhookData);
      const updatedOrder = await OrderService.updateOrder(webhookData.id.toString(), transformedData);

      return { status: 200, body: { message: "Sipariş başarıyla güncellendi.", data: updatedOrder } };
    } catch (error: any) {
      console.error("Sipariş güncelleme hatası:", error);
      return { status: 500, body: { error: "Sipariş güncellenemedi.", details: error.message } };
    }
  },

  // Tüm siparişleri getir
  getAllOrders: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrders();
      return { status: 200, body: orders };
    } catch (error: any) {
      console.error("Tüm siparişleri getirme hatası:", error);
      return { status: 500, body: { error: "Siparişler alınamadı.", details: error.message } };
    }
  },

  // Tüm siparişleri detaylı getir
  getAllOrdersWithDetails: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrdersWithDetails();
      return { status: 200, body: orders };
    } catch (error: any) {
      console.error("Tüm sipariş detaylarını getirme hatası:", error);
      return { status: 500, body: { error: "Siparişler alınamadı.", details: error.message } };
    }
  },

  // Tüm siparişlerin bilgi listesini getir
  getAllOrdersWithInfos: async (ctx: Context) => {
    try {
      const orders = await OrderService.getAllOrdersWithInfos();
      return { status: 200, body: orders };
    } catch (error: any) {
      console.error("Tüm sipariş bilgilerini getirme hatası:", error);
      return { status: 500, body: { error: "Siparişler alınamadı.", details: error.message } };
    }
  },
};

export default OrderController;
