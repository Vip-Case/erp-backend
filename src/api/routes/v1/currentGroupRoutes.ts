
import { Elysia } from 'elysia';
import CurrentGroupController from '../../controllers/currentGroupController';

export const CurrentGroupRoutes = (app: Elysia) => {
    app.group("/currentGroups", (app) =>
        app.get("/", CurrentGroupController.getAllCurrentGroups, { tags: ["Current Groups"] })
            .post("/", CurrentGroupController.createCurrentGroup, { tags: ["Current Groups"] })
            .get("/:id", CurrentGroupController.getCurrentGroupById, { tags: ["Current Groups"] })
            .put("/:id", CurrentGroupController.updateCurrentGroup, { tags: ["Current Groups"] })
            .delete("/:id", CurrentGroupController.deleteCurrentGroup, { tags: ["Current Groups"] })
            .get("/filter", CurrentGroupController.getCurrentGroupsWithFilters, { tags: ["Current Groups"] })   
    );
    return app;
};

export default CurrentGroupRoutes;