import { Elysia } from 'elysia';
import PosController from '../../controllers/posController';

export const PosRoutes = (app: Elysia) => {
    app.group("/pos", (app) =>
        app.get("/", PosController.getAllPoss, { tags: ["Pos"] })
            .post("/", PosController.createPos, { tags: ["Pos"] })
            .get("/:id", PosController.getPosById, { tags: ["Pos"] })
            .put("/:id", PosController.updatePos, { tags: ["Pos"] })
            .delete("/:id", PosController.deletePos, { tags: ["Pos"] })
    );
};

export default PosRoutes;