
import AttributeService from '../../services/concrete/attributeService';
import { Context } from 'elysia';
import { StockCardAttribute } from '@prisma/client';

// Service Initialization
const attributeService = new AttributeService();

export const AttributeController = {

    createAttribute: async (ctx: Context) => {
        const attributeData: StockCardAttribute = ctx.body as StockCardAttribute;
        try {
            const attribute = await attributeService.createAttribute(attributeData);
            ctx.set.status = 200;
            return attribute;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating attribute", details: error.message };
        }
    },

    updateAttribute: async (ctx: Context) => {
        const { id } = ctx.params;
        const attributeData: Partial<StockCardAttribute> = ctx.body as Partial<StockCardAttribute>;
        try {
            const attribute = await attributeService.updateAttribute(id, attributeData);
            ctx.set.status = 200;
            return attribute;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating attribute", details: error.message };
        }
    },

    deleteAttribute: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const attribute = await attributeService.deleteAttribute(id);
            ctx.set.status = 200;
            return attribute;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting attribute", details: error.message };
        }
    },

    getAttributeById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const attribute = await attributeService.getAttributeById(id);
            if (!attribute) {
                return ctx.error(404, 'Attribute not found');
            }
            ctx.set.status = 200;
            return attribute;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching attribute", details: error.message };
        }
    },

    getAllAttributes: async (ctx: Context) => {
        try {
            const attributes = await attributeService.getAllAttributes();
            ctx.set.status = 200;
            return attributes;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching attributes", details: error.message };
        }
    }
}

export default AttributeController;