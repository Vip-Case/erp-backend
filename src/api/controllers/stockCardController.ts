import { StockCardService } from '../../services/concrete/StockCardService';
import { Context } from 'elysia';
import { StockCard } from '@prisma/client';
import { StockCardRepository } from '../../repositories/concrete/stockCard/StockCardRepository';
import { StockCardAttributeRepository } from '../../repositories/concrete/stockCard/StockCardAttributeRepository';
import { StockCardBarcodeRepository } from '../../repositories/concrete/stockCard/StockCardBarcodeRepository';
import { StockCardCategoryItemsRepository } from '../../repositories/concrete/stockCard/StockCardCategoryItemsRepository';
import { StockCardPriceListItemsRepository } from '../../repositories/concrete/stockCard/StockCardPriceListItemsRepository';
import { StockCardTaxRateRepository } from '../../repositories/concrete/stockCard/StockCardTaxRateRepository';

// Repositories Initialization
const stockCardRepository = new StockCardRepository();
const stockCardAttributeRepository = new StockCardAttributeRepository();
const stockCardBarcodeRepository = new StockCardBarcodeRepository();
const stockCardCategoryItemsRepository = new StockCardCategoryItemsRepository();
const stockCardPriceListItemsRepository = new StockCardPriceListItemsRepository();
const stockCardTaxRateRepository = new StockCardTaxRateRepository();

const stockCardService = new StockCardService(
    stockCardRepository,
    stockCardAttributeRepository,
    stockCardBarcodeRepository,
    stockCardCategoryItemsRepository,
    stockCardPriceListItemsRepository,
    stockCardTaxRateRepository
);

const StockCardController = {
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

    // Yeni bir StockCard oluşturan API
    createStockCard: async (ctx: Context) => {
        const stockCardData: StockCard = ctx.body as StockCard;
        try {
            const newStockCard = await stockCardService.createStockCard(stockCardData);
            ctx.set.status = 201;
            return newStockCard;
        } catch (err) {
            return ctx.error(500, 'Error creating stock card');
        }
    },

    // İlişkili StockCard oluşturan API
    async createStockCardWithRelations(ctx: Context) {
        try {
            // Body'den verileri alıyoruz
            const {
                stockCard,       // Ana StockCard verisi
                attributes,      // İsteğe bağlı Attributes
                barcodes,        // İsteğe bağlı Barcodes
                categoryItems,   // İsteğe bağlı CategoryItems
                priceListItems,  // İsteğe bağlı PriceListItems
                taxRates         // İsteğe bağlı TaxRates
            } = ctx.body as {
                stockCard: StockCard,
                attributes?: any[],
                barcodes?: any[],
                categoryItems?: any[],
                priceListItems?: any[],
                taxRates?: any[]
            };

            // Servisi çağırarak StockCard ve ilişkilerini oluşturuyoruz
            const createdStockCard = await stockCardService.createStockCardWithRelations({
                stockCard,
                attributes,
                barcodes,
                categoryItems,
                priceListItems,
                taxRates
            });

            // Başarılı sonuç durumunda 201 (Created) döndürüyoruz
            ctx.set.status = 201;
            return createdStockCard;

        } catch (error) {
            console.error('Error creating StockCard with relations:', error);

            // Hata durumunda 500 (Internal Server Error) döndürüyoruz
            ctx.set.status = 500;
            return { message: 'Error creating StockCard with relations', error: (error as Error).message };
        }
    },

    // Belirli bir ID ile StockCard'ı güncelleyen API
    updateStockCard: async (ctx: Context) => {
        const { id } = ctx.params;
        const stockCardData: Partial<StockCard> = ctx.body as Partial<StockCard>;
        try {
            const updatedStockCard = await stockCardService.updateStockCard(id, stockCardData);
            ctx.set.status = 200;
            return updatedStockCard;
        } catch (err) {
            return ctx.error(500, `Error updating stock card with ID ${id}`);
        }
    },

    // Belirli bir ID ile StockCard'ı silen API
    deleteStockCard: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const result = await stockCardService.deleteStockCard(id);
            if (!result.success) {
                return ctx.error(404, 'StockCard not found');
            }
            ctx.set.status = 200;
            return { message: 'StockCard successfully deleted' };
        } catch (err) {
            return ctx.error(500, `Error deleting stock card with ID ${id}`);
        }
    }
};

export default StockCardController;
