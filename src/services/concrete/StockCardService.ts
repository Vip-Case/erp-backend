import {
    Branch,
    Company,
    Current,
    Prisma,
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
    private stockCardAttributeRepository = new BaseRepository<StockCardAttribute>(prisma.stockCardAttribute);
    private stockCardBarcodeRepository = new BaseRepository<StockCardBarcode>(prisma.stockCardBarcode);
    private stockCardCategoryItemsRepository = new BaseRepository<StockCardCategoryItem>(prisma.stockCardCategoryItem);
    private stockCardPriceListItemsRepository = new BaseRepository<StockCardPriceListItems>(prisma.stockCardPriceListItems);
    private stockCardTaxRateRepository = new BaseRepository<StockCardTaxRate>(prisma.stockCardTaxRate);
    
    private warehouseRepository = new BaseRepository<Warehouse>(prisma.warehouse); // Düzeltilmiş
    private currentRepository = new BaseRepository<Current>(prisma.current); // Düzeltilmiş

    async createStockCard(stockCard: StockCard, warehouseIds: string[]): Promise<StockCard> {
        try {
            const result = await prisma.stockCard.create({
                data: {
                    productCode: stockCard.productCode,
                    productName: stockCard.productName,
                    invoiceName: stockCard.invoiceName,
                    shortDescription: stockCard.shortDescription,
                    description: stockCard.description,
                    brand: stockCard.brand,
                    unitOfMeasure: stockCard.unitOfMeasure,
                    productType: stockCard.productType,
                    riskQuantities: stockCard.riskQuantities,
                    stockStatus: stockCard.stockStatus,
                    hasExpirationDate: stockCard.hasExpirationDate,
                    allowNegativeStock: stockCard.allowNegativeStock,

                    company: stockCard.companyCode ? {
                        connect: { companyCode: stockCard.companyCode },
                    } : undefined,

                    branch: stockCard.branchCode ? {
                        connect: { branchCode: stockCard.branchCode },
                    } : undefined,

                    Current: stockCard.manufacturerCode ? {
                        connect: { currentCode: stockCard.manufacturerCode },
                    } : undefined,

                    // StockCardWarehouse Many-to-Many relation
                    StockCardWarehouse: warehouseIds.length > 0 ? {
                        create: warehouseIds.map(warehouseId => ({
                            warehouse: { connect: { id: warehouseId } },
                        })),
                    } : undefined,
                } as Prisma.StockCardCreateInput, // Type assertion
            });

            return result;
        } catch (error) {
            logger.error("Error creating StockCard:", error);
            throw new Error("Could not create StockCard");
        }
    }

    async updateStockCard(id: string, stockCard: Partial<StockCard>): Promise<StockCard> {
        try {
            return await this.stockCardRepository.update(id, stockCard);
        } catch (error) {
            logger.error("Error updating StockCard:", error);
            throw new Error("Could not update StockCard");
        }
    }

    async deleteStockCard(id: string): Promise<{ success: boolean; message: string }> {
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
            logger.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getAllStockCards(): Promise<StockCard[]> {
        try {
            return await this.stockCardRepository.findAll();
        } catch (error) {
            logger.error("Error finding all StockCards:", error);
            throw new Error("Could not find all StockCards");
        }
    }

    async getStockCardsWithFilters(filters: Partial<StockCard>): Promise<StockCard[] | null> {
        try {
            return await this.stockCardRepository.findWithFilters(filters);
        } catch (error) {
            logger.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }

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
            const result = await prisma.$transaction(async (prisma) => {
                const getCurrent = await this.currentRepository.findWithFilters({
                    currentCode: data.current?.currentCode,
                });

                if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || !getCurrent[0].currentType)) {
                    const stockCard = await this.stockCardRepository.create(data.stockCard);

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
                    logger.info("Current Role is not Manufacturer");
                    return null;
                }
            });

            return result;
        } catch (error) {
            if (error instanceof Error) {
                logger.error({
                    msg: "Error creating StockCard with relations",
                    error: error.message,
                    stack: error.stack,
                    requestData: data,
                });
            } else {
                logger.error("Unknown error occurred", { error });
            }

            throw new Error("Could not create StockCard with relations");
        }
    }

    async updateStockCardsWithRelations(id: string, data: {
        stockCard: Partial<StockCard>;
        attributes?: StockCardAttribute[];
        barcodes?: StockCardBarcode[];
        categoryItems?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        current?: Current;
    }): Promise<StockCard | null> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                const getCurrent = await this.currentRepository.findWithFilters({
                    currentCode: data.current?.currentCode,
                });

                if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || !getCurrent[0].currentType)) {
                    const stockCard = await this.stockCardRepository.update(id, data.stockCard);

                    if (data.barcodes) {
                        await Promise.all(
                            data.barcodes.map((barcode) =>
                                this.stockCardBarcodeRepository.update(barcode.id, barcode)
                            )
                        );
                    }

                    if (data.attributes) {
                        await Promise.all(
                            data.attributes.map((attribute) =>
                                this.stockCardAttributeRepository.update(attribute.id, attribute)
                            )
                        );
                    }

                    if (data.categoryItems) {
                        await Promise.all(
                            data.categoryItems.map((categoryItem) =>
                                this.stockCardCategoryItemsRepository.update(categoryItem.id, categoryItem)
                            )
                        );
                    }

                    if (data.priceListItems) {
                        await Promise.all(
                            data.priceListItems.map((priceListItem) =>
                                this.stockCardPriceListItemsRepository.update(priceListItem.id, priceListItem)
                            )
                        );
                    }

                    if (data.taxRates) {
                        await Promise.all(
                            data.taxRates.map((taxRate) =>
                                this.stockCardTaxRateRepository.update(taxRate.id, taxRate)
                            )
                        );
                    }

                    return stockCard;
                } else {
                    logger.info("Current Role is not Manufacturer or null");
                    return null;
                }
            });

            return result;
        } catch (error) {
            if (error instanceof Error) {
                logger.error({
                    msg: "Error updating StockCard with relations",
                    error: error.message,
                    stack: error.stack,
                    requestData: data,
                });
            } else {
                logger.error("Unknown error occurred", { error });
            }

            throw new Error("Could not update StockCard with relations");
        }
    }

    async deleteStockCardsWithRelations(id: string): Promise<boolean> {
        try {
            return await prisma.$transaction(async (prisma) => {
                await this.stockCardRepository.delete(id);

                await this.stockCardBarcodeRepository.deleteWithFilters({
                    stockCardId: id,
                });

                await this.stockCardAttributeRepository.deleteWithFilters({
                    stockCardId: id,
                });

                await this.stockCardCategoryItemsRepository.deleteWithFilters({
                    stockCardId: id,
                });

                await this.stockCardPriceListItemsRepository.deleteWithFilters({
                    stockCardId: id,
                });

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
