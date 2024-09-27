import {
  StockCard,
  StockCardAttribute,
  StockCardBarcode,
  StockCardCategory,
  StockCardPriceList,
  StockCardTaxRate,
  StockCardVariant,
  StockCardWithRelations,
} from "../../models/stockCard";
import { IStockCardImage, IStockCardVideo } from "../../models/stockCardMedia"; 

// StockCardRepository interface
export interface IStockCardRepository {
    // StockCard operations
    createStockCard(stockCard: StockCard): Promise<StockCard>;
    deleteStockCard(stockCardId: string): Promise<boolean>;
    findStockCardById(stockCardId: string): Promise<StockCardWithRelations | null>;
    updateStockCard(stockCard: StockCard): Promise<StockCard>;
    findAllStockCards(): Promise<StockCardWithRelations[]>;

    // StockCardAttribute operations
    createStockCardAttribute(stockCardAttribute: StockCardAttribute): Promise<StockCardAttribute>;
    deleteStockCardAttribute(stockCardAttributeId: string): Promise<boolean>;
    findStockCardAttributeById(stockCardAttributeId: string): Promise<StockCardAttribute | null>;
    updateStockCardAttribute(stockCardAttribute: StockCardAttribute): Promise<StockCardAttribute>;

    // StockCardBarcode operations
    createStockCardBarcode(stockCardBarcode: StockCardBarcode): Promise<StockCardBarcode>;
    deleteStockCardBarcode(stockCardBarcodeId: string): Promise<boolean>;
    findStockCardBarcodeById(stockCardBarcodeId: string): Promise<StockCardBarcode | null>;
    updateStockCardBarcode(stockCardBarcode: StockCardBarcode): Promise<StockCardBarcode>;

    // StockCardCategory operations
    createStockCardCategory(stockCardCategory: StockCardCategory): Promise<StockCardCategory>;
    deleteStockCardCategory(stockCardCategoryId: string): Promise<boolean>;
    findStockCardCategoryById(stockCardCategoryId: string): Promise<StockCardCategory | null>;
    updateStockCardCategory(stockCardCategory: StockCardCategory): Promise<StockCardCategory>;

    // StockCardPriceList operations
    createStockCardPriceList(stockCardPriceList: StockCardPriceList): Promise<StockCardPriceList>;
    deleteStockCardPriceList(stockCardPriceListId: string): Promise<boolean>;
    findStockCardPriceListById(stockCardPriceListId: string): Promise<StockCardPriceList | null>;
    updateStockCardPriceList(stockCardPriceList: StockCardPriceList): Promise<StockCardPriceList>;

    // StockCardTaxRate operations
    createStockCardTaxRate(stockCardTaxRate: StockCardTaxRate): Promise<StockCardTaxRate>;
    deleteStockCardTaxRate(stockCardTaxRateId: string): Promise<boolean>;
    findStockCardTaxRateById(stockCardTaxRateId: string): Promise<StockCardTaxRate | null>;
    updateStockCardTaxRate(stockCardTaxRate: StockCardTaxRate): Promise<StockCardTaxRate>;

    // StockCardVariant operations
    createStockCardVariant(stockCardVariant: StockCardVariant): Promise<StockCardVariant>;
    deleteStockCardVariant(stockCardVariantId: string): Promise<boolean>;
    findStockCardVariantById(stockCardVariantId: string): Promise<StockCardVariant | null>;
    updateStockCardVariant(stockCardVariant: StockCardVariant): Promise<StockCardVariant>;

    // StockCardImage operations
    createStockCardImage(stockCardImage: IStockCardImage): Promise<IStockCardImage>;
    deleteStockCardImage(stockCardImageId: string): Promise<boolean>;
    findStockCardImageById(stockCardImageId: string): Promise<IStockCardImage | null>;
    updateStockCardImage(stockCardImage: IStockCardImage): Promise<IStockCardImage>;

    // StockCardVideo operations
    createStockCardVideo(stockCardVideo: IStockCardVideo): Promise<IStockCardVideo>;
    deleteStockCardVideo(stockCardVideoId: string): Promise<boolean>;
    findStockCardVideoById(stockCardVideoId: string): Promise<IStockCardVideo | null>;
    updateStockCardVideo(stockCardVideo: IStockCardVideo): Promise<IStockCardVideo>;
}

