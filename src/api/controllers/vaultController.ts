
import VaultService from '../../services/concrete/vaultService';
import { Context } from 'elysia';
import { Vault } from '@prisma/client';

// Service Initialization
const vaultService = new VaultService();

export const VaultController = {

    createVault: async (ctx: Context) => {
        const vaultData: Vault = ctx.body as Vault;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        try {
            const vault = await vaultService.createVault(vaultData, bearerToken);
            ctx.set.status = 200;
            return vault;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating vault", details: error.message };
        }
    },

    updateVault: async (ctx: Context) => {
        const { id } = ctx.params;
        const vaultData: Partial<Vault> = ctx.body as Partial<Vault>;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        try {
            const vault = await vaultService.updateVault(id, vaultData, bearerToken);
            ctx.set.status = 200;
            return vault;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating vault", details: error.message };
        }
    },

    deleteVault: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const vault = await vaultService.deleteVault(id);
            ctx.set.status = 200;
            return vault;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting vault", details: error.message };
        }
    },

    getVaultById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const vault = await vaultService.getVaultById(id);
            if (!vault) {
                return ctx.error(404, 'vault not found');
            }
            ctx.set.status = 200;
            return vault;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching vault", details: error.message };
        }
    },

    getAllVaults: async (ctx: Context) => {
        try {
            const vaults = await vaultService.getAllVaults();
            ctx.set.status = 200;
            return vaults;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching vaults", details: error.message };
        }
    },
}

export default VaultController;