
import RoleService from '../../services/concrete/roleService';
import { Context } from 'elysia';
import { Role } from '@prisma/client';

// Service Initialization
const roleService = new RoleService();

export const RoleController = {

    createRole: async (ctx: Context) => {
        const roleData: Role = ctx.body as Role;
        try {
            const role = await roleService.createRole(roleData);
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating role", details: error.message };
        }
    },

    updateRole: async (ctx: Context) => {
        const { id } = ctx.params;
        const roleData: Partial<Role> = ctx.body as Partial<Role>;
        try {
            const role = await roleService.updateRole(id, roleData);
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating role", details: error.message };
        }
    },

    deleteRole: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const role = await roleService.deleteRole(id);
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting role", details: error.message };
        }
    },

    getRoleById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const role = await roleService.getRoleById(id);
            if (!role) {
                return ctx.error(404, 'Role not found');
            }
            ctx.set.status = 200;
            return role;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching role", details: error.message };
        }
    },

    getAllRoles: async (ctx: Context) => {
        try {
            const roles = await roleService.getAllRoles();
            ctx.set.status = 200;
            return roles;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching roles", details: error.message };
        }
    },

    getRolesWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Role>;
        try {
            const roles = await roleService.getRolesWithFilters(filters);
            ctx.set.status = 200;
            return roles;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching roles", details: error.message };
        }
    }
}

export default RoleController;