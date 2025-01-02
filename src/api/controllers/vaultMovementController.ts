
import VaultMovementService from '../../services/concrete/vaultMovementService';
import { Context } from 'elysia';
import { VaultMovement } from '@prisma/client';

// Service Initialization
const vaultMovementService = new VaultMovementService();

export const VaultMovementController = {

    createVaultMovement: async (ctx: Context) => {
        const vaultMovementData: VaultMovement = ctx.body as VaultMovement;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        
        try {
            const vaultMovement = await vaultMovementService.createVaultMovement(vaultMovementData, bearerToken);
            ctx.set.status = 200;
            return vaultMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating vaultMovement", details: error.message };
        }
    },

    updateVaultMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        const vaultMovementData: Partial<VaultMovement> = ctx.body as Partial<VaultMovement>;
        try {
            const vaultMovement = await vaultMovementService.updateVaultMovement(id, vaultMovementData);
            ctx.set.status = 200;
            return vaultMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating vaultMovement", details: error.message };
        }
    },

    deleteVaultMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const vaultMovement = await vaultMovementService.deleteVaultMovement(id);
            ctx.set.status = 200;
            return vaultMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting vaultMovement", details: error.message };
        }
    },

    getVaultMovementById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const vaultMovement = await vaultMovementService.getVaultMovementById(id);
            if (!vaultMovement) {
                return ctx.error(404, 'vaultMovement not found');
            }
            ctx.set.status = 200;
            return vaultMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching vaultMovement", details: error.message };
        }
    },

    getVaultMovementsByVaultId: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const vaultMovements = await vaultMovementService.getVaultMovementsByVaultId(id);
            ctx.set.status = 200;
            return vaultMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching vaultMovements", details: error.message };
        }
    },

    getAllVaultMovements: async (ctx: Context) => {
        try {
            const vaultMovements = await vaultMovementService.getAllVaultMovements();
            ctx.set.status = 200;
            return vaultMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching vaultMovements", details: error.message };
        }
    },
}

export default VaultMovementController;