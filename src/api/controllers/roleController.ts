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
    };
    body: RoleRequest;
    params: { [key: string]: string };
    set: { status: number };
    query: { [key: string]: any };
    error: (code: number, message: string) => void;
}

// Service Initialization
const roleService = new RoleService();

export const RoleController = {
    createRole: async (ctx: CustomContext) => {
        const { roleName, description, permissionIds } = ctx.body;
        try {
            if (!ctx.request.user?.isAdmin) {
                ctx.set.status = 403;
                return { error: "Yalnızca adminler yeni rol oluşturabilir." };
            }

            const role = await roleService.createRole({ roleName, description } as Role, permissionIds || []);
            ctx.set.status = 201;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating role", details: error.message };
        }
    },

    updateRole: async (ctx: CustomContext) => {
        const { id } = ctx.params;
        const { roleName, description, permissionIds } = ctx.body;
        try {
            if (!ctx.request.user?.isAdmin) {
                ctx.set.status = 403;
                return { error: "Yalnızca adminler rol güncelleyebilir." };
            }

            const role = await roleService.updateRole(id, { roleName, description }, permissionIds || []);
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

            const role = await roleService.deleteRole(id);
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting role", details: error.message };
        }
    },
};

export default RoleController;
