import { Elysia } from "elysia";
import { PermissionController } from "../../controllers/permissionController";

export const PermissionRoutes = (app: Elysia) => {
    return app.group("/permissions", (group) => {
        group.get("/", PermissionController.getAll);
        group.post("/", PermissionController.create);
        group.delete("/:id", PermissionController.delete);
        return group;
    });
};

export default PermissionRoutes;
