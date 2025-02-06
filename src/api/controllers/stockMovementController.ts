import StockMovementService from '../../services/concrete/stockMovementService';
import { Context } from 'elysia';
import { StockMovement } from '@prisma/client';

// Service Initialization
const stockMovementService = new StockMovementService();

export const StockMovementController = {

    createStockMovement: async (ctx: Context) => {
        const stockMovementData: StockMovement = ctx.body as StockMovement;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        try {
            const stockMovement = await stockMovementService.createStockMovement(stockMovementData, bearerToken);
            ctx.set.status = 200;
            return stockMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating stockMovement", details: error.message };
        }
    },

    updateStockMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        const bearerToken = ctx.request.headers.get("Authorization");
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        const stockMovementData: Partial<StockMovement> = ctx.body as Partial<StockMovement>;
        try {
            const stockMovement = await stockMovementService.updateStockMovement(id, stockMovementData, bearerToken);
            ctx.set.status = 200;
            return stockMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating stockMovement", details: error.message };
        }
    },

    deleteStockMovement: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockMovement = await stockMovementService.deleteStockMovement(id);
            ctx.set.status = 200;
            return stockMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting stockMovement", details: error.message };
        }
    },

    getStockMovementById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockMovement = await stockMovementService.getStockMovementById(id);
            if (!stockMovement) {
                return ctx.error(404, 'StockMovement not found');
            }
            ctx.set.status = 200;
            return stockMovement;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovement", details: error.message };
        }
    },

    getAllStockMovements: async (ctx: Context) => {
        try {
            const stockMovements = await stockMovementService.getAllStockMovements();
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllOrderStockMovements: async (ctx: Context) => {
        try {
            const stockMovements = await stockMovementService.getAllOrderStockMovements();
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllOrderStockMovementsByStockCardId: async (ctx: Context) => {
        const { stockCardId } = ctx.params;
        try {
            const stockMovements = await stockMovementService.getAllOrderStockMovementsByStockCardId(stockCardId);
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllSalesStockMovements: async (ctx: Context) => {
        try {
            const stockMovements = await stockMovementService.getAllSalesStockMovements();
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllSalesStockMovementsByStockCardId: async (ctx: Context) => {
        const { stockCardId } = ctx.params;
        try {
            const stockMovements = await stockMovementService.getAllSalesStockMovementsByStockCardId(stockCardId);
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllPurchaseStockMovements: async (ctx: Context) => {
        try {
            const stockMovements = await stockMovementService.getAllPurchaseStockMovements();
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllPurchaseStockMovementsByStockCardId: async (ctx: Context) => {
        const { stockCardId } = ctx.params;
        try {
            const stockMovements = await stockMovementService.getAllPurchaseStockMovementsByStockCardId(stockCardId);
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllStockMovementsByStockCardCode: async (ctx: Context) => {
        const { stockCardCode } = ctx.params;
        try {
            const stockMovements = await stockMovementService.getAllStockMovementsByStockCardCode(stockCardCode);
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    },

    getAllStockMovementsByStockCardId: async (ctx: Context) => {
        const { stockCardId } = ctx.params;
        try {
            const stockMovements = await stockMovementService.getAllStockMovementsByStockCardId(stockCardId);
            ctx.set.status = 200;
            return stockMovements;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stockMovements", details: error.message };
        }
    }
}

export default StockMovementController;