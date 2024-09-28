import { eq } from "drizzle-orm";
import { db } from "../../../config/database";
import {
    stockCards,
    stockCardPriceLists,
    stockCardAttributes,
    stockCardBarcodes,
    stockCardCategories,
    stockCardVariants,
    stockCardTaxRates,
} from "../../../data/schema/stockCards";
import { StockCardImage, StockCardVideo } from "../../../models/stockCardMedia";
import { IStockCardRepository } from "../../abstracts/IStockCardRepository";
import {
    StockCard,
    StockCardAttribute,
    StockCardBarcode,
    StockCardCategory,
    StockCardPriceList,
    StockCardTaxRate,
    StockCardVariant,
    StockCardWithRelations,
} from "../../../models/stockCard";
import {
    IStockCardImage,
    IStockCardVideo,
} from "../../../models/stockCardMedia";

// StockCardRepository class
export class StockCardRepository implements IStockCardRepository {

    async createStockCard(stockCard: StockCard): Promise<StockCard> {
        try {
            const [createdStockCard] = await db.insert(stockCards).values(stockCard).returning();
            return createdStockCard;
        } catch (error) {
            console.error("Error creating stock card:", error);
            throw new Error("Failed to create stock card");
        }
    }

    async deleteStockCard(stockCardId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCards).where(eq(stockCards.id, stockCardId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card:", error);
            throw new Error("Failed to delete stock card");
        }
    }

    async findStockCardById(stockCardId: string): Promise<StockCardWithRelations | null> {
        try {
            const stockCard = await db.select().from(stockCards).where(eq(stockCards.id, stockCardId)).execute();
            if (stockCard.length === 0) return null;

            const [attributes, barcodes, categories, priceLists, taxRates, variants] = await Promise.all([
                db.select().from(stockCardAttributes).where(eq(stockCardAttributes.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardBarcodes).where(eq(stockCardBarcodes.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardCategories).where(eq(stockCardCategories.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardPriceLists).where(eq(stockCardPriceLists.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardTaxRates).where(eq(stockCardTaxRates.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardVariants).where(eq(stockCardVariants.stockCardId, stockCardId)).execute(),
            ]);

            const images = await StockCardImage.find({ stockCardId }).exec();
            const videos = await StockCardVideo.find({ stockCardId }).exec();

            return { 
                ...stockCard[0], 
                attributes, 
                barcodes, 
                categories, 
                priceLists, 
                taxRates, 
                variants,
                images,
                videos
            };
        } catch (error) {
            console.error("Error finding stock card by ID:", error);
            throw new Error("Failed to find stock card by ID");
        }
    }

    async updateStockCard(stockCard: StockCard): Promise<StockCard> {
        try {
            const [updatedStockCard] = await db.update(stockCards).set(stockCard).where(eq(stockCards.id, stockCard.id)).returning();
            return updatedStockCard;
        } catch (error) {
            console.error("Error updating stock card:", error);
            throw new Error("Failed to update stock card");
        }
    }

    async findAllStockCards(): Promise<StockCardWithRelations[]> {
        try {
            const stockCardsList = await db.select().from(stockCards).execute();
            const stockCardsWithRelations = await Promise.all(
                stockCardsList.map(stockCard => this.findStockCardById(stockCard.id))
            );
            return stockCardsWithRelations.filter((card): card is StockCardWithRelations => card !== null);
        } catch (error) {
            console.error("Error finding all stock cards:", error);
            throw new Error("Failed to find all stock cards");
        }
    }

    async createStockCardsWithRelations(stockCard: StockCardWithRelations): Promise<StockCardWithRelations> {
        try {
            const createdStockCard = await this.createStockCard(stockCard);
            const stockCardId = createdStockCard.id;

            const { attributes, barcodes, categories, priceLists, taxRates, variants } = stockCard;

            await Promise.all([
                ...(attributes?.map(attr => this.createStockCardAttribute({ ...attr, stockCardId })) || []),
                ...(barcodes?.map(barcode => this.createStockCardBarcode({ ...barcode, stockCardId })) || []),
                ...(categories?.map(category => this.createStockCardCategory({ ...category, stockCardId })) || []),
                ...(priceLists?.map(priceList => this.createStockCardPriceList({ ...priceList, stockCardId })) || []),
                ...(taxRates?.map(taxRate => this.createStockCardTaxRate({ ...taxRate, stockCardId })) || []),
                ...(variants?.map(variant => this.createStockCardVariant({ ...variant, stockCardId })) || []),
            ]);

            if (stockCard.images) {
                await StockCardImage.insertMany(stockCard.images.map(image => ({ ...image, stockCardId })));
            }
            if (stockCard.videos) {
                await StockCardVideo.insertMany(stockCard.videos.map(video => ({ ...video, stockCardId })));
            }

            return { ...stockCard, id: stockCardId };
        } catch (error) {
            console.error("Error creating stock card with relations:", error);
            throw new Error("Failed to create stock card with relations");
        }
    }

    async deleteStockCardsWithRelations(stockCardId: string): Promise<boolean> {
        try {
            await Promise.all([
                db.delete(stockCardAttributes).where(eq(stockCardAttributes.stockCardId, stockCardId)),
                db.delete(stockCardBarcodes).where(eq(stockCardBarcodes.stockCardId, stockCardId)),
                db.delete(stockCardCategories).where(eq(stockCardCategories.stockCardId, stockCardId)),
                db.delete(stockCardPriceLists).where(eq(stockCardPriceLists.stockCardId, stockCardId)),
                db.delete(stockCardTaxRates).where(eq(stockCardTaxRates.stockCardId, stockCardId)),
                db.delete(stockCardVariants).where(eq(stockCardVariants.stockCardId, stockCardId)),
                StockCardImage.deleteMany({ stockCardId }),
                StockCardVideo.deleteMany({ stockCardId }),
            ]);

            const result = await db.delete(stockCards).where(eq(stockCards.id, stockCardId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card with relations:", error);
            throw new Error("Failed to delete stock card with relations");
        }
    }

    async findStockCardWithRelationsById(stockCardId: string): Promise<StockCardWithRelations | null> {
        try {
            const stockCard = await db.select().from(stockCards).where(eq(stockCards.id, stockCardId)).execute();
            if (stockCard.length === 0) return null;

            const [attributes, barcodes, categories, priceLists, taxRates, variants] = await Promise.all([
                db.select().from(stockCardAttributes).where(eq(stockCardAttributes.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardBarcodes).where(eq(stockCardBarcodes.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardCategories).where(eq(stockCardCategories.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardPriceLists).where(eq(stockCardPriceLists.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardTaxRates).where(eq(stockCardTaxRates.stockCardId, stockCardId)).execute(),
                db.select().from(stockCardVariants).where(eq(stockCardVariants.stockCardId, stockCardId)).execute(),
            ]);

            const images = await StockCardImage.find({ stockCardId }).exec();
            const videos = await StockCardVideo.find({ stockCardId }).exec();

            return { 
                ...stockCard[0], 
                attributes, 
                barcodes, 
                categories, 
                priceLists, 
                taxRates, 
                variants,
                images,
                videos
            };
        } catch (error) {
            console.error("Error finding stock card with relations by ID:", error);
            throw new Error("Failed to find stock card with relations by ID");
        }
    }

    async findAllStockCardsWithRelations(): Promise<StockCardWithRelations[]> {
        try {
            const stockCardsList = await db.select().from(stockCards).execute();
            const stockCardsWithRelations = await Promise.all(
                stockCardsList.map(stockCard => this.findStockCardWithRelationsById(stockCard.id))
            );
            return stockCardsWithRelations.filter((card): card is StockCardWithRelations => card !== null);
        } catch (error) {
            console.error("Error finding all stock cards with relations:", error);
            throw new Error("Failed to find all stock cards with relations");
        }
    }

    async updateStockCardsWithRelations(stockCard: StockCardWithRelations): Promise<StockCardWithRelations> {
        try {
            const updatedStockCard = await this.updateStockCard(stockCard);
            const stockCardId = updatedStockCard.id;

            const { attributes, barcodes, categories, priceLists, taxRates, variants, images, videos } = stockCard;

            await Promise.all([
                ...(attributes?.map(attr => this.updateStockCardAttribute({ ...attr, stockCardId })) || []),
                ...(barcodes?.map(barcode => this.updateStockCardBarcode({ ...barcode, stockCardId })) || []),
                ...(categories?.map(category => this.updateStockCardCategory({ ...category, stockCardId })) || []),
                ...(priceLists?.map(priceList => this.updateStockCardPriceList({ ...priceList, stockCardId })) || []),
                ...(taxRates?.map(taxRate => this.updateStockCardTaxRate({ ...taxRate, stockCardId })) || []),
                ...(variants?.map(variant => this.updateStockCardVariant({ ...variant, stockCardId })) || []),
            ]);

            if (images) {
                await Promise.all(images.map(image => {
                    const { _id, imageUrl, isDefault } = image;
                    return this.updateStockCardImage({ _id, imageUrl, isDefault, stockCardId } as IStockCardImage);
                }));
            }
            
            if (videos) {
                await Promise.all(videos.map(video => this.updateStockCardVideo({ ...video, stockCardId } as IStockCardVideo)));
            }

            return { ...stockCard, id: stockCardId };
        } catch (error) {
            console.error("Error updating stock card with relations:", error);
            throw new Error("Failed to update stock card with relations");
        }
    }

    async createStockCardAttribute(stockCardAttribute: StockCardAttribute): Promise<StockCardAttribute> {
        try {
            const [createdAttribute] = await db.insert(stockCardAttributes).values(stockCardAttribute).returning();
            return createdAttribute;
        } catch (error) {
            console.error("Error creating stock card attribute:", error);
            throw new Error("Failed to create stock card attribute");
        }
    }

    async deleteStockCardAttribute(stockCardAttributeId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardAttributes).where(eq(stockCardAttributes.id, stockCardAttributeId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card attribute:", error);
            throw new Error("Failed to delete stock card attribute");
        }
    }

    async findStockCardAttributeById(stockCardAttributeId: string): Promise<StockCardAttribute | null> {
        try {
            const result = await db.select().from(stockCardAttributes).where(eq(stockCardAttributes.id, stockCardAttributeId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card attribute by ID:", error);
            throw new Error("Failed to find stock card attribute by ID");
        }
    }

    async findAllStockCardAttributes(): Promise<StockCardAttribute[]> {
        try {
            const result = await db.select().from(stockCardAttributes).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card attributes:", error);
            throw new Error("Failed to find all stock card attributes");
        }
    }

    async updateStockCardAttribute(stockCardAttribute: StockCardAttribute): Promise<StockCardAttribute> {
        try {
            const [updatedAttribute] = await db.update(stockCardAttributes).set(stockCardAttribute).where(eq(stockCardAttributes.id, stockCardAttribute.id)).returning();
            return updatedAttribute;
        } catch (error) {
            console.error("Error updating stock card attribute:", error);
            throw new Error("Failed to update stock card attribute");
        }
    }

    async createStockCardBarcode(stockCardBarcode: StockCardBarcode): Promise<StockCardBarcode> {
        try {
            const [createdBarcode] = await db.insert(stockCardBarcodes).values(stockCardBarcode).returning();
            return createdBarcode;
        } catch (error) {
            console.error("Error creating stock card barcode:", error);
            throw new Error("Failed to create stock card barcode");
        }
    }

    async deleteStockCardBarcode(stockCardBarcodeId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardBarcodes).where(eq(stockCardBarcodes.id, stockCardBarcodeId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card barcode:", error);
            throw new Error("Failed to delete stock card barcode");
        }
    }

    async findStockCardBarcodeById(stockCardBarcodeId: string): Promise<StockCardBarcode | null> {
        try {
            const result = await db.select().from(stockCardBarcodes).where(eq(stockCardBarcodes.id, stockCardBarcodeId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card barcode by ID:", error);
            throw new Error("Failed to find stock card barcode by ID");
        }
    }

    async findAllStockCardBarcodes(): Promise<StockCardBarcode[]> {
        try {
            const result = await db.select().from(stockCardBarcodes).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card barcodes:", error);
            throw new Error("Failed to find all stock card barcodes");
        }
    }

    async updateStockCardBarcode(stockCardBarcode: StockCardBarcode): Promise<StockCardBarcode> {
        try {
            const [updatedBarcode] = await db.update(stockCardBarcodes).set(stockCardBarcode).where(eq(stockCardBarcodes.id, stockCardBarcode.id)).returning();
            return updatedBarcode;
        } catch (error) {
            console.error("Error updating stock card barcode:", error);
            throw new Error("Failed to update stock card barcode");
        }
    }

    async createStockCardCategory(stockCardCategory: StockCardCategory): Promise<StockCardCategory> {
        try {
            const [createdCategory] = await db.insert(stockCardCategories).values(stockCardCategory).returning();
            return createdCategory;
        } catch (error) {
            console.error("Error creating stock card category:", error);
            throw new Error("Failed to create stock card category");
        }
    }

    async deleteStockCardCategory(stockCardCategoryId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardCategories).where(eq(stockCardCategories.id, stockCardCategoryId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card category:", error);
            throw new Error("Failed to delete stock card category");
        }
    }

    async findStockCardCategoryById(stockCardCategoryId: string): Promise<StockCardCategory | null> {
        try {
            const result = await db.select().from(stockCardCategories).where(eq(stockCardCategories.id, stockCardCategoryId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card category by ID:", error);
            throw new Error("Failed to find stock card category by ID");
        }
    }

    async findAllStockCardCategories(): Promise<StockCardCategory[]> {
        try {
            const result = await db.select().from(stockCardCategories).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card categories:", error);
            throw new Error("Failed to find all stock card categories");
        }
    }

    async updateStockCardCategory(stockCardCategory: StockCardCategory): Promise<StockCardCategory> {
        try {
            const [updatedCategory] = await db.update(stockCardCategories).set(stockCardCategory).where(eq(stockCardCategories.id, stockCardCategory.id)).returning();
            return updatedCategory;
        } catch (error) {
            console.error("Error updating stock card category:", error);
            throw new Error("Failed to update stock card category");
        }
    }

    async createStockCardPriceList(stockCardPriceList: StockCardPriceList): Promise<StockCardPriceList> {
        try {
            const [createdPriceList] = await db.insert(stockCardPriceLists).values(stockCardPriceList).returning();
            return createdPriceList;
        } catch (error) {
            console.error("Error creating stock card price list:", error);
            throw new Error("Failed to create stock card price list");
        }
    }

    async deleteStockCardPriceList(stockCardPriceListId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardPriceLists).where(eq(stockCardPriceLists.id, stockCardPriceListId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card price list:", error);
            throw new Error("Failed to delete stock card price list");
        }
    }

    async findStockCardPriceListById(stockCardPriceListId: string): Promise<StockCardPriceList | null> {
        try {
            const result = await db.select().from(stockCardPriceLists).where(eq(stockCardPriceLists.id, stockCardPriceListId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card price list by ID:", error);
            throw new Error("Failed to find stock card price list by ID");
        }
    }

    async findAllStockCardPriceLists(): Promise<StockCardPriceList[]> {
        try {
            const result = await db.select().from(stockCardPriceLists).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card price lists:", error);
            throw new Error("Failed to find all stock card price lists");
        }
    }

    async updateStockCardPriceList(stockCardPriceList: StockCardPriceList): Promise<StockCardPriceList> {
        try {
            const [updatedPriceList] = await db.update(stockCardPriceLists).set(stockCardPriceList).where(eq(stockCardPriceLists.id, stockCardPriceList.id)).returning();
            return updatedPriceList;
        } catch (error) {
            console.error("Error updating stock card price list:", error);
            throw new Error("Failed to update stock card price list");
        }
    }

    async createStockCardTaxRate(stockCardTaxRate: StockCardTaxRate): Promise<StockCardTaxRate> {
        try {
            const [createdTaxRate] = await db.insert(stockCardTaxRates).values(stockCardTaxRate).returning();
            return createdTaxRate;
        } catch (error) {
            console.error("Error creating stock card tax rate:", error);
            throw new Error("Failed to create stock card tax rate");
        }
    }

    async deleteStockCardTaxRate(stockCardTaxRateId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardTaxRates).where(eq(stockCardTaxRates.id, stockCardTaxRateId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card tax rate:", error);
            throw new Error("Failed to delete stock card tax rate");
        }
    }

    async findStockCardTaxRateById(stockCardTaxRateId: string): Promise<StockCardTaxRate | null> {
        try {
            const result = await db.select().from(stockCardTaxRates).where(eq(stockCardTaxRates.id, stockCardTaxRateId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card tax rate by ID:", error);
            throw new Error("Failed to find stock card tax rate by ID");
        }
    }

    async findAllStockCardTaxRates(): Promise<StockCardTaxRate[]> {
        try {
            const result = await db.select().from(stockCardTaxRates).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card tax rates:", error);
            throw new Error("Failed to find all stock card tax rates");
        }
    }

    async updateStockCardTaxRate(stockCardTaxRate: StockCardTaxRate): Promise<StockCardTaxRate> {
        try {
            const [updatedTaxRate] = await db.update(stockCardTaxRates).set(stockCardTaxRate).where(eq(stockCardTaxRates.id, stockCardTaxRate.id)).returning();
            return updatedTaxRate;
        } catch (error) {
            console.error("Error updating stock card tax rate:", error);
            throw new Error("Failed to update stock card tax rate");
        }
    }

    async createStockCardVariant(stockCardVariant: StockCardVariant): Promise<StockCardVariant> {
        try {
            const [createdVariant] = await db.insert(stockCardVariants).values(stockCardVariant).returning();
            return createdVariant;
        } catch (error) {
            console.error("Error creating stock card variant:", error);
            throw new Error("Failed to create stock card variant");
        }
    }

    async deleteStockCardVariant(stockCardVariantId: string): Promise<boolean> {
        try {
            const result = await db.delete(stockCardVariants).where(eq(stockCardVariants.id, stockCardVariantId));
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            console.error("Error deleting stock card variant:", error);
            throw new Error("Failed to delete stock card variant");
        }
    }

    async findStockCardVariantById(stockCardVariantId: string): Promise<StockCardVariant | null> {
        try {
            const result = await db.select().from(stockCardVariants).where(eq(stockCardVariants.id, stockCardVariantId)).execute();
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error finding stock card variant by ID:", error);
            throw new Error("Failed to find stock card variant by ID");
        }
    }

    async findAllStockCardVariants(): Promise<StockCardVariant[]> {
        try {
            const result = await db.select().from(stockCardVariants).execute();
            return result;
        } catch (error) {
            console.error("Error finding all stock card variants:", error);
            throw new Error("Failed to find all stock card variants");
        }
    }

    async updateStockCardVariant(stockCardVariant: StockCardVariant): Promise<StockCardVariant> {
        try {
            const [updatedVariant] = await db.update(stockCardVariants).set(stockCardVariant).where(eq(stockCardVariants.id, stockCardVariant.id)).returning();
            return updatedVariant;
        } catch (error) {
            console.error("Error updating stock card variant:", error);
            throw new Error("Failed to update stock card variant");
        }
    }

    async createStockCardImage(stockCardImage: IStockCardImage): Promise<IStockCardImage> {
        try {
            return await StockCardImage.create(stockCardImage);
        } catch (error) {
            console.error("Error creating stock card image:", error);
            throw new Error("Failed to create stock card image");
        }
    }

    async deleteStockCardImage(stockCardImageId: string): Promise<boolean> {
        try {
            const result = await StockCardImage.deleteOne({ _id: stockCardImageId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting stock card image:", error);
            throw new Error("Failed to delete stock card image");
        }
    }

    async findStockCardImageById(stockCardImageId: string): Promise<IStockCardImage | null> {
        try {
            return await StockCardImage.findById(stockCardImageId);
        } catch (error) {
            console.error("Error finding stock card image by ID:", error);
            throw new Error("Failed to find stock card image by ID");
        }
    }

    async findAllStockCardImages(): Promise<IStockCardImage[]> {
        try {
            return await StockCardImage.find().exec();
        } catch (error) {
            console.error("Error finding all stock card images:", error);
            throw new Error("Failed to find all stock card images");
        }
    }

    async updateStockCardImage(stockCardImage: IStockCardImage): Promise<IStockCardImage> {
        try {
            const updatedImage = await StockCardImage.findByIdAndUpdate(stockCardImage._id, stockCardImage, { new: true });
            return updatedImage as IStockCardImage;
        } catch (error) {
            console.error("Error updating stock card image:", error);
            throw new Error("Failed to update stock card image");
        }
    }

    async createStockCardVideo(stockCardVideo: IStockCardVideo): Promise<IStockCardVideo> {
        try {
            return await StockCardVideo.create(stockCardVideo);
        } catch (error) {
            console.error("Error creating stock card video:", error);
            throw new Error("Failed to create stock card video");
        }
    }

    async deleteStockCardVideo(stockCardVideoId: string): Promise<boolean> {
        try {
            const result = await StockCardVideo.deleteOne({ _id: stockCardVideoId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting stock card video:", error);
            throw new Error("Failed to delete stock card video");
        }
    }

    async findStockCardVideoById(stockCardVideoId: string): Promise<IStockCardVideo | null> {
        try {
            return await StockCardVideo.findById(stockCardVideoId);
        } catch (error) {
            console.error("Error finding stock card video by ID:", error);
            throw new Error("Failed to find stock card video by ID");
        }
    }

    async findAllStockCardVideos(): Promise<IStockCardVideo[]> {
        try {
            return await StockCardVideo.find().exec();
        } catch (error) {
            console.error("Error finding all stock card videos:", error);
            throw new Error("Failed to find all stock card videos");
        }
    }

    async updateStockCardVideo(stockCardVideo: IStockCardVideo): Promise<IStockCardVideo> {
        try {
            const updatedVideo = await StockCardVideo.findByIdAndUpdate(stockCardVideo._id, stockCardVideo, { new: true });
            return updatedVideo as IStockCardVideo;
        } catch (error) {
            console.error("Error updating stock card video:", error);
            throw new Error("Failed to update stock card video");
        }
    }
}