import StockCardService from '../../services/concrete/StockCardService';
import { Context } from 'elysia';
import { StockCard, StockCardAttribute, StockCardBarcode, StockCardCategoryItem, StockCardPriceListItems, StockCardTaxRate, Warehouse } from '@prisma/client';
import { BulkPriceUpdateInput } from '../../types/stockCard';

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
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const stockCard = await stockCardService.createStockCard(stockCardData, warehouseData, bearerToken);
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
        const stockCardData: Partial<StockCard> = ctx.body as Partial<StockCard>;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const stockCard = await stockCardService.updateStockCard(id, stockCardData, bearerToken);
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
            const bearerToken = ctx.request.headers.get("Authorization");
            if (!bearerToken) {
                return ctx.error(401, "Authorization header is missing.");
            }
            const body = ctx.body as any;

            // Servisi çağırarak StockCard ve ilişkilerini oluşturuyoruz
            const createdStockCard = await stockCardService.createStockCardsWithRelations(body, bearerToken);
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
            const bearerToken = ctx.request.headers.get("Authorization");
            if (!bearerToken) {
                return ctx.error(401, "Authorization header is missing.");
            }
            const body = ctx.body as any;
            console.log(body);
            // Servisi çağırarak StockCard ve ilişkilerini güncelliyoruz
            const updatedStockCard = await stockCardService.updateStockCardsWithRelations(id, body, bearerToken);
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
    },

    getStockCardsByWarehouseId: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const stockCards = await stockCardService.getStockCardsByWarehouseId(id);
            ctx.set.status = 200;
            return stockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    searchStockCardsByWarehouseId: async (ctx: Context) => {
        const { id } = ctx.params;
        const criteria = ctx.query as unknown as SearchCriteria;
        try {
            const stockCards = await stockCardService.searchStockCardsByWarehouseId(id, criteria);
            ctx.set.status = 200;
            return stockCards;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    updateStockCardBarcodes: async (ctx: Context) => {
        const data = ctx.body as { stockCardId: string, barcodes: string[] };
        try {
            const updatedBarcodes = await stockCardService.updateStockCardBarcodes(data);
            ctx.set.status = 200;
            return updatedBarcodes;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Barkod güncellemesi sırasında hata oluştu", details: error.message };
        }
    },

    getStockCardBarcodesBySearch: async (ctx: Context) => {
        const { searchTerm } = ctx.body as { searchTerm: string };
        try {
            const barcodes = await stockCardService.getStockCardBarcodesBySearch(searchTerm);
            ctx.set.status = 200;
            return barcodes;
        } catch (error: any) {
            ctx.set.status = error.message === "Stok kartı bulunamadı" ? 404 : 500;
            return { error: "Barkodlar getirilirken hata oluştu", details: error.message };
        }
    },

    bulkUpdatePrices: async (ctx: Context) => {
        try {
            const bearerToken = ctx.request.headers.get("Authorization");
            if (!bearerToken) {
                return ctx.error(401, "Yetkilendirme başlığı eksik");
            }

            const updateData = ctx.body as BulkPriceUpdateInput;

            // Validasyonlar
            if (!updateData.priceListId) {
                return ctx.error(400, "Fiyat listesi ID'si gereklidir");
            }
            if (!updateData.stockCardIds || updateData.stockCardIds.length === 0) {
                return ctx.error(400, "En az bir stok kartı seçilmelidir");
            }
            if (!updateData.updateType) {
                return ctx.error(400, "Güncelleme tipi gereklidir");
            }
            if (updateData.value === undefined || updateData.value === null) {
                return ctx.error(400, "Güncelleme değeri gereklidir");
            }

            const result = await stockCardService.bulkUpdatePrices(updateData, bearerToken);

            if (result.failedCount > 0) {
                ctx.set.status = 207; // Multi-Status
                return {
                    message: "Bazı fiyat güncellemeleri başarısız oldu",
                    ...result
                };
            }

            ctx.set.status = 200;
            return {
                message: "Fiyatlar başarıyla güncellendi",
                ...result
            };
        } catch (error: any) {
            ctx.set.status = 500;
            return {
                error: "Toplu fiyat güncellemesi sırasında hata oluştu",
                details: error.message
            };
        }
    },

    getStockBalanceReport: async (ctx: Context) => {
        try {
            const filter = ctx.body as {
                startDate?: string;
                endDate?: string;
                productCode?: string;
            };

            // Validasyonlar
            if (filter.startDate && isNaN(Date.parse(filter.startDate))) {
                return ctx.error(400, "Geçersiz başlangıç tarihi formatı");
            }

            if (filter.endDate && isNaN(Date.parse(filter.endDate))) {
                return ctx.error(400, "Geçersiz bitiş tarihi formatı");
            }

            // Tarih string'lerini Date objesine çevirme
            const reportFilter = {
                ...(filter.startDate && { startDate: new Date(filter.startDate) }),
                ...(filter.endDate && { endDate: new Date(filter.endDate) }),
                ...(filter.productCode && { productCode: filter.productCode })
            };

            const report = await stockCardService.getStockBalanceReport(reportFilter);
            ctx.set.status = 200;
            return report;
        } catch (error: any) {
            ctx.set.status = 500;
            return {
                error: "Stok bakiye raporu oluşturulurken hata oluştu",
                details: error.message
            };
        }
    }
}

export default StockCardController;