
import UserService from '../../services/concrete/userService';
import { Context } from 'elysia';
import { User } from '@prisma/client';
import prisma from '../../config/prisma';

// Service Initialization
const userService = new UserService();

export const UserController = {

    assignRolesToUser: async (ctx: Context) => {
        const { userId, roleIds } = ctx.body as { userId: string, roleIds: string[] };
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                role: {
                    connect: roleIds.map((id: string) => ({ id })),
                },
            },
        });
        ctx.set.status = 200;
        return user;
    },

    createUser: async (ctx: Context) => {
        const userData: User = ctx.body as User;
        try {
            const user = await userService.createUser(userData);
            ctx.set.status = 200;
            return user;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating user", details: error.message };
        }
    },

    updateUser: async (ctx: Context) => {
        const { id } = ctx.params;
        const userData: Partial<User> = ctx.body as Partial<User>;
        try {
            const user = await userService.updateUser(id, userData);
            ctx.set.status = 200;
            return user;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating user", details: error.message };
        }
    },

    deleteUser: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const user = await userService.deleteUser(id);
            ctx.set.status = 200;
            return user;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting user", details: error.message };
        }
    },

    getUserById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const user = await userService.getUserById(id);
            if (!user) {
                return ctx.error(404, 'User not found');
            }
            ctx.set.status = 200;
            return user;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching user", details: error.message };
        }
    },

    getAllUsers: async (ctx: Context) => {
        try {
            const users = await userService.getAllUsers();
            ctx.set.status = 200;
            return users;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching users", details: error.message };
        }
    },

    getUsersWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<User>;
        try {
            const users = await userService.getUsersWithFilters(filters);
            ctx.set.status = 200;
            return users;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching users", details: error.message };
        }
    }
}

export default UserController;