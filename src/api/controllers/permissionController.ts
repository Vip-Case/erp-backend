import PermissionService from "../../services/concrete/permissionService";

const permissionService = new PermissionService();

export const PermissionController = {
    getAll: async (ctx: any) => {
        try {
            const permissions = await permissionService.getAllPermissions();
            ctx.set.status = 200;
            return permissions;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching permissions", details: error.message };
        }
    },

    create: async (ctx: any) => {
        const { permissionName, description, route } = ctx.body;
        
        try {
            const permission = await permissionService.createPermission({
                permissionName,
                description,
                route
            });
            ctx.set.status = 201;
            return permission;
        } catch (error: any) {
            ctx.set.status = 400;
            return { error: "Error creating permission", details: error.message };
        }
    },

    delete: async (ctx: any) => {
        const { id } = ctx.params;
        try {
            const result = await permissionService.deletePermission(id);
            ctx.set.status = 200;
            return { message: "Permission deleted successfully", result };
        } catch (error: any) {
            ctx.set.status = 400;
            return { error: "Error deleting permission", details: error.message };
        }
    },
};
