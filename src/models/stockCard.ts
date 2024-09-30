import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
    stockCards,
    stockCardPriceLists,
    stockCardPriceListItems,
    stockCardAttributes,
    stockCardBarcodes,
    stockCardCategories,
    stockCardCategoriesItems,
    stockCardVariants,
    stockCardTaxRates,
} from "../data/schema/stockCards";
import mongoose, { Schema, Document } from "mongoose";

export type StockCard = InferSelectModel<typeof stockCards>;
export type NewStockCard = InferInsertModel<typeof stockCards>;

export type StockCardPriceList = InferSelectModel<typeof stockCardPriceLists>;
export type NewStockCardPriceList = InferInsertModel<
    typeof stockCardPriceLists
>;

export type StockCardPriceListItem = InferSelectModel<
    typeof stockCardPriceListItems // Fiyat listesi kalemleri tablosu eklendi
>;
export type NewStockCardPriceListItem = InferInsertModel<
    typeof stockCardPriceListItems // Fiyat listesi kalemleri için insert modeli
>;

export type StockCardAttribute = InferSelectModel<typeof stockCardAttributes>;
export type NewStockCardAttribute = InferInsertModel<
    typeof stockCardAttributes
>;

export type StockCardBarcode = InferSelectModel<typeof stockCardBarcodes>;
export type NewStockCardBarcode = InferInsertModel<typeof stockCardBarcodes>;

export type StockCardCategory = InferSelectModel<typeof stockCardCategories>;
export type NewStockCardCategory = InferInsertModel<typeof stockCardCategories>;

export type StockCardCategoriesItems = InferSelectModel<typeof stockCardCategoriesItems>; // Kategori kalemleri tablosu eklendi
export type NewStockCardCategoriesItems = InferInsertModel<typeof stockCardCategoriesItems>; // Kategori kalemleri için insert modeli

export type StockCardVariant = InferSelectModel<typeof stockCardVariants>;
export type NewStockCardVariant = InferInsertModel<typeof stockCardVariants>;

export type StockCardTaxRate = InferSelectModel<typeof stockCardTaxRates>;
export type NewStockCardTaxRate = InferInsertModel<typeof stockCardTaxRates>;

export interface IStockCardImage extends Document {
    stockCardId: string;
    imageUrl: string;
    isDefault: boolean;
}

export interface IStockCardVideo extends Document {
    stockCardId: string;
    videoUrl: string;
}

const StockCardImageSchema: Schema = new Schema(
    {
        stockCardId: { type: String, required: true, index: true },
        imageUrl: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const StockCardVideoSchema: Schema = new Schema(
    {
        stockCardId: { type: String, required: true, index: true },
        videoUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export const StockCardImage = mongoose.model<IStockCardImage>(
    "StockCardImage",
    StockCardImageSchema
);
export const StockCardVideo = mongoose.model<IStockCardVideo>(
    "StockCardVideo",
    StockCardVideoSchema
);

export type StockCardWithRelations = StockCard & {
    priceLists: StockCardPriceList[];
    attributes: StockCardAttribute[];
    barcodes: StockCardBarcode[];
    categories: StockCardCategory[];
    variants: StockCardVariant[];
    taxRates: StockCardTaxRate[];
    images: IStockCardImage[];
    videos: IStockCardVideo[];
};

export type NewStockCardWithRelations = NewStockCard & {
    priceLists?: NewStockCardPriceList[];
    attributes?: NewStockCardAttribute[];
    barcodes?: NewStockCardBarcode[];
    categories?: NewStockCardCategory[];
    variants?: NewStockCardVariant[];
    taxRates?: NewStockCardTaxRate[];
    images?: IStockCardImage[];
    videos?: IStockCardVideo[];
};
