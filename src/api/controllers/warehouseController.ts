
import WarehouseService from '../../services/concrete/warehouseService';
import { Context } from 'elysia';
import { Warehouse } from '@prisma/client';

export interface StocktakeWarehouse {
    id: string;
    warehouseId: string;
    products: Array<{
        stockCardId: string;
        quantity: number;
    }>
}

// Service Initialization
const warehouseService = new WarehouseService();

export const WarehouseController = {

    createWarehouse: async (ctx: Context) => {
        const warehouseData: Warehouse = ctx.body as Warehouse;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const warehouse = await warehouseService.createWarehouse(warehouseData, bearerToken);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating warehouse", details: error.message };
        }
    },

    updateWarehouse: async (ctx: Context) => {
        const { id } = ctx.params;
        const warehouseData: Partial<Warehouse> = ctx.body as Partial<Warehouse>;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const warehouse = await warehouseService.updateWarehouse(id, warehouseData, bearerToken);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating warehouse", details: error.message };
        }
    },

    deleteWarehouse: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const warehouse = await warehouseService.deleteWarehouse(id);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting warehouse", details: error.message };
        }
    },

    getWarehouseById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const warehouse = await warehouseService.getWarehouseById(id);
            if (!warehouse) {
                return ctx.error(404, 'Warehouse not found');
            }
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching warehouse", details: error.message };
        }
    },

    getAllWarehouses: async (ctx: Context) => {
        try {
            const warehouses = await warehouseService.getAllWarehouses();
            ctx.set.status = 200;
            return warehouses;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching warehouses", details: error.message };
        }
    },

    getWarehousesWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Warehouse>;
        try {
            const warehouses = await warehouseService.getWarehousesWithFilters(filters);
            ctx.set.status = 200;
            return warehouses;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching warehouses", details: error.message };
        }
    },

    createStocktakeWarehouse: async (ctx: Context) => {
        const stockTakeData: StocktakeWarehouse = ctx.body as StocktakeWarehouse;
        try {
            const warehouse = await warehouseService.createStocktakeWarehouse(stockTakeData);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating stocktake warehouse", details: error.message };
        }
    },

    updateStocktakeWarehouse: async (ctx: Context) => {
        const { id } = ctx.params;
        const stockTakeData: StocktakeWarehouse = ctx.body as StocktakeWarehouse;
        try {
            const warehouse = await warehouseService.updateStocktakeWarehouse(id, stockTakeData);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating stocktake warehouse", details: error.message };
        }
    },

    deleteStocktakeWarehouse: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const warehouse = await warehouseService.deleteStocktakeWarehouse(id);
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting stocktake warehouse", details: error.message };
        }
    },

    getStocktakeWarehouseById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const warehouse = await warehouseService.getStocktakeWarehouseById(id);
            if (!warehouse) {
                return ctx.error(404, 'Stocktake warehouse not found');
            }
            ctx.set.status = 200;
            return warehouse;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stocktake warehouse", details: error.message };
        }
    },

    getAllStocktakeWarehouses: async (ctx: Context) => {
        try {
            const warehouses = await warehouseService.getStocktakeWarehouses();
            ctx.set.status = 200;
            return warehouses;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stocktake warehouses", details: error.message };
        }
    }
}

export default WarehouseController;