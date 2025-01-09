import { Elysia } from 'elysia';
import StockMovementController from '../../controllers/stockMovementController';

export const StockMovementRoutes = (app: Elysia) => {
  app.group("/stockMovements", (app) =>
    app.get("/", StockMovementController.getAllStockMovements, { tags: ["Stock Movements"] })
      .post("/", StockMovementController.createStockMovement, { tags: ["Stock Movements"] })
      .get("/:id", StockMovementController.getStockMovementById, { tags: ["Stock Movements"] })
      .put("/:id", StockMovementController.updateStockMovement, { tags: ["Stock Movements"] })
      .delete("/:id", StockMovementController.deleteStockMovement, { tags: ["Stock Movements"] })
      .get("/orders", StockMovementController.getAllOrderStockMovements, { tags: ["Stock Movements"] })
      .get("/sales", StockMovementController.getAllSalesStockMovements, { tags: ["Stock Movements"] })
      .get("/purchase", StockMovementController.getAllPurchaseStockMovements, { tags: ["Stock Movements"] })
      .get("/byProductCode/:productCode", StockMovementController.getAllStockMovementsByStockCardCode, { tags: ["Stock Movements"] })
      .get("/byStockCardId/:stockCardId", StockMovementController.getAllStockMovementsByStockCardId, { tags: ["Stock Movements"] })
  );
  return app;
};

export default StockMovementRoutes;