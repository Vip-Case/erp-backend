
import BankMovementService from '../../services/concrete/bankMovementService';
import { Context } from 'elysia';
import { BankMovement } from '@prisma/client';

// Service Initialization
const bankMovementService = new BankMovementService();

export const BankMovementController = {

    createBankMovement: async (ctx: Context) => {
        const bankMovementData: BankMovement = ctx.body as BankMovement;
        try {
            const bankMovement = await bankMovementService.createBankMovement(bankMovementData);
            ctx.set.status = 200;
            return bankMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating bankMovement", details: error.message };
        }
    },

    updateBankMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        const bankMovementData: Partial<BankMovement> = ctx.body as Partial<BankMovement>;
        try {
            const bankMovement = await bankMovementService.updateBankMovement(id, bankMovementData);
            ctx.set.status = 200;
            return bankMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating bankMovement", details: error.message };
        }
    },

    deleteBankMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const bankMovement = await bankMovementService.deleteBankMovement(id);
            ctx.set.status = 200;
            return bankMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting bankMovement", details: error.message };
        }
    },

    getBankMovementById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const bankMovement = await bankMovementService.getBankMovementById(id);
            if (!bankMovement) {
                return ctx.error(404, 'bankMovement not found');
            }
            ctx.set.status = 200;
            return bankMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching bankMovement", details: error.message };
        }
    },

    getBankMovementsByBankId: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const bankMovements = await bankMovementService.getBankMovementsByBankId(id);
            ctx.set.status = 200;
            return bankMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching bankMovements", details: error.message };
        }
    },

    getAllBankMovements: async (ctx: Context) => {
        try {
            const bankMovements = await bankMovementService.getAllBankMovements();
            ctx.set.status = 200;
            return bankMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching bankMovements", details: error.message };
        }
    },
}

export default BankMovementController;