
import CurrentService from '../../services/concrete/currentService';
import { Context } from 'elysia';
import { Current } from '@prisma/client';

// Service Initialization
const currentService = new CurrentService();

export const CurrentController = {

    createCurrent: async (ctx: Context) => {
        const currentData: Current = ctx.body as Current;
        try {
            const current = await currentService.createCurrent(currentData);
            ctx.set.status = 200;
            return current;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating current", details: error.message };
        }
    },

    updateCurrent: async (ctx: Context) => {
        const { id } = ctx.params;
        const currentData: Partial<Current> = ctx.body as Partial<Current>;
        try {
            const current = await currentService.updateCurrent(id, currentData);
            ctx.set.status = 200;
            return current;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating current", details: error.message };
        }
    },

    deleteCurrent: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const current = await currentService.deleteCurrent(id);
            ctx.set.status = 200;
            return current;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting current", details: error.message };
        }
    },

    getCurrentById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const current = await currentService.getCurrentById(id);
            if (!current) {
                return ctx.error(404, 'Current not found');
            }
            ctx.set.status = 200;
            return current;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching current", details: error.message };
        }
    },

    getAllCurrents: async (ctx: Context) => {
        try {
            const currents = await currentService.getAllCurrents();
            ctx.set.status = 200;
            return currents;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currents", details: error.message };
        }
    },

    getCurrentsWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Current>;
        try {
            const currents = await currentService.getCurrentsWithFilters(filters);
            ctx.set.status = 200;
            return currents;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currents", details: error.message };
        }
    }

}

export default CurrentController;