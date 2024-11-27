import { Elysia } from "elysia";
import OrderController from "../../controllers/orderController";

const OrderRoutes = (app: Elysia) => {
  app.post("/webhook/order-created", OrderController.createOrder);
  app.post("/webhook/order-updated", OrderController.updateOrder);
  app.get("/webhook/orders", OrderController.getAllOrders);
  app.get("/webhook/order-details", OrderController.getAllOrdersWithDetails);
  app.get("/webhook/order-infos", OrderController.getAllOrdersWithInfos);
};

export default OrderRoutes;
