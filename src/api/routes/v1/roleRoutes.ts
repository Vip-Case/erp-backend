import { Elysia } from "elysia";
import RoleController from "../../controllers/roleController";

export const RoleRoutes = (app: Elysia) => {
    return app.group("/roles", (group) => {
        group.get("/", RoleController.getAllRoles);
        group.post("/", RoleController.createRole);
        group.get("/:id", RoleController.getRoleById);
        group.put("/:id", RoleController.updateRole);
        group.delete("/:id", RoleController.deleteRole);
        return group;
    });
};

export default RoleRoutes;
