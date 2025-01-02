import { Elysia } from "elysia";
import { PermissionController } from "../../controllers/permissionController";

export const PermissionRoutes = (app: Elysia) => {
    return app.group("/permissions", (app) =>
        app.get("/", PermissionController.getAll)
            .post("/", PermissionController.create)
            .delete("/:id", PermissionController.delete)
    );
};

export default PermissionRoutes;
