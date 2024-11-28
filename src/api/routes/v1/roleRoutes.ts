
import { Elysia } from 'elysia';
import RoleController from '../../controllers/roleController';

export const RoleRoutes = (app: Elysia) => {
    app.group("/roles", (app) =>
            .post("/", RoleController.createRole, { tags: ["Roles"] })
            .put("/:id", RoleController.updateRole, { tags: ["Roles"] })
            .delete("/:id", RoleController.deleteRole, { tags: ["Roles"] })
    );
  return app;
};

export default RoleRoutes;