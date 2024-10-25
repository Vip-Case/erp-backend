
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
    );
};

export default WarehouseRoutes;