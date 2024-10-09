
import PriceListService from '../../services/concrete/priceListService';
import { Context } from 'elysia';
import { StockCardPriceList } from '@prisma/client';

// Service Initialization
const priceListService = new PriceListService();

export const PriceListController = {

    createPriceList: async (ctx: Context) => {
        const priceListData: StockCardPriceList = ctx.body as StockCardPriceList;
        try {
            const priceList = await priceListService.createPriceList(priceListData);
            ctx.set.status = 200;
            return priceList;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating price list", details: error.message };
        }
    },

    updatePriceList: async (ctx: Context) => {
        const { id } = ctx.params;
        const priceListData: Partial<StockCardPriceList> = ctx.body as Partial<StockCardPriceList>;
        try {
            const priceList = await priceListService.updatePriceList(id, priceListData);
            ctx.set.status = 200;
            return priceList;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating price list", details: error.message };
        }
    },

    deletePriceList: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const priceList = await priceListService.deletePriceList(id);
            ctx.set.status = 200;
            return priceList;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting price list", details: error.message };
        }
    },

    getPriceListById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const priceList = await priceListService.getPriceListById(id);
            if (!priceList) {
                return ctx.error(404, 'PriceList not found');
            }
            ctx.set.status = 200;
            return priceList;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching price list", details: error.message };
        }
    },

    getAllPriceLists: async (ctx: Context) => {
        try {
            const priceList = await priceListService.getAllPriceLists();
            ctx.set.status = 200;
            return priceList;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching price list", details: error.message };
        }
    }
}

export default PriceListController;