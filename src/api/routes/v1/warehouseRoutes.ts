import { Elysia } from 'elysia';
import WarehouseController from '../../controllers/warehouseController';

export const WarehouseRoutes = (app: Elysia) => {
  app.group("/warehouses", (app) =>
    app.get("/", WarehouseController.getAllWarehouses, { tags: ["Warehouses"] })
      .post("/", WarehouseController.createWarehouse, { tags: ["Warehouses"] })
      .get("/:id", WarehouseController.getWarehouseById, { tags: ["Warehouses"] })
      .put("/:id", WarehouseController.updateWarehouse, { tags: ["Warehouses"] })
      .delete("/:id", WarehouseController.deleteWarehouse, { tags: ["Warehouses"] })
      .get("/filter", WarehouseController.getWarehousesWithFilters, { tags: ["Warehouses"] })
      .post("/stocktake", WarehouseController.createStocktakeWarehouse, { tags: ["Warehouses"] })
      .post("/stocktake/:id", WarehouseController.updateStocktakeWarehouse, { tags: ["Warehouses"] })
      .get("/stocktake", WarehouseController.getAllStocktakeWarehouses, { tags: ["Warehouses"] })
      .get("/stocktake/:id", WarehouseController.getStocktakeWarehouseById, { tags: ["Warehouses"] })
      .delete("/stocktake/:id", WarehouseController.deleteStocktakeWarehouse, { tags: ["Warehouses"] })
      .post("/order-prepare", WarehouseController.createOrderPrepareWarehouse, { tags: ["Warehouses"] })
      .delete("/order-prepare/:id", WarehouseController.deleteOrderPrepareWarehouse, { tags: ["Warehouses"] })
      .post("/order-return", WarehouseController.createOrderReturnWarehouse, { tags: ["Warehouses"] })
      .get("/receipts", WarehouseController.getAllReceipts, { tags: ["Warehouses"] })
      .get("/receipts/:id", WarehouseController.getReceiptById, { tags: ["Warehouses"] })
  );
  return app;
};

export default WarehouseRoutes;