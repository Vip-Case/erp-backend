
import BanksService from '../../services/concrete/banksService';
import { Context } from 'elysia';
import { Banks } from '@prisma/client';

// Service Initialization
const banksService = new BanksService();

export const BanksController = {

    createBanks: async (ctx: Context) => {
        const banksData: Banks = ctx.body as Banks;
        try {
            const banks = await banksService.createBanks(banksData);
            ctx.set.status = 200;
            return banks;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating banks", details: error.message };
        }
    },

    updateBanks: async (ctx: Context) => {
        const { id } = ctx.params;
        const banksData: Partial<Banks> = ctx.body as Partial<Banks>;
        try {
            const banks = await banksService.updateBanks(id, banksData);
            ctx.set.status = 200;
            return banks;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating banks", details: error.message };
        }
    },

    deleteBanks: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const banks = await banksService.deleteBanks(id);
            ctx.set.status = 200;
            return banks;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting banks", details: error.message };
        }
    },

    getBanksById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const banks = await banksService.getBanksById(id);
            if (!banks) {
                return ctx.error(404, 'banks not found');
            }
            ctx.set.status = 200;
            return banks;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching banks", details: error.message };
        }
    },

    getAllBanks: async (ctx: Context) => {
        try {
            const attributes = await banksService.getAllBanks();
            ctx.set.status = 200;
            return attributes;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching banks", details: error.message };
        }
    }
}

export default BanksController;