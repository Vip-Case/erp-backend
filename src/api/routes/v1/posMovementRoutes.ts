import { Elysia } from 'elysia';
import PosMovementController from '../../controllers/posMovementController';

export const PosMovementRoutes = (app: Elysia) => {
    app.group("/posMovements", (app) =>
        app.get("/", PosMovementController.getAllPosMovements, { tags: ["PosMovements"] })
            .post("/", PosMovementController.createPosMovement, { tags: ["PosMovements"] })
            .get("/:id", PosMovementController.getPosMovementById, { tags: ["PosMovements"] })
            .get("/pos/:id", PosMovementController.getPosMovementsByPosId, { tags: ["PosMovements"] })
            .put("/:id", PosMovementController.updatePosMovement, { tags: ["PosMovements"] })
            .delete("/:id", PosMovementController.deletePosMovement, { tags: ["PosMovements"] })
    );
};

export default PosMovementRoutes;