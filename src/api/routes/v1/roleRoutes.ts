
import { Elysia } from 'elysia';
import RoleController from '../../controllers/roleController';

export const RoleRoutes = (app: Elysia) => {
    app.group("/roles", (app) =>
        app.get("/", RoleController.getAllRoles, { tags: ["Roles"] })
            .post("/", RoleController.createRole, { tags: ["Roles"] })
            .get("/:id", RoleController.getRoleById, { tags: ["Roles"] })
            .put("/:id", RoleController.updateRole, { tags: ["Roles"] })
            .delete("/:id", RoleController.deleteRole, { tags: ["Roles"] })
            .get("/filter", RoleController.getRolesWithFilters, { tags: ["Roles"] })
    );
};

export default RoleRoutes;