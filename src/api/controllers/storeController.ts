import { StoreService } from '../../services/concrete/storeService';
import { Context } from 'elysia';
import { Prisma } from '@prisma/client';

export const StoreController = {

    createStore: async (ctx: Context) => {
        const storeData = ctx.body as Prisma.StoreCreateInput;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const store = await new StoreService().createStore(storeData, bearerToken);
            ctx.set.status = 200;
            return store;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating Store", details: error.message };
        }
    },

    updateStore: async (ctx: Context) => {
        const { id } = ctx.params;
        const storeData = ctx.body as Prisma.StoreUpdateInput;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const store = await new StoreService().updateStore(id, storeData, bearerToken);
            ctx.set.status = 200;
            return store;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating Store", details: error.message };
        }
    },

    deleteStore: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            await new StoreService().deleteStore(id);
            ctx.set.status = 200;
            return { message: "Store deleted successfully" };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting Store", details: error.message };
        }
    },

    getStoreById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const store = await new StoreService().getStoreById(id);
            if (!store) {
                return ctx.error(404, 'Store not found');
            }
            ctx.set.status = 200;
            return store;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching Store", details: error.message };
        }
    },

    getAllStores: async (ctx: Context) => {
        try {
            const stores = await new StoreService().getAllStores();
            ctx.set.status = 200;
            return stores;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching Stores", details: error.message };
        }
    }
};