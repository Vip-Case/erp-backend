import StockCardService from '../../services/concrete/StockCardService';
import { Context } from 'elysia';
import { StockCard, StockCardAttribute, StockCardBarcode, StockCardCategoryItem, StockCardPriceListItems, StockCardTaxRate, Warehouse } from '@prisma/client';

interface SearchCriteria {
    search: string;
}

// Service Initialization
const stockCardService = new StockCardService();

const StockCardController = {
    // StockCard'ı oluşturan API
    createStockCard: async (ctx: Context) => {
        const body = ctx.body as { stockCard: StockCard, warehouseIds: string[] | null };
        const stockCardData: StockCard = body.stockCard;
        const warehouseData: string[] = body.warehouseIds !== null ? body.warehouseIds : [];

        try {
            const stockCard = await stockCardService.createStockCard(stockCardData, warehouseData);
            ctx.set.status = 200;
            return stockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating stock card", details: error };
        }
    },

    // StockCard'ı güncelleyen API
    updateStockCard: async (ctx: Context) => {
        const { id } = ctx.params;
        const stockCardData: Partial<StockCard> = ctx.body as Partial<StockCard>;;
        try {
            const stockCard = await stockCardService.updateStockCard(id, stockCardData);
            ctx.set.status = 200;
            return stockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating stock card", details: error.message };
        }
    },

    // StockCard'ı silen API
    deleteStockCard: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockCard = await stockCardService.deleteStockCard(id);
            ctx.set.status = 200;
            return stockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting stock card", details: error.message };
        }
    },

    // Belirli bir ID ile StockCard'ı getiren API
    getStockCardById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockCard = await stockCardService.getStockCardById(id);
            if (!stockCard) {
                return ctx.error(404, 'StockCard not found');
            }
            ctx.set.status = 200;
            return stockCard;
        } catch (err) {
            return ctx.error(500, `Error fetching stock card with ID ${id}`);
        }
    },

    // Tüm StockCard'ları getiren API
    getAllStockCards: async (ctx: Context) => {
        try {
            const stockCards = await stockCardService.getAllStockCards();
            ctx.set.status = 200;
            return stockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    // Tüm StockCard'ları ilişkili tabloları ile oluşturan API
    createStockCardsWithRelations: async (ctx: Context) => {
        try {
            const body = ctx.body as any;

            // Servisi çağırarak StockCard ve ilişkilerini oluşturuyoruz
            const createdStockCard = await stockCardService.createStockCardsWithRelations(body);
            ctx.set.status = 200;
            return createdStockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    // Belirli bir ID ile StockCard'ı ilişkili tabloları ile güncelleyen API
    updateStockCardsWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const body = ctx.body as any;
            console.log(body);
            // Servisi çağırarak StockCard ve ilişkilerini güncelliyoruz
            const updatedStockCard = await stockCardService.updateStockCardsWithRelations(id, body);
            ctx.set.status = 200;
            return updatedStockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    // Belirli bir ID ile StockCard'ı ilişkili tabloları ile silen API
    deleteStockCardsWithRelations: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const deletedStockCard = await stockCardService.deleteStockCardsWithRelations(id);
            ctx.set.status = 200;
            return deletedStockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    deleteManyStockCardsWithRelations: async (ctx: Context) => {
        try {
            const body = ctx.body as any;
            const deletedStockCards = await stockCardService.deleteManyStockCardsWithRelations(body.ids);
            ctx.set.status = 200;
            return deletedStockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    // Belirli bir ID ile StockCard'ı ilişkili tabloları ile getiren API
    getStockCardsWithRelationsById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockCard = await stockCardService.getStockCardsWithRelationsById(id);
            ctx.set.status = 200;
            return stockCard;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock card", details: error.message };
        }
    },

    // Tüm StockCard'ları ilişkili tabloları ile getiren API
    getAllStockCardsWithRelations: async (ctx: Context) => {
        try {
            const stockCards = await stockCardService.getAllStockCardsWithRelations();
            ctx.set.status = 200;
            return stockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    searchStockCards: async (ctx: Context) => {
        const criteria = ctx.query as unknown as SearchCriteria;
        try {
            const stockCards = await stockCardService.searchStockCards(criteria);
            ctx.set.status = 200;
            return stockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    }
}

export default StockCardController;