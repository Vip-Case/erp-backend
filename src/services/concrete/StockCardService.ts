import {
    Prisma,
    StockCard,
    StockCardAttribute,
    StockCardBarcode,
    StockCardCategoryItem,
    StockCardPriceListItems,
    StockCardTaxRate,
    Warehouse,
    Current,
    ProfitMargin,
    ReceiptDetail,
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";

const stockCardRelations = {
    Branch: true,
    Company: true,
};

export class StockCardService {
    
    private stockCardRepository: BaseRepository<StockCard>;

    constructor() {
        this.stockCardRepository = new BaseRepository<StockCard>(prisma.stockCard);
    }

    async createStockCard(stockCard: StockCard, warehouseIds: string[] | undefined): Promise<StockCard> {
        try {
            if (warehouseIds = undefined) {
                const resultWithoutWarehouse = await prisma.stockCard.create({
                    data: {
                        productCode: stockCard.productCode,
                        productName: stockCard.productName,
                        invoiceName: stockCard.invoiceName,
                        shortDescription: stockCard.shortDescription,
                        description: stockCard.description,
                        brand: stockCard.brand,
                        unitOfMeasure: stockCard.unitOfMeasure,
                        productType: stockCard.productType,
                        marketNames: stockCard.marketNames,
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
                    } as Prisma.StockCardCreateInput,
                });
                return resultWithoutWarehouse;
            }else {
                const resultWithWarehouse = await prisma.stockCard.create({
                    data: {
                        productCode: stockCard.productCode,
                        productName: stockCard.productName,
                        invoiceName: stockCard.invoiceName,
                        shortDescription: stockCard.shortDescription,
                        description: stockCard.description,
                        brand: stockCard.brand,
                        unitOfMeasure: stockCard.unitOfMeasure,
                        productType: stockCard.productType,
                        marketNames: stockCard.marketNames,
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

                        // StockCardWarehouse Many-to-Many relation
                        StockCardWarehouse: (warehouseIds ?? []).length > 0 ? {
                            create: (warehouseIds ?? []).map(warehouseId => ({
                                warehouse: { connect: { id: warehouseId } },
                            })),
                        } : undefined,

                    } as Prisma.StockCardCreateInput,
                });
                return resultWithWarehouse;
            }
        } catch (error) {
            logger.error("Error creating StockCard:", error);
            throw new Error("Could not create StockCard");
        }
    }

    async updateStockCard(id: string, stockCard: Partial<StockCard>, warehouseIds?: string[]): Promise<StockCard> {
        try {
            return await prisma.stockCard.update({
                where: { id },
                data: {
                    productCode: stockCard.productCode,
                    productName: stockCard.productName,
                    invoiceName: stockCard.invoiceName,
                    shortDescription: stockCard.shortDescription,
                    description: stockCard.description, 
                    brand: stockCard.brand,
                    unitOfMeasure: stockCard.unitOfMeasure,
                    productType: stockCard.productType,
                    marketNames: stockCard.marketNames,
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

                    // StockCardWarehouse Many-to-Many relation
                    StockCardWarehouse: (warehouseIds ?? []).length > 0 ? {
                        create: (warehouseIds ?? []).map(warehouseId => ({
                            warehouse: { connect: { id: warehouseId } },
                        })),
                    } : undefined,
                } as Prisma.StockCardUpdateInput,
            });
        } catch (error) {
            logger.error("Error updating StockCard:", error);
            throw new Error("Could not update StockCard");
        }
    }

    async deleteStockCard(id: string): Promise<{ success: boolean; message: string }> {
        try {
            await prisma.stockCard.delete({
                where: { id },
            });
            return { success: true, message: "StockCard successfully deleted" };
        } catch (error) {
            logger.error("Error deleting StockCard:", error);
            return { success: false, message: "Could not delete StockCard" };
        }
    }

    async getStockCardById(id: string): Promise<StockCard | null> {
        try {
            return await prisma.stockCard.findUnique({
                where: { id },
                include: stockCardRelations,
            });
        } catch (error) {
            logger.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getAllStockCards(): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany({
                include: stockCardRelations,
            });
        } catch (error) {
            logger.error("Error finding all StockCards:", error);
            throw new Error("Could not find all StockCards");
        }
    }

    async getStockCardsWithFilters(filters: Partial<StockCard>): Promise<StockCard[] | null> {
        try {
            return await prisma.stockCard.findMany({
                where: filters,
                include: stockCardRelations,
            });
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
        warehouseIds?: string[];
        profitMargin?: ProfitMargin[];
        receiptDetail?: ReceiptDetail[];

    }): Promise<StockCard | null> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                const getCurrent = await prisma.current.findMany({
                    where: { currentCode: data.current?.currentCode },
                });

                if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || !getCurrent[0].currentType)) {
                    const stockCard = await prisma.stockCard.create({
                        data: {
                            productCode: data.stockCard.productCode,
                            productName: data.stockCard.productName,
                            invoiceName: data.stockCard.invoiceName,
                            shortDescription: data.stockCard.shortDescription,
                            description: data.stockCard.description,
                            brand: data.stockCard.brand,
                            unitOfMeasure: data.stockCard.unitOfMeasure,
                            productType: data.stockCard.productType,
                            marketNames: data.stockCard.marketNames,
                            riskQuantities: data.stockCard.riskQuantities,
                            stockStatus: data.stockCard.stockStatus,
                            hasExpirationDate: data.stockCard.hasExpirationDate,
                            allowNegativeStock: data.stockCard.allowNegativeStock,
        
                            company: data.stockCard.companyCode ? {
                                connect: { companyCode: data.stockCard.companyCode },
                            } : undefined,
        
                            branch: data.stockCard.branchCode ? {
                                connect: { branchCode: data.stockCard.branchCode },
                            } : undefined,
    
                            // StockCardWarehouse Many-to-Many relation
                            StockCardWarehouse: (data.warehouseIds ?? []).length > 0 ? {
                                create: (data.warehouseIds ?? []).map(warehouseId => ({
                                    warehouse: { connect: { id: warehouseId } },
                                })),
                            } : undefined,
                        } as Prisma.StockCardCreateInput,
                    });

                    if (data.barcodes) {
                        await prisma.stockCardBarcode.createMany({
                            data: data.barcodes.map((barcode) => ({
                                ...barcode,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.attributes) {
                        await prisma.stockCardAttribute.createMany({
                            data: data.attributes.map((attribute) => ({
                                ...attribute,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.categoryItems) {
                        await prisma.stockCardCategoryItem.createMany({
                            data: data.categoryItems.map((categoryItem) => ({
                                ...categoryItem,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.priceListItems) {
                        await prisma.stockCardPriceListItems.createMany({
                            data: data.priceListItems.map((priceListItem) => ({
                                ...priceListItem,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.taxRates) {
                        await prisma.stockCardTaxRate.createMany({
                            data: data.taxRates.map((taxRate) => ({
                                ...taxRate,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.profitMargin) {
                        await prisma.profitMargin.createMany({
                            data: data.profitMargin.map((profitMargin) => ({
                                ...profitMargin,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    if (data.receiptDetail) {
                        await prisma.receiptDetail.createMany({
                            data: data.receiptDetail.map((receiptDetail) => ({
                                ...receiptDetail,
                                stockCardId: stockCard.id,
                            })),
                        });
                    }

                    return stockCard;
                } else {
                    logger.info("Current Role is not Manufacturer");
                    return null;
                }
            });

            return result;
        } catch (error) {
            logger.error("Error creating StockCard with relations:", error);
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
        warehouseIds?: string[];
        profitMargin?: ProfitMargin[];
        receiptDetail?: ReceiptDetail[];
    }): Promise<StockCard | null> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                const getCurrent = await prisma.current.findMany({
                    where: { currentCode: data.current?.currentCode },
                });

                if (getCurrent && (getCurrent[0].currentType === "Manufacturer" || !getCurrent[0].currentType)) {
                    const stockCard = await prisma.stockCard.update({
                        where: { id },
                        data: {
                            productCode: data.stockCard.productCode,
                            productName: data.stockCard.productName,
                            invoiceName: data.stockCard.invoiceName,
                            shortDescription: data.stockCard.shortDescription,
                            description: data.stockCard.description,
                            brand: data.stockCard.brand,
                            unitOfMeasure: data.stockCard.unitOfMeasure,
                            productType: data.stockCard.productType,
                            marketNames: data.stockCard.marketNames,
                            riskQuantities: data.stockCard.riskQuantities,
                            stockStatus: data.stockCard.stockStatus,
                            hasExpirationDate: data.stockCard.hasExpirationDate,
                            allowNegativeStock: data.stockCard.allowNegativeStock,
        
                            Company: data.stockCard.companyCode ? {
                                connect: { companyCode: data.stockCard.companyCode },
                            } : undefined,
        
                            Branch: data.stockCard.branchCode ? {
                                connect: { branchCode: data.stockCard.branchCode },
                            } : undefined,
        
                            // StockCardWarehouse Many-to-Many relation
                            StockCardWarehouse: (data.warehouseIds ?? []).length > 0 ? {
                                create: (data.warehouseIds ?? []).map(warehouseId => ({
                                    warehouse: { connect: { id: warehouseId } },
                                })),
                            } : undefined,
                        } as Prisma.StockCardUpdateInput,
                    });

                    if (data.barcodes) {
                        await Promise.all(
                            data.barcodes.map((barcode) =>
                                prisma.stockCardBarcode.update({
                                    where: { id: barcode.id },
                                    data: barcode,
                                })
                            )
                        );
                    }

                    if (data.attributes) {
                        await Promise.all(
                            data.attributes.map((attribute) =>
                                prisma.stockCardAttribute.update({
                                    where: { id: attribute.id },
                                    data: attribute,
                                })
                            )
                        );
                    }

                    if (data.categoryItems) {
                        await Promise.all(
                            data.categoryItems.map((categoryItem) =>
                                prisma.stockCardCategoryItem.update({
                                    where: { id: categoryItem.id },
                                    data: categoryItem,
                                })
                            )
                        );
                    }

                    if (data.priceListItems) {
                        await Promise.all(
                            data.priceListItems.map((priceListItem) =>
                                prisma.stockCardPriceListItems.update({
                                    where: { id: priceListItem.id },
                                    data: priceListItem,
                                })
                            )
                        );
                    }

                    if (data.taxRates) {
                        await Promise.all(
                            data.taxRates.map((taxRate) =>
                                prisma.stockCardTaxRate.update({
                                    where: { id: taxRate.id },
                                    data: taxRate,
                                })
                            )
                        );
                    }

                    if (data.profitMargin) {
                        await Promise.all(
                            data.profitMargin.map((profitMargin) =>
                                prisma.profitMargin.update({
                                    where: { id: profitMargin.id },
                                    data: profitMargin,
                                })
                            )
                        );
                    }

                    if (data.receiptDetail) {
                        await Promise.all(
                            data.receiptDetail.map((receiptDetail) =>
                                prisma.receiptDetail.update({
                                    where: { id: receiptDetail.id },
                                    data: receiptDetail,
                                })
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
            logger.error("Error updating StockCard with relations:", error);
            throw new Error("Could not update StockCard with relations");
        }
    }

    async deleteStockCardsWithRelations(id: string): Promise<boolean> {
        try {
            return await prisma.$transaction(async (prisma) => {
                await prisma.stockCard.delete({
                    where: { id },
                });

                await prisma.stockCardBarcode.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardAttribute.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardCategoryItem.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardPriceListItems.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardTaxRate.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.profitMargin.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.receiptDetail.deleteMany({
                    where: { productCode: id },
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
