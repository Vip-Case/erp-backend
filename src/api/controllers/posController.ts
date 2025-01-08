
import PosService from '../../services/concrete/posService';
import { Context } from 'elysia';
import { Pos } from '@prisma/client';

// Service Initialization
const posService = new PosService();

export const PosController = {

    createPos: async (ctx: Context) => {
        const posData: Pos = ctx.body as Pos;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const pos = await posService.createPos(posData, bearerToken);
            ctx.set.status = 200;
            return pos;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating pos", details: error.message };
        }
    },

    updatePos: async (ctx: Context) => {
        const { id } = ctx.params;
        const posData: Partial<Pos> = ctx.body as Partial<Pos>;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const pos = await posService.updatePos(id, posData, bearerToken);
            ctx.set.status = 200;
            return pos;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating pos", details: error.message };
        }
    },

    deletePos: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const pos = await posService.deletePos(id);
            ctx.set.status = 200;
            return pos;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting pos", details: error.message };
        }
    },

    getPosById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const pos = await posService.getPosById(id);
            if (!pos) {
                return ctx.error(404, 'pos not found');
            }
            ctx.set.status = 200;
            return pos;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching pos", details: error.message };
        }
    },

    getAllPoss: async (ctx: Context) => {
        try {
            const poss = await posService.getAllPoss();
            ctx.set.status = 200;
            return poss;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching poss", details: error.message };
        }
    },
}

export default PosController;