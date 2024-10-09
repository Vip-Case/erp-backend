import { Elysia } from 'elysia';
import StockMovementController from '../../controllers/stockMovementController';

export const StockMovementRoutes = (app: Elysia) => {
    app.group("/stockMovements", (app) =>
        app.get("/", StockMovementController.getAllStockMovements, { tags: ["Stock Movements"] })
            .post("/", StockMovementController.createStockMovement, { tags: ["Stock Movements"] })
            .get("/:id", StockMovementController.getStockMovementById, { tags: ["Stock Movements"] })
            .put("/:id", StockMovementController.updateStockMovement, { tags: ["Stock Movements"] })
            .delete("/:id", StockMovementController.deleteStockMovement, { tags: ["Stock Movements"] })
            .get("/filter", StockMovementController.getStockMovementsWithFilters, { tags: ["Stock Movements"] })
    );
};

export default StockMovementRoutes;