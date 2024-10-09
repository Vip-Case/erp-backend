
import WarehouseService from '../../services/concrete/warehouseService';
import { Context } from 'elysia';
import { Warehouse } from '@prisma/client';

// Service Initialization
const warehouseService = new WarehouseService();

export const WarehouseController = {

    createWarehouse: async (ctx: Context) => {
        const warehouseData: Warehouse = ctx.body as Warehouse;
        try {
            const warehouse = await warehouseService.createWarehouse(warehouseData);
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
        try {
            const warehouse = await warehouseService.updateWarehouse(id, warehouseData);
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
    }
}

export default WarehouseController;