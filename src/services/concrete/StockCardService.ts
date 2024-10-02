import {
    StockCard,
    StockCardAttribute,
    StockCardBarcode,
    StockCardCategoryItem,
    StockCardPriceListItems,
    StockCardTaxRate,
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { IStockCardRepository } from "../../repositories/abstracts/stockCard/IStockCardRepository";
import { IStockCardAttributeRepository } from "../../repositories/abstracts/stockCard/IStockCardAttributeRepository";
import { IStockCardBarcodeRepository } from "../../repositories/abstracts/stockCard/IStockCardBarcodeRepository";
import { IStockCardCategoryItemsRepository } from "../../repositories/abstracts/stockCard/IStockCardCategoryItemsRepository";
import { IStockCardPriceListItemsRepository } from "../../repositories/abstracts/stockCard/IStockCardPriceListItemsRepository";
import { IStockCardTaxRateRepository } from "../../repositories/abstracts/stockCard/IStockCardTaxRateRepository";

export class StockCardService {

    constructor(
        private stockCardRepository: IStockCardRepository,
        private stockCardAttributeRepository: IStockCardAttributeRepository,
        private stockCardBarcodeRepository: IStockCardBarcodeRepository,
        private stockCardCategoryItemsRepository: IStockCardCategoryItemsRepository,
        private stockCardPriceListItemsRepository: IStockCardPriceListItemsRepository,
        private stockCardTaxRateRepository: IStockCardTaxRateRepository
    ) { }

    async createStockCard(stockCard: StockCard): Promise<StockCard> {
        try {
            return await this.stockCardRepository.create(stockCard);
        } catch (error) {
            console.error("Error creating StockCard:", error);
            throw new Error("Could not create StockCard");
        }
    }

    async updateStockCard(
        id: string,
        stockCard: Partial<StockCard>
    ): Promise<StockCard> {
        try {
            return await this.stockCardRepository.update(id, stockCard);
        } catch (error) {
            console.error("Error updating StockCard:", error);
            throw new Error("Could not update StockCard");
        }
    }

    async deleteStockCard(id: string): Promise<{ success: boolean, message: string }> {
        try {
            const result = await this.stockCardRepository.delete(id);
            return { success: result, message: "StockCard successfully deleted" };
        } catch (error) {
            logger.error("Error deleting StockCard:", error);
            return { success: false, message: "Could not delete StockCard" };
        }
    }

    async getStockCardById(id: string): Promise<StockCard | null> {
        try {
            return await this.stockCardRepository.findById(id);
        } catch (error) {
            console.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getAllStockCards(): Promise<StockCard[]> {
        try {
            return await this.stockCardRepository.findAll();
        } catch (error) {
            console.error("Error finding all StockCards:", error);
            throw new Error("Could not find all StockCards");
        }
    }

    async getStockCardsWithFilters(
        filters: Partial<StockCard>
    ): Promise<StockCard[]> {
        try {
            return await this.stockCardRepository.findWithFilters(filters);
        } catch (error) {
            console.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }

    async createStockCardWithRelations(data: {
        stockCard: StockCard;
        attributes?: StockCardAttribute[];
        barcodes?: StockCardBarcode[];
        categoryItems?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
    }): Promise<StockCard> {
        try {
            // Transaction içinde tüm işlemleri gerçekleştiriyoruz
            const result = await prisma.$transaction(async (prisma) => {
                // 1. Stock Card oluştur
                const stockCard = await this.stockCardRepository.create(data.stockCard);

                // 2. Barcod'ları Ekle
                if (data.barcodes) {
                    await Promise.all(
                        data.barcodes.map((barcode) =>
                            this.stockCardBarcodeRepository.create({
                                ...barcode,
                                stockCardId: stockCard.id,
                            })
                        )
                    );
                }

                // 3. Attribute'ları Ekle
                if (data.attributes) {
                    await Promise.all(
                        data.attributes.map((attribute) =>
                            this.stockCardAttributeRepository.create({
                                ...attribute,
                                stockCardId: stockCard.id,
                            })
                        )
                    );
                }

                // 4. Kategori Öğelerini (CategoryItems) Ekle
                if (data.categoryItems) {
                    await this.stockCardCategoryItemsRepository.createMany(
                        data.categoryItems.map((categoryItem) => ({
                            ...categoryItem,
                            stockCardId: stockCard.id,
                        })),
                    );
                }

                // 5. Fiyat Listesi Öğelerini (PriceListItems) Ekle
                if (data.priceListItems) {
                    await this.stockCardPriceListItemsRepository.createMany(
                        data.priceListItems.map((priceListItem) => ({
                            ...priceListItem,
                            stockCardId: stockCard.id,
                        }))
                    );
                }

                // 6. Vergi Oranlarını (TaxRates) Ekle
                if (data.taxRates) {
                    await Promise.all(
                        data.taxRates.map((taxRate) =>
                            this.stockCardTaxRateRepository.create({
                                ...taxRate,
                                stockCardId: stockCard.id,
                            })
                        )
                    );
                }

                return stockCard;
            });

            // İşlem başarıyla tamamlandığında sonucu döndürüyoruz
            return result;

        } catch (error) {
            if (error instanceof Error) {
                // Hata yakalandığında detaylı loglama yapıyoruz
                logger.error({
                    msg: "Error creating StockCard with relations",
                    error: error.message,
                    stack: error.stack,
                    requestData: data,
                });
            } else {
                logger.error("Unknown error occurred", { error });
            }

            // Hata olduğunda bir mesaj ile geri döndürüyoruz
            throw new Error("Could not create StockCard with relations");
        }
    }

    getStockCardWithRelations(id: string): Promise<StockCard | null> {
        return prisma.stockCard.findUnique({
            where: { id },
            include: {
                Attributes: true,
                Barcodes: true,
                Categories: true,
                StockCardPriceListItems: true,
                TaxRates: true,
            },
        });
    }
}
