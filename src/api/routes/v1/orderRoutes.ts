import { Elysia } from "elysia";
import { Context } from "elysia";
import OrderController from "../../controllers/orderController";


const OrderRoutes = (app: Elysia) => {
  // Sipariş oluşturma webhook
  app.post("/webhook/order-created", async (ctx) => {
    try {
      // İmza doğrulandıysa siparişi oluştur
      const response = await OrderController.createOrder(ctx);
      return response;
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      return { status: 401, body: { error: error.message } };
    }
  });

  // Sipariş güncelleme webhook
  app.post("/webhook/order-update", async (ctx) => {
    console.log("Webhook Body:", ctx.body);
   
    const response =  await OrderController.updateOrder(ctx);
    return response;
  });
  

  // Tüm siparişleri getir
  app.get("/webhook/orders", async (ctx) => {
    const response = await OrderController.getAllOrders(ctx);
    return response;
  });

  // Tüm siparişleri detaylı getir
  app.get("/webhook/order-details", async (ctx) => {
    const response = await OrderController.getAllOrdersWithDetails(ctx);
    return response;
  });

  // Tüm siparişlerin bilgi listesini getir
  app.get("/webhook/order-infos", async (ctx) => {
    const response = await OrderController.getAllOrdersWithInfos(ctx);
    return response;
  });

  return app;
};

export default OrderRoutes;
