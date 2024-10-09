import {
    Branch,
    Company,
    Current,
    StockCard,
    StockCardAttribute,
    StockCardBarcode,
    StockCardCategoryItem,
    StockCardPriceListItems,
    StockCardTaxRate,
    Warehouse,
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";

const stockCardRelations = {
    Attributes: true,
    Barcodes: true,
    Categories: true,
    StockCardPriceLists: true,
    TaxRates: true,
    Variations: true,
    Branch: true,
    Company: true,
    Warehouse: true,

};

export class StockCardService {

    private stockCardRepository = new BaseRepository<StockCard>(prisma.stockCard);
    private stockCardAttributeRepository = new BaseRepository<StockCardAttribute>(
        prisma.stockCardAttribute
    );
    private stockCardBarcodeRepository = new BaseRepository<StockCardBarcode>(
        prisma.stockCardBarcode
    );
    private stockCardCategoryItemsRepository =
        new BaseRepository<StockCardCategoryItem>(prisma.stockCardCategoryItem);
    private stockCardPriceListItemsRepository =
        new BaseRepository<StockCardPriceListItems>(prisma.stockCardPriceListItems);
    private stockCardTaxRateRepository = new BaseRepository<StockCardTaxRate>(
        prisma.stockCardTaxRate
    );

    private warehouseRepository = new BaseRepository<Warehouse>(prisma.branch);
    private currentRepository = new BaseRepository<Current>(prisma.stockCard);

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

    async deleteStockCard(
        id: string
    ): Promise<{ success: boolean; message: string }> {
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
    ): Promise<StockCard[] | null> {
        try {
            return await this.stockCardRepository.findWithFilters(filters);
        } catch (error) {
            console.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }

    // StockCard ile ilişkili tüm tabloları kullanarak yeni bir StockCard oluşturur
    async createStockCardsWithRelations(data: {
        stockCard: StockCard;
        attributes?: StockCardAttribute[];
        barcodes?: StockCardBarcode[];
        categoryItems?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        current?: Current;
    }): Promise<StockCard | null> {
        try {
            // Transaction içinde tüm işlemleri gerçekleştiriyoruz
            const result: StockCard | null = await prisma.$transaction(
                async (prisma) => {
                    // 1. Stock Card oluştur
                    const getCurrent = await this.currentRepository.findWithFilters({
                        currentCode: data.current?.currentCode,
                    }); // Current'ı kontrol et

                    if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || getCurrent[0].currentType === null)) {
                        const stockCard = await this.stockCardRepository.create(
                            data.stockCard
                        );

                        // 2. Barcode'ları Ekle
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
                            await Promise.all(
                                data.categoryItems.map((categoryItem) =>
                                    this.stockCardCategoryItemsRepository.create({
                                        ...categoryItem,
                                        stockCardId: stockCard.id,
                                    })
                                )
                            );
                        }

                        // 5. Fiyat Listesi Öğelerini (PriceListItems) Ekle
                        if (data.priceListItems) {
                            await Promise.all(
                                data.priceListItems.map((priceListItem) =>
                                    this.stockCardPriceListItemsRepository.create({
                                        ...priceListItem,
                                        stockCardId: stockCard.id,
                                    })
                                )
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
                    } else {
                        console.log("Current Role is not Manufacturer");
                        return null;
                    }
                }
            );

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

    // StockCard ile ilişkili tüm tabloları kullanarak bir StockCard günceller
    async updateStockCardsWithRelations(
        id: string,
        data: {
            stockCard: Partial<StockCard>;
            attributes?: StockCardAttribute[];
            barcodes?: StockCardBarcode[];
            categoryItems?: StockCardCategoryItem[];
            priceListItems?: StockCardPriceListItems[];
            taxRates?: StockCardTaxRate[];
            current?: Current;
        }
    ): Promise<StockCard | null> {
        try {
            // Transaction içinde tüm işlemleri gerçekleştiriyoruz
            const result: StockCard | null = await prisma.$transaction(
                async (prisma) => {
                    // 1. Stock Card güncelle
                    const getCurrent = await this.currentRepository.findWithFilters({
                        currentCode: data.current?.currentCode,
                    });

                    if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || getCurrent[0].currentType === null)) {
                        const stockCard = await this.stockCardRepository.update(
                            id,
                            data.stockCard
                        );

                        // 2. Barcod'ları Güncelle
                        if (data.barcodes) {
                            await Promise.all(
                                data.barcodes.map((barcode) =>
                                    this.stockCardBarcodeRepository.update(barcode.id, barcode)
                                )
                            );
                        }

                        // 3. Attribute'ları Güncelle
                        if (data.attributes) {
                            await Promise.all(
                                data.attributes.map((attribute) =>
                                    this.stockCardAttributeRepository.update(
                                        attribute.id,
                                        attribute
                                    )
                                )
                            );
                        }

                        // 4. Kategori Öğelerini (CategoryItems) Güncelle
                        if (data.categoryItems) {
                            await Promise.all(
                                data.categoryItems.map((categoryItem) =>
                                    this.stockCardCategoryItemsRepository.update(
                                        categoryItem.id,
                                        categoryItem
                                    )
                                )
                            );
                        }

                        // 5. Fiyat Listesi Öğelerini (PriceListItems) Güncelle
                        if (data.priceListItems) {
                            await Promise.all(
                                data.priceListItems.map((priceListItem) =>
                                    this.stockCardPriceListItemsRepository.update(
                                        priceListItem.id,
                                        priceListItem
                                    )
                                )
                            );
                        }

                        // 6. Vergi Oranlarını (TaxRates) Güncelle
                        if (data.taxRates) {
                            await Promise.all(
                                data.taxRates.map((taxRate) =>
                                    this.stockCardTaxRateRepository.update(taxRate.id, taxRate)
                                )
                            );
                        }

                        return stockCard;
                    } else {
                        console.log("Current Role is not Manufacturer or null");
                        return null;
                    }
                }
            );

            // İşlem başarıyla tamamlandığında sonucu döndürüyoruz
            return result;
        } catch (error) {
            if (error instanceof Error) {
                // Hata yakalandığında detaylı loglama yapıyoruz
                logger.error({
                    msg: "Error updating StockCard with relations",
                    error: error.message,
                    stack: error.stack,
                    requestData: data,
                });
            } else {
                logger.error("Unknown error occurred", { error });
            }

            // Hata olduğunda bir mesaj ile geri döndürüyoruz
            throw new Error("Could not update StockCard with relations");
        }
    }

    async deleteStockCardsWithRelations(id: string): Promise<boolean> {
        try {
            return await prisma.$transaction(async (prisma) => {
                // 1. Stock Card'ı sil
                await this.stockCardRepository.delete(id);

                // 2. Barcod'ları Sil
                await this.stockCardBarcodeRepository.deleteWithFilters({
                    stockCardId: id,
                });

                // 3. Attribute'ları Sil
                await this.stockCardAttributeRepository.deleteWithFilters({
                    stockCardId: id,
                });

                // 4. Kategori Öğelerini (CategoryItems) Sil
                await this.stockCardCategoryItemsRepository.deleteWithFilters({
                    stockCardId: id,
                });

                // 5. Fiyat Listesi Öğelerini (PriceListItems) Sil
                await this.stockCardPriceListItemsRepository.deleteWithFilters({
                    stockCardId: id,
                });

                // 6. Vergi Oranlarını (TaxRates) Sil
                await this.stockCardTaxRateRepository.deleteWithFilters({
                    stockCardId: id,
                });

                return true;
            });
        } catch (error) {
            logger.error("Error deleting StockCard with relations:", error);
            throw new Error("Could not delete StockCard with relations");
        }
    }

    async getStockCardsWithRelationsById(id: string): Promise<StockCard | null> {
        try {
            return await prisma.stockCard.findUnique({
                where: { id },
                include: stockCardRelations,
            });
        } catch (error) {
            logger.error("Error finding StockCard with relations by ID:", error);
            throw new Error("Could not find StockCard with relations by ID");
        }
    }

    async getAllStockCardsWithRelations(): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany({
                include: stockCardRelations,
            });
        } catch (error) {
            logger.error("Error finding all StockCards with relations:", error);
            throw new Error("Could not find all StockCards with relations");
        }
    }
}

export default StockCardService;