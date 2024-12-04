
import { Elysia } from 'elysia';
import CurrentMovementController from '../../controllers/currentMovementController';

export const CurrentMovementRoutes = (app: Elysia) => {
    app.group("/currentMovements", (app) =>
        app.get("/", CurrentMovementController.getAllCurrentMovements, { tags: ["Current Movements"] })
            .post("/", CurrentMovementController.createCurrentMovement, { tags: ["Current Movements"] })
            .get("/:id", CurrentMovementController.getCurrentMovementById, { tags: ["Current Movements"] })
            .put("/:id", CurrentMovementController.updateCurrentMovement, { tags: ["Current Movements"] })
            .delete("/:id", CurrentMovementController.deleteCurrentMovement, { tags: ["Current Movements"] })
            .get("/filter", CurrentMovementController.getCurrentMovementsWithFilters, { tags: ["Current Movements"] })
            .get("/withCurrents", CurrentMovementController.getAllCurrentMovementsWithCurrents, { tags: ["Current Movements"] })
            .get("/byCurrent/:currentId", CurrentMovementController.getAllCurrentMovementsWithCurrentsByCurrentId, { tags: ["Current Movements"] })
    );
  return app;
};

export default CurrentMovementRoutes;