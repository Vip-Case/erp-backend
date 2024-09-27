import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { stockCards, stockCardPriceLists, stockCardAttributes, stockCardBarcodes, stockCardCategories, stockCardVariants, stockCardTaxRates } from '../data/schema/stockCards';

export type StockCard = InferSelectModel<typeof stockCards>;
export type NewStockCard = InferInsertModel<typeof stockCards>;

export type StockCardPriceList = InferSelectModel<typeof stockCardPriceLists>;
export type NewStockCardPriceList = InferInsertModel<typeof stockCardPriceLists>;

export type StockCardAttribute = InferSelectModel<typeof stockCardAttributes>;
export type NewStockCardAttribute = InferInsertModel<typeof stockCardAttributes>;

export type StockCardBarcode = InferSelectModel<typeof stockCardBarcodes>;
export type NewStockCardBarcode = InferInsertModel<typeof stockCardBarcodes>;

export type StockCardCategory = InferSelectModel<typeof stockCardCategories>;
export type NewStockCardCategory = InferInsertModel<typeof stockCardCategories>;

export type StockCardVariant = InferSelectModel<typeof stockCardVariants>;
export type NewStockCardVariant = InferInsertModel<typeof stockCardVariants>;

export type StockCardTaxRate = InferSelectModel<typeof stockCardTaxRates>;
export type NewStockCardTaxRate = InferInsertModel<typeof stockCardTaxRates>;

export type StockCardWithRelations = StockCard & {
    priceLists: StockCardPriceList[];
    attributes: StockCardAttribute[];
    barcodes: StockCardBarcode[];
    categories: StockCardCategory[];
    variants: StockCardVariant[];
    taxRates: StockCardTaxRate[];
    };

export type NewStockCardWithRelations = NewStockCard & {
    priceLists?: NewStockCardPriceList[];
    attributes?: NewStockCardAttribute[];
    barcodes?: NewStockCardBarcode[];
    categories?: NewStockCardCategory[];
    variants?: NewStockCardVariant[];
    taxRates?: NewStockCardTaxRate[];
    };

