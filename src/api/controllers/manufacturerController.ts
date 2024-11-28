import { ManufacturerService } from '../../services/concrete/manufacturerService';
import { Context } from 'elysia';
import { StockCardManufacturer } from '@prisma/client';

// Service Initialization
const manufacturerService = new ManufacturerService();

const ManufacturerController = {
    // Manufacturer'ı oluşturan API
    createManufacturer: async (ctx: Context) => {
        const body = ctx.body as StockCardManufacturer;
        try {
            const manufacturer = await manufacturerService.createManufacturer(body);
            ctx.set.status = 200;
            return manufacturer;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating manufacturer", details: error };
        }
    },

    // Manufacturer'ı güncelleyen API
    updateManufacturer: async (ctx: Context) => {
        const { id } = ctx.params;
        const body = ctx.body as Partial<StockCardManufacturer>;
        try {
            const manufacturer = await manufacturerService.updateManufacturer(id, body);
            ctx.set.status = 200;
            return manufacturer;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating manufacturer", details: error.message };
        }
    },

    // Manufacturer'ı silen API
    deleteManufacturer: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const manufacturer = await manufacturerService.deleteManufacturer(id);
            ctx.set.status = 200;
            return manufacturer;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting manufacturer", details: error.message };
        }
    },

    // Belirli bir ID ile Manufacturer'ı getiren API
    getManufacturerById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const manufacturer = await manufacturerService.getManufacturerById(id);
            if (!manufacturer) {
                return ctx.error(404, 'Manufacturer not found');
            }
            ctx.set.status = 200;
            return manufacturer;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching manufacturer", details: error.message };
        }
    },

    // Tüm Manufacturer'ları getiren API
    getAllManufacturers: async (ctx: Context) => {
        try {
            const manufacturers = await manufacturerService.getAllManufacturers();
            ctx.set.status = 200;
            return manufacturers;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching manufacturers", details: error.message };
        }
    }
};

export default ManufacturerController;
