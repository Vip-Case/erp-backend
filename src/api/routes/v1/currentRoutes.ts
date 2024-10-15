
import { Elysia } from 'elysia';
import CurrentController from '../../controllers/currentController';
import { CurrentPlain } from '../../../../prisma/prismabox/Current';

export const CurrentRoutes = (app: Elysia) => {
    app.group("/currents", (app) =>
        app.get("/", CurrentController.getAllCurrents, { tags: ["Currents"] })
            .post("/", CurrentController.createCurrent, { tags: ["Currents"] })
            .get("/:id", CurrentController.getCurrentById, { tags: ["Currents"] })
            .put("/:id", CurrentController.updateCurrent, { tags: ["Currents"] })
            .delete("/:id", CurrentController.deleteCurrent, { tags: ["Currents"] })
            .get("/filter", CurrentController.getCurrentsWithFilters, { tags: ["Currents"] })
    );
};

export default CurrentRoutes;