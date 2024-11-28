
import PosMovementService from '../../services/concrete/posMovementService';
import { Context } from 'elysia';
import { PosMovement } from '@prisma/client';

// Service Initialization
const posMovementService = new PosMovementService();

export const PosMovementController = {

    createPosMovement: async (ctx: Context) => {
        const posMovementData: PosMovement = ctx.body as PosMovement;
        try {
            const posMovement = await posMovementService.createPosMovement(posMovementData);
            ctx.set.status = 200;
            return posMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating posMovement", details: error.message };
        }
    },

    updatePosMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        const posMovementData: Partial<PosMovement> = ctx.body as Partial<PosMovement>;
        try {
            const posMovement = await posMovementService.updatePosMovement(id, posMovementData);
            ctx.set.status = 200;
            return posMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating posMovement", details: error.message };
        }
    },

    deletePosMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const posMovement = await posMovementService.deletePosMovement(id);
            ctx.set.status = 200;
            return posMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting posMovement", details: error.message };
        }
    },

    getPosMovementById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const posMovement = await posMovementService.getPosMovementById(id);
            if (!posMovement) {
                return ctx.error(404, 'posMovement not found');
            }
            ctx.set.status = 200;
            return posMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching posMovement", details: error.message };
        }
    },

    getPosMovementsByPosId: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const posMovements = await posMovementService.getPosMovementsByPosId(id);
            ctx.set.status = 200;
            return posMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching posMovements", details: error.message };
        }
    },

    getAllPosMovements: async (ctx: Context) => {
        try {
            const posMovements = await posMovementService.getAllPosMovements();
            ctx.set.status = 200;
            return posMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching posMovements", details: error.message };
        }
    },
}

export default PosMovementController;