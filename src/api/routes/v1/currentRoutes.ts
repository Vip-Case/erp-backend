
import { Elysia } from 'elysia';
import CurrentController from '../../controllers/currentController';

export const CurrentRoutes = (app: Elysia) => {
  app.group("/currents", (app) =>
    app.get("/", CurrentController.getAllCurrents, { tags: ["Currents"] })
      .post("/", CurrentController.createCurrent, { tags: ["Currents"] })
      .get("/:id", CurrentController.getCurrentById, { tags: ["Currents"] })
      .put("/:id", CurrentController.updateCurrent, { tags: ["Currents"] })
      .delete("/:id", CurrentController.deleteCurrent, { tags: ["Currents"] })
      .get("/filter", CurrentController.getCurrentsWithFilters, { tags: ["Currents"] })
      .get("/search", CurrentController.searchCurrents, { tags: ["Currents"] })
      .post("/create", CurrentController.createWithRelations, { tags: ["Currents"] })
      .delete("/deleteMany", CurrentController.deleteManyCurrentsWithRelations, { tags: ["Currents"] })
  );
  return app;
};

export default CurrentRoutes;