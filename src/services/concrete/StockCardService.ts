import {
    Prisma,
    StockCard,
    StockCardBarcode,
    StockCardCategoryItem,
    StockCardPriceListItems,
    StockCardTaxRate,
    StockCardVariation,
    StockCardWarehouse,
    StockCardManufacturer,
    StockCardAttributeItems,
    StockCardEFatura,
    StockCardMarketNames
} from "@prisma/client";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";
import { BaseRepository } from "../../repositories/baseRepository";

const stockCardRelations = {
    Branch: true,
    Company: true,
};

export class StockCardService {
    

    async createStockCard(stockCard: StockCard, warehouseIds: string[] | undefined): Promise<StockCard> {
        try {
            if (warehouseIds = undefined) {
                const resultWithoutWarehouse = await prisma.stockCard.create({
                    data: {
                        productCode: stockCard.productCode,
                        productName: stockCard.productName,
                        unit: stockCard.unit,
                        shortDescription: stockCard.shortDescription,
                        description: stockCard.description,
                        productType: stockCard.productType,
                        gtip: stockCard.gtip,
                        pluCode: stockCard.pluCode,
                        desi: stockCard.desi,
                        adetBoleni: stockCard.adetBoleni,
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

                        brand: stockCard.brandId ? {
                            connect: { id: stockCard.brandId },
                        } : undefined,
                    } as Prisma.StockCardCreateInput,
                });
                return resultWithoutWarehouse;
            }else {
                const resultWithWarehouse = await prisma.stockCard.create({
                    data: {
                        productCode: stockCard.productCode,
                        productName: stockCard.productName,
                        unit: stockCard.unit,
                        shortDescription: stockCard.shortDescription,
                        description: stockCard.description,
                        productType: stockCard.productType,
                        gtip: stockCard.gtip,
                        pluCode: stockCard.pluCode,
                        desi: stockCard.desi,
                        adetBoleni: stockCard.adetBoleni,
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

                        brand: stockCard.brandId ? {
                            connect: { id: stockCard.brandId },
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
                        unit: stockCard.unit,
                        shortDescription: stockCard.shortDescription,
                        description: stockCard.description,
                        productType: stockCard.productType,
                        gtip: stockCard.gtip,
                        pluCode: stockCard.pluCode,
                        desi: stockCard.desi,
                        adetBoleni: stockCard.adetBoleni,
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

                        brand: stockCard.brandId ? {
                            connect: { brand: stockCard.brandId },
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
        attributes?: StockCardAttributeItems[];
        barcodes?: StockCardBarcode[];
        categoryItem?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        stockCardWarehouse?: StockCardWarehouse[];
        eFatura?: StockCardEFatura[];
        manufacturers?: StockCardManufacturer[];
        marketNames?: StockCardMarketNames[];

    }) {
        try {
            const result = await prisma.$transaction(async (prisma) => {

                    const stockCard = await prisma.stockCard.create({
                        data: {
                        productCode: data.stockCard.productCode,
                        productName: data.stockCard.productName,
                        unit: data.stockCard.unit,
                        shortDescription: data.stockCard.shortDescription,
                        description: data.stockCard.description,
                        productType: data.stockCard.productType,
                        gtip: data.stockCard.gtip,
                        pluCode: data.stockCard.pluCode,
                        desi: data.stockCard.desi,
                        adetBoleni: data.stockCard.adetBoleni,
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

                        Brand: data.stockCard.brandId ? {
                            connect: { id: data.stockCard.brandId },
                        } : undefined,

                        } as Prisma.StockCardCreateInput,
                    });
                    

                    const stockCardId = stockCard.id;

                    if (data.barcodes) {
                        await Promise.all(
                            data.barcodes.map((barcode) =>
                                prisma.stockCardBarcode.create({
                                    data: {
                                        barcode: barcode.barcode,
                                        stockCard: { connect: { id: stockCardId } },
                                    }
                                })
                            )
                        );
                    }

                    if (data.attributes) {
                        await Promise.all(
                            data.attributes.map((attribute) =>
                                prisma.stockCardAttributeItems.create({
                                    data: {
                                        attribute: {
                                            connect: { id: attribute.attributeId }
                                        },
                                        stockCard: { connect: { id: stockCardId } },
                                    }
                                })
                            )
                        );
                    }

                    if (data.categoryItem) {
                        await Promise.all(
                            data.categoryItem.map((categoryItem) =>
                                prisma.stockCardCategoryItem.create({
                                    data: {
                                        category: {
                                            connect: { id: categoryItem.categoryId }
                                        },
                                        stockCard: { connect: { id: stockCardId } },
                                    }
                                })
                            )
                        );
                    }

                    if (data.priceListItems) {
                        await Promise.all(
                            data.priceListItems.map((priceListItem) =>
                                prisma.stockCardPriceListItems.create({
                                    data: {
                                        priceList: {
                                            connect: { id: priceListItem.priceListId }
                                        },
                                        stockCard: { connect: { id: stockCardId } },
                                        price: priceListItem.price,
                                    }
                                })
                            )
                        );
                    }

                    if (data.taxRates) {
                        await Promise.all(
                            data.taxRates.map((taxRate) =>
                                prisma.stockCardTaxRate.create({
                                    data: {
                                        taxName: taxRate.taxName, // Add this line
                                        taxRate: taxRate.taxRate,
                                        stockCard: { connect: { id: stockCardId } },
                                    }
                                })
                            )
                        );
                    }

                    if (data.eFatura) {
                        await Promise.all(
                            data.eFatura.map((eFatura) =>
                                prisma.stockCardEFatura.create({
                                    data: {
                                        productCode: eFatura.productCode,
                                        productName: eFatura.productName,
                                        stockCardPriceListId: eFatura.stockCardPriceListId,
                                        stockCardId: stockCardId,
                                    }
                                })
                            )
                        );
                    }

                    if (data.manufacturers) {
                        await Promise.all(
                            data.manufacturers.map((manufacturer) =>
                                prisma.stockCardManufacturer.create({
                                    data: {
                                        productCode: manufacturer.productCode,
                                        productName: manufacturer.productName,
                                        barcode: manufacturer.barcode,
                                        brandId: manufacturer.brandId,
                                        currentId: manufacturer.currentId,
                                        stockCardId: stockCardId,
                                    }
                                })
                            )
                        );
                    }

                    if (data.marketNames) {
                        await Promise.all(
                            data.marketNames.map((marketName) =>
                                prisma.stockCardMarketNames.create({
                                    data: {
                                        marketName: marketName.marketName,
                                        stockCardId: stockCardId,
                                    }
                                })
                            )
                        );
                    }

                    if (data.stockCardWarehouse) {
                        await Promise.all(
                            data.stockCardWarehouse.map((warehouse) =>
                                prisma.stockCardWarehouse.create({
                                    data: {
                                        stockCard: { connect: { id: stockCardId } },
                                        warehouse: { connect: { id: warehouse.id } },
                                        quantity: warehouse.quantity,
                                    }
                                })
                            )
                        );
                    }

                    return stockCard;
            }, { timeout: 300000 }); // Increase the timeout to 30 seconds

            return result;
        } catch (error) {
            logger.error("Error creating StockCard with relations:", error);
            throw new Error("Could not create StockCard with relations");
        }
    }

    async updateStockCardsWithRelations(id: string, data: {
        stockCard: StockCard;
        attributes?: StockCardAttributeItems[];
        barcodes?: StockCardBarcode[];
        categoryItem?: StockCardCategoryItem[];
        priceListItems?: StockCardPriceListItems[];
        taxRates?: StockCardTaxRate[];
        stockCardWarehouse?: StockCardWarehouse[];
        eFatura?: StockCardEFatura[];
        manufacturers?: StockCardManufacturer[];
        marketNames?: StockCardMarketNames[];
    }): Promise<StockCard | null> {
        try {
            const result = await prisma.$transaction(async (prisma) => {

                    const stockCard = await prisma.stockCard.update({
                        where: { id },
                        data: {
                            productCode: data.stockCard.productCode,
                        productName: data.stockCard.productName,
                        unit: data.stockCard.unit,
                        shortDescription: data.stockCard.shortDescription,
                        description: data.stockCard.description,
                        productType: data.stockCard.productType,
                        gtip: data.stockCard.gtip,
                        pluCode: data.stockCard.pluCode,
                        desi: data.stockCard.desi,
                        adetBoleni: data.stockCard.adetBoleni,
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

                        brand: data.stockCard.brandId ? {
                            connect: { brand: data.stockCard.brandId },
                        } : undefined,

                        // StockCardWarehouse Many-to-Many relation
                        StockCardWarehouse: (data.stockCardWarehouse ?? []).length > 0 ? {
                            create: (data.stockCardWarehouse ?? []).map(warehouseId => ({
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
                                prisma.stockCardAttributeItems.update({
                                    where: { id: attribute.id },
                                    data: attribute,
                                })
                            )
                        );
                    }

                    if (data.categoryItem) {
                        await Promise.all(
                            data.categoryItem.map((categoryItem) =>
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

                    if (data.eFatura) {
                        await Promise.all(
                            data.eFatura.map((eFatura) =>
                                prisma.stockCardEFatura.update({
                                    where: { id: eFatura.id },
                                    data: eFatura,
                                })
                            )
                        );
                    }

                    if (data.manufacturers) {
                        await Promise.all(
                            data.manufacturers.map((manufacturer) =>
                                prisma.stockCardManufacturer.update({
                                    where: { id: manufacturer.id },
                                    data: manufacturer,
                                })
                            )
                        );
                    }

                    if (data.marketNames) {
                        await Promise.all(
                            data.marketNames.map((marketName) =>
                                prisma.stockCardMarketNames.update({
                                    where: { id: marketName.id },
                                    data: marketName,
                                })
                            )
                        );
                    }

                    return stockCard;
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

                await prisma.stockCardBarcode.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardAttributeItems.deleteMany({
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

                await prisma.stockCardWarehouse.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardEFatura.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardManufacturer.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCardMarketNames.deleteMany({
                    where: { stockCardId: id },
                });

                await prisma.stockCard.delete({
                    where: { id },
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
                include: {
                    ...stockCardRelations,
                    Barcodes: true,
                    Brand: true,
                    StockCardAttributeItems: true,
                    StockCardEFatura: true,
                    StockCardManufacturer: true,
                    StockCardMarketNames: true,
                    StockCardPriceLists: true,
                    StockCardWarehouse: true,
                    TaxRates: true,
                    Categories: true,
                }
            });
        } catch (error) {
            logger.error("Error finding StockCard with relations by ID:", error);
            throw new Error("Could not find StockCard with relations by ID");
        }
    }

    async getAllStockCardsWithRelations(): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany({
                include: {
                    ...stockCardRelations,
                    Barcodes: true,
                    Brand: true,
                    StockCardAttributeItems: {
                        include: {
                            attribute: true,
                        }
                    },
                    StockCardEFatura: true,
                    StockCardManufacturer: true,
                    StockCardMarketNames: true,
                    StockCardPriceLists: {
                        include: {
                            priceList: true,
                        }
                    },
                    StockCardWarehouse: {
                        include: {
                            warehouse: true,
                        }
                    },
                    TaxRates: true,
                    Categories: {
                        include: {
                            category: true,
                        }
                    },
                }
            });
        } catch (error) {
            logger.error("Error finding all StockCards with relations:", error);
            throw new Error("Could not find all StockCards with relations");
        }
    }
}

export default StockCardService;
