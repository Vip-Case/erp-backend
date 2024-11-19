
import CurrentMovementService from '../../services/concrete/currentMovementService';
import { Context } from 'elysia';
import { CurrentMovement } from '@prisma/client';

// Service Initialization
const currentMovementService = new CurrentMovementService();

export const CurrentMovementController = {

    createCurrentMovement: async (ctx: Context) => {
        const currentMovementData: CurrentMovement = ctx.body as CurrentMovement;
        try {
            const currentMovement = await currentMovementService.createCurrentMovement(currentMovementData);
            ctx.set.status = 200;
            return currentMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating currentMovement", details: error.message };
        }
    },

    updateCurrentMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        const currentMovementData: Partial<CurrentMovement> = ctx.body as Partial<CurrentMovement>;
        try {
            const currentMovement = await currentMovementService.updateCurrentMovement(id, currentMovementData);
            ctx.set.status = 200;
            return currentMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating currentMovement", details: error.message };
        }
    },

    deleteCurrentMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const currentMovement = await currentMovementService.deleteCurrentMovement(id);
            ctx.set.status = 200;
            return currentMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting currentMovement", details: error.message };
        }
    },

    getCurrentMovementById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const currentMovement = await currentMovementService.getCurrentMovementById(id);
            if (!currentMovement) {
                return ctx.error(404, 'CurrentMovement not found');
            }
            ctx.set.status = 200;
            return currentMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentMovement", details: error.message };
        }
    },

    getAllCurrentMovements: async (ctx: Context) => {
        try {
            const currentMovements = await currentMovementService.getAllCurrentMovements();
            if (!currentMovements) {
                return ctx.error(404, 'CurrentMovements not found');
            }
            ctx.set.status = 200;
            return currentMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentMovements", details: error.message };
        }
    },

    getAllCurrentMovementsWithCurrents: async (ctx: Context) => {
        try {
            const currentMovements = await currentMovementService.getAllCurrentMovementsWithCurrents();
            if (!currentMovements) {
                return ctx.error(404, 'CurrentMovements not found');
            }
            ctx.set.status = 200;
            return currentMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentMovements", details: error.message };
        }
    },

    getCurrentMovementsWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<CurrentMovement>;
        try {
            const currentMovements = await currentMovementService.getCurrentMovementsWithFilters(filters);
            if (!currentMovements) {
                return ctx.error(404, 'CurrentMovements not found');
            }
            ctx.set.status = 200;
            return currentMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentMovements", details: error.message };
        }
    }
}

export default CurrentMovementController;