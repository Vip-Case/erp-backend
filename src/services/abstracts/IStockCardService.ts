import { IBaseService } from '../../interfaces/services/IBaseService';
import {
    StockCard,
    StockCardWithRelations,
    StockCardAttribute,
    StockCardBarcode,
    StockCardCategory,
    StockCardPriceList,
    StockCardTaxRate,
    StockCardVariant
} from '../../models/stockCard';
import { IStockCardImage, IStockCardVideo } from '../../models/stockCardMedia';

export interface IStockCardService extends IBaseService<StockCard> {
    createStockCard(stockCard: StockCard): Promise<StockCard>;
    getStockCardById(id: string): Promise<StockCardWithRelations>;
    updateStockCard(id: string, stockCard: StockCard): Promise<StockCard>;
    deleteStockCard(id: string): Promise<void>;
    listStockCards(filters?: FilterOptions): Promise<StockCard[]>;
}

export interface FilterOptions {
    limit?: number;
    offset?: number;
    order?: string;
    where?: object;
}