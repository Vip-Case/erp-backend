import RoleService from '../../services/concrete/roleService';
import { Role } from '@prisma/client';

interface RoleRequest {
    roleName: string;
    description?: string;
    permissionIds?: string[];
}

interface CustomContext {
    request: {
        user?: {
            isAdmin: boolean;
            userId: string;
            permissions: string[];
        };
        headers: {
            authorization?: string;
        };
    };
    body: RoleRequest;
    params: { id?: string };
    set: { status: number };
    query: { [key: string]: any };
    error: (code: number, message: string) => void;
}

// Service Initialization
const roleService = new RoleService();

export const RoleController = {
    getAllRoles: async (ctx: CustomContext) => {
        try {
            const roles = await roleService.getAllRoles();
            ctx.set.status = 200;
            return roles;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching roles", details: error.message };
        }
    },

    createRole: async (ctx: CustomContext) => {
        const { roleName, description, permissionIds } = ctx.body;
        const bearerToken = ctx.request.headers.authorization;

        try {
            if (!ctx.request.user?.isAdmin) {
                ctx.set.status = 403;
                return { error: "Yalnızca adminler yeni rol oluşturabilir." };
            }

            if (!bearerToken) {
                ctx.set.status = 401;
                return { error: "Authorization token is required" };
            }

            const role = await roleService.createRole(
                { roleName, description } as Role,
                permissionIds || [],
                bearerToken
            );
            ctx.set.status = 201;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating role", details: error.message };
        }
    },

    getRoleById: async (ctx: CustomContext) => {
        const { id } = ctx.params;
        try {
            const role = await roleService.getRoleById(id || "");
            if (!role) {
                ctx.error(404, "Role not found");
                return;
            }
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching role", details: error.message };
        }
    },

    updateRole: async (ctx: CustomContext) => {
        const { id } = ctx.params;
        const { roleName, description, permissionIds } = ctx.body;
        const bearerToken = ctx.request.headers.authorization;
        try {
            if (!ctx.request.user?.isAdmin) {
                ctx.set.status = 403;
                return { error: "Yalnızca adminler rol güncelleyebilir." };
            }

            if (!bearerToken) {
                ctx.set.status = 401;
                return { error: "Authorization token is required" };
            }

            const role = await roleService.updateRole(
                id || "",
                { roleName, description },
                bearerToken,
                permissionIds
            );
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating role", details: error.message };
        }
    },

    deleteRole: async (ctx: CustomContext) => {
        const { id } = ctx.params;
        try {
            if (!ctx.request.user?.isAdmin) {
                ctx.set.status = 403;
                return { error: "Yalnızca adminler rol silebilir." };
            }

            const result = await roleService.deleteRole(id || "");
            ctx.set.status = 200;
            return { message: "Rol başarıyla silindi", result };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting role", details: error.message };
        }
    },
};

export default RoleController;
