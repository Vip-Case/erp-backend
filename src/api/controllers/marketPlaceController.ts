import MarketPlaceService from '../../services/concrete/marketPlaceService';
import { Context } from 'elysia';
import { MarketPlace } from '@prisma/client';
import { Prisma } from '@prisma/client';


export const MarketPlaceController = {

    createMarketPlace: async (ctx: Context) => {
        const marketPlaceData = ctx.body as Prisma.MarketPlaceCreateInput;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const marketPlace = await new MarketPlaceService().createMarketPlace(marketPlaceData, bearerToken);
            ctx.set.status = 200;
            return marketPlace;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating MarketPlace", details: error.message };
        }
    },

    updateMarketPlace: async (ctx: Context) => {
        const { id } = ctx.params;
        const marketPlaceData = ctx.body as Prisma.MarketPlaceUpdateInput;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        try {
            const marketPlace = await new MarketPlaceService().updateMarketPlace(id, marketPlaceData, bearerToken);
            ctx.set.status = 200;
            return marketPlace;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating MarketPlace", details: error.message };
        }
    },

    deleteMarketPlace: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            await new MarketPlaceService().deleteMarketPlace(id);
            ctx.set.status = 200;
            return { message: "MarketPlace deleted successfully" };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting MarketPlace", details: error.message };
        }
    },

    getMarketPlaceById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const marketPlace = await new MarketPlaceService().getMarketPlaceById(id);
            if (!marketPlace) {
                return ctx.error(404, 'MarketPlace not found');
            }
            ctx.set.status = 200;
            return marketPlace;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching MarketPlace", details: error.message };
        }
    },

    getAllMarketPlaces: async (ctx: Context) => {
        try {
            const marketPlaces = await new MarketPlaceService().getAllMarketPlaces();
            ctx.set.status = 200;
            return marketPlaces;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching MarketPlaces", details: error.message };
        }
    }
};