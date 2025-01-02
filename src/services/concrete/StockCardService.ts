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
import { asyncHandler } from '../../utils/asyncHandler';
import { extractUsernameFromToken } from "./extractUsernameService";

interface SearchCriteria {
    query?: string; // Genel bir arama için
    productCode?: string;
    productName?: string;
    barcodes?: string;
    marketNames?: string;
    priceListBarcode?: string;
}

export class StockCardService {


    async createStockCard(stockCard: StockCard, warehouseIds: string[] | undefined, bearerToken: string): Promise<StockCard> {
        try {
            if (warehouseIds = undefined) {
                const username = extractUsernameFromToken(bearerToken);
                const resultWithoutWarehouse = await prisma.stockCard.create({
                    data: {
                        ...stockCard,

                        createdByUser: {
                            connect: {
                                username: username
                                }
                        },
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
            } else {
                const username = extractUsernameFromToken(bearerToken);
                const resultWithWarehouse = await prisma.stockCard.create({
                    data: {
                        ...stockCard,

                        createdByUser: {
                            connect: {
                                username: username
                                }
                        },
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
            console.error("Error creating StockCard:", error);
            logger.error("Error creating StockCard:", error);
            throw new Error("Could not create StockCard");
        }
    }

    async updateStockCard(id: string, stockCard: Partial<StockCard>, warehouseIds?: string[]): Promise<StockCard> {
        try {
            return await prisma.stockCard.update({
                where: { id },
                data: {
                    ...stockCard,

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
                include: {
                    brand: true,
                    branch: true,
                    company: true,
                },
            });
        } catch (error) {
            logger.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getAllStockCards(): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany({
                include: {
                    brand: true,
                    branch: true,
                    company: true,
                },
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
                include: {
                    brand: true,
                    branch: true,
                    company: true,
                },
            });
        } catch (error) {
            logger.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }

    createStockCardsWithRelations = asyncHandler(async (data: {
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

    }) => {
        const result = await prisma.$transaction(async (prisma) => {
            console.log(data);
            const stockCard = await prisma.stockCard.create({
                data: {
                    productCode: data.stockCard?.productCode,
                    productName: data.stockCard?.productName,
                    unit: data.stockCard?.unit,
                    shortDescription: data.stockCard?.shortDescription,
                    description: data.stockCard?.description,
                    productType: data.stockCard?.productType,
                    gtip: data.stockCard?.gtip,
                    pluCode: data.stockCard?.pluCode,
                    desi: data.stockCard?.desi,
                    adetBoleni: data.stockCard?.adetBoleni,
                    siraNo: data.stockCard?.siraNo,
                    raf: data.stockCard?.raf,
                    karMarji: data.stockCard?.karMarji,
                    riskQuantities: data.stockCard?.riskQuantities,
                    stockStatus: data.stockCard?.stockStatus,
                    hasExpirationDate: data.stockCard?.hasExpirationDate,
                    allowNegativeStock: data.stockCard?.allowNegativeStock,
                    maliyetFiyat: data.stockCard?.maliyet,
                    maliyetDoviz: data.stockCard?.maliyetDoviz,

                    company: data.stockCard.companyCode ? {
                        connect: { companyCode: data.stockCard.companyCode },
                    } : undefined,

                    branch: data.stockCard.branchCode ? {
                        connect: { branchCode: data.stockCard.branchCode },
                    } : undefined,

                    brand: data.stockCard.brandId ? {
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
                                stockCardCategory: {
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
                                price: priceListItem.price ?? 0,
                                vatRate: priceListItem.vatRate ?? 0,
                                barcode: priceListItem.barcode,
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
                                taxName: taxRate.taxName ?? "defaultTaxName", // Add this line
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
                                warehouse: { connect: { id: warehouse.warehouseId } },
                                quantity: warehouse?.quantity,
                            }
                        })
                    )
                );
            }
            const id = stockCard.id;
            return prisma.stockCard.findUnique({
                where: { id },
                include: {
                    branch: true,
                    company: true,
                    barcodes: true,
                    brand: true,
                    stockCardAttributeItems: {
                        include: {
                            attribute: true,
                        }
                    },
                    stockCardEFatura: true,
                    stockCardManufacturer: true,
                    stockCardMarketNames: true,
                    stockCardPriceLists: {
                        include: {
                            priceList: true,
                        }
                    },
                    stockCardWarehouse: {
                        include: {
                            warehouse: true,
                        }
                    },
                    taxRates: true,
                    stockCardCategoryItem: {
                        include: {
                            stockCardCategory: true,
                        }
                    },
                }
            });
        }, { timeout: 30000 });

        return result;
    });

    updateStockCardsWithRelations = asyncHandler(async (_id: string, data: {
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
    }) => {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. StockCard'ı güncelle
            const updatedStockCard = await prisma.stockCard.update({
                where: { id: _id },
                data: {
                    productName: data.stockCard.productName,
                    unit: data.stockCard.unit,
                    shortDescription: data.stockCard.shortDescription,
                    description: data.stockCard.description,
                    productType: data.stockCard.productType,
                    gtip: data.stockCard.gtip,
                    pluCode: data.stockCard.pluCode,
                    desi: data.stockCard.desi,
                    adetBoleni: data.stockCard.adetBoleni,
                    siraNo: data.stockCard.siraNo,
                    raf: data.stockCard.raf,
                    karMarji: data.stockCard.karMarji,
                    riskQuantities: data.stockCard.riskQuantities,
                    stockStatus: data.stockCard.stockStatus,
                    hasExpirationDate: data.stockCard.hasExpirationDate,
                    allowNegativeStock: data.stockCard.allowNegativeStock,
                    maliyet: data.stockCard?.maliyet,
                    maliyetDoviz: data.stockCard?.maliyetDoviz,

                    brand: data.stockCard.brandId ? {
                        connect: { id: data.stockCard.brandId },
                    } : undefined,
                },
            });

            // 2. İlişkili verileri sil ve yeniden ekle

            // 2.1. Attributes (StockCardAttributeItems)
            await prisma.stockCardAttributeItems.deleteMany({
                where: { stockCardId: _id },
            });

            if (data.attributes && data.attributes.length > 0) {
                await prisma.stockCardAttributeItems.createMany({
                    data: data.attributes.map((attr) => ({
                        stockCardId: _id,
                        attributeId: attr.attributeId,
                    })),
                });
            }

            // 2.2. Barcodes (StockCardBarcode)
            await prisma.stockCardBarcode.deleteMany({
                where: { stockCardId: _id },
            });

            if (data.barcodes && data.barcodes.length > 0) {
                await prisma.stockCardBarcode.createMany({
                    data: data.barcodes.map((barcode) => ({
                        stockCardId: _id,
                        barcode: barcode.barcode,
                    })),
                });
            }

            // 2.3. Category Items (StockCardCategoryItem)
            await prisma.stockCardCategoryItem.deleteMany({
                where: { stockCardId: _id },
            });

            if (data.categoryItem && data.categoryItem.length > 0) {
                await prisma.stockCardCategoryItem.createMany({
                    data: data.categoryItem.map((category) => ({
                        stockCardId: _id,
                        categoryId: category.categoryId,
                    })),
                });
            }

            // 2.4. Market Names (StockCardMarketNames)
            await prisma.stockCardMarketNames.deleteMany({
                where: { stockCardId: _id },
            });

            if (data.marketNames && data.marketNames.length > 0) {
                await prisma.stockCardMarketNames.createMany({
                    data: data.marketNames.map((marketName) => ({
                        stockCardId: _id,
                        marketName: marketName.marketName,
                    })),
                });
            }

            // 3. İlişkili verileri `id` ile güncelle

            // 3.1. Price List Items (StockCardPriceListItems)
            if (data.priceListItems && data.priceListItems.length > 0) {
                const existingItems = await prisma.stockCardPriceListItems.findMany({
                    where: { stockCardId: _id },
                });

                const existingItemIds = existingItems.map(item => item.id);
                const incomingItemIds = data.priceListItems.map(item => item.id);

                for (const item of data.priceListItems) {
                    if (item.id) {
                        await prisma.stockCardPriceListItems.upsert({
                            where: { id: item.id },
                            update: {
                                priceListId: item.priceListId,
                                price: item.price,
                                vatRate: item.vatRate,
                                barcode: item.barcode,
                            },
                            create: {
                                stockCardId: _id,
                                priceListId: item.priceListId,
                                price: item.price,
                                vatRate: item.vatRate,
                                barcode: item.barcode,
                            },
                        });
                    } else {
                        await prisma.stockCardPriceListItems.create({
                            data: {
                                stockCardId: _id,
                                priceListId: item.priceListId,
                                price: item.price,
                                vatRate: item.vatRate,
                                barcode: item.barcode,
                            },
                        });
                    }
                }

                // Delete items that are not in the incoming data
                const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));
                await prisma.stockCardPriceListItems.deleteMany({
                    where: { id: { in: itemsToDelete } },
                });
            }

            // 3.2. StockCardWarehouse
            if (data.stockCardWarehouse && data.stockCardWarehouse.length > 0) {
                for (const warehouseItem of data.stockCardWarehouse) {
                    await prisma.stockCardWarehouse.upsert({
                        where: { id: warehouseItem.id },
                        update: {
                            quantity: warehouseItem.quantity,
                        },
                        create: {
                            id: warehouseItem.id,
                            stockCardId: _id,
                            warehouseId: warehouseItem.warehouseId,
                            quantity: warehouseItem.quantity,
                        },
                    });
                }
            }

            // 3.3. eFatura (StockCardEFatura)
            if (data.eFatura && data.eFatura.length > 0) {
                for (const eFaturaItem of data.eFatura) {
                    await prisma.stockCardEFatura.upsert({
                        where: { id: eFaturaItem.id },
                        update: {
                            productCode: eFaturaItem.productCode,
                            productName: eFaturaItem.productName,
                        },
                        create: {
                            id: eFaturaItem.id,
                            stockCardId: _id,
                            productCode: eFaturaItem.productCode,
                            productName: eFaturaItem.productName,
                        },
                    });
                }
            }

            // 3.4. Manufacturers (StockCardManufacturer)
            if (data.manufacturers && data.manufacturers.length > 0) {
                for (const manufacturer of data.manufacturers) {
                    await prisma.stockCardManufacturer.upsert({
                        where: { id: manufacturer.id },
                        update: {
                            productCode: manufacturer.productCode,
                            productName: manufacturer.productName,
                            barcode: manufacturer.barcode,
                            brandId: manufacturer.brandId,
                            currentId: manufacturer.currentId,
                        },
                        create: {
                            stockCardId: _id,
                            productCode: manufacturer.productCode,
                            productName: manufacturer.productName,
                            barcode: manufacturer.barcode,
                            brandId: manufacturer.brandId,
                            currentId: manufacturer.currentId,
                        },
                    });
                }
            }

            // 4. Güncellenmiş veriyi döndür
            return prisma.stockCard.findUnique({
                where: { id: _id },
                include: {
                    branch: true,
                    company: true,
                    barcodes: true,
                    brand: true,
                    stockCardAttributeItems: {
                        include: {
                            attribute: true,
                        }
                    },
                    stockCardEFatura: true,
                    stockCardManufacturer: true,
                    stockCardMarketNames: true,
                    stockCardPriceLists: {
                        include: {
                            priceList: true,
                        }
                    },
                    stockCardWarehouse: {
                        include: {
                            warehouse: true,
                        }
                    },
                    taxRates: true,
                    stockCardCategoryItem: {
                        include: {
                            stockCardCategory: true,
                        }
                    },
                }
            });
        });

        return result;
    });


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

    async deleteManyStockCardsWithRelations(ids: string[]): Promise<boolean> {
        try {
            return await prisma.$transaction(async (prisma) => {

                await prisma.stockCardBarcode.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardAttributeItems.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardCategoryItem.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardPriceListItems.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardTaxRate.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardWarehouse.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardEFatura.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardManufacturer.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCardMarketNames.deleteMany({
                    where: { stockCardId: { in: ids } },
                });

                await prisma.stockCard.deleteMany({
                    where: { id: { in: ids } },
                });

                return true;
            }, { timeout: 3000 });
        } catch (error) {
            logger.error("Error deleting many StockCards with relations:", error);
            throw new Error("Could not delete many StockCards with relations");
        }
    }

    async getStockCardsWithRelationsById(id: string): Promise<StockCard | null> {
        try {
            return await prisma.stockCard.findUnique({
                where: { id },
                include: {
                    branch: true,
                    company: true,
                    barcodes: true,
                    brand: true,
                    stockCardAttributeItems: {
                        include: {
                            attribute: true,
                        }
                    },
                    stockCardEFatura: true,
                    stockCardManufacturer: true,
                    stockCardMarketNames: true,
                    stockCardPriceLists: {
                        include: {
                            priceList: true,
                        }
                    },
                    stockCardWarehouse: {
                        include: {
                            warehouse: true,
                        }
                    },
                    taxRates: true,
                    stockCardCategoryItem: {
                        include: {
                            stockCardCategory: true,
                        }
                    },
                }
            });
        } catch (error) {
            logger.error("Error finding StockCard with relations by ID:", error);
            throw new Error("Could not find StockCard with relations by ID");
        }
    }

    async getParentCategories(categoryId: string, categories: any[] = []): Promise<any[]> {
        const category = await prisma.stockCardCategory.findUnique({
            where: { id: categoryId },
            include: { parentCategory: true },
        });

        if (!category) return categories;

        categories.push(category as any);

        if (category.parentCategoryId) {
            return this.getParentCategories(category.parentCategoryId, categories);
        } else {
            return categories;
        }
    }

    getAllStockCardsWithRelations = asyncHandler(async (): Promise<StockCard[]> => {

        const stockCards = await prisma.stockCard.findMany({
            include: {
                barcodes: true,
                brand: true,
                stockCardAttributeItems: {
                    include: {
                        attribute: true,
                    }
                },
                stockCardEFatura: true,
                stockCardManufacturer: {
                    include: {
                        brand: true,
                        current: true,
                    }
                },
                stockCardMarketNames: true,
                stockCardPriceLists: {
                    include: {
                        priceList: true,
                    }
                },
                stockCardWarehouse: {
                    include: {
                        warehouse: true,
                    }
                },
                taxRates: true,
                stockCardCategoryItem: {
                    include: {
                        stockCardCategory: true,
                    }
                },
            }
        });

        for (const stockCard of stockCards) {
            for (const categoryItem of stockCard.stockCardCategoryItem) {
                (categoryItem as any).parentCategories = await this.getParentCategories(categoryItem.categoryId);
            }
        }

        return stockCards;
    });

    searchStockCards = asyncHandler(async (criteria: SearchCriteria) => {
        const where: Prisma.StockCardWhereInput = {
            OR: [],
        };

        if (!where.OR) {
            where.OR = [];
        }

        // Eğer belirli kriterler sağlanmışsa, bunları ekle
        if (criteria.productCode) {
            where.OR.push({
                productCode: { contains: criteria.productCode, mode: 'insensitive' },
            });
        }

        if (criteria.productName) {
            where.OR.push({
                productName: { contains: criteria.productName, mode: 'insensitive' },
            });
        }

        if (criteria.barcodes) {
            where.OR.push({
                barcodes: {
                    some: { barcode: { contains: criteria.barcodes, mode: 'insensitive' } },
                },
            });
        }

        if (criteria.marketNames) {
            where.OR.push({
                stockCardMarketNames: {
                    some: { marketName: { contains: criteria.marketNames, mode: 'insensitive' } },
                },
            });
        }

        if (criteria.priceListBarcode) {
            where.OR.push({
                stockCardPriceLists: {
                    some: { barcode: { contains: criteria.priceListBarcode, mode: 'insensitive' } },
                },
            });
        }

        // Eğer hiçbir kriter belirtilmemişse, genel query'yi tüm alanlarda ara
        if (where.OR.length === 0 && criteria.query) {
            where.OR.push(
                { productCode: { contains: criteria.query, mode: 'insensitive' } },
                { productName: { contains: criteria.query, mode: 'insensitive' } },
                { barcodes: { some: { barcode: { contains: criteria.query, mode: 'insensitive' } } } },
                { stockCardMarketNames: { some: { marketName: { contains: criteria.query, mode: 'insensitive' } } } },
                { stockCardPriceLists: { some: { barcode: { contains: criteria.query, mode: 'insensitive' } } } }
            );
        }

        // Eğer hem spesifik kriterler hem genel bir query yoksa, hata döndür
        if (where.OR.length === 0) {
            throw new Error('En az bir arama kriteri veya genel bir sorgu belirtmelisiniz.');
        }

        const stockCards = await prisma.stockCard.findMany({
            where,
            include: {
                barcodes: true,
                brand: true,
                stockCardAttributeItems: {
                    include: {
                        attribute: true,
                    },
                },
                stockCardEFatura: true,
                stockCardManufacturer: {
                    include: {
                        brand: true,
                        current: true,
                    },
                },
                stockCardMarketNames: true,
                stockCardPriceLists: {
                    include: {
                        priceList: true,
                    },
                },
                stockCardWarehouse: {
                    include: {
                        warehouse: true,
                    },
                },
                taxRates: true,
                stockCardCategoryItem: {
                    include: {
                        stockCardCategory: true,
                    },
                },
            },
        });

        return stockCards;
    });

    getStockCardsByWarehouseId = asyncHandler(async (warehouseId: string) => {
        const stockCards = await prisma.stockCard.findMany({
            where: {
                stockCardWarehouse: {
                    some: {
                        warehouseId,
                    },
                },
            },
            include: {
                barcodes: true,
                brand: true,
                stockCardAttributeItems: {
                    include: {
                        attribute: true,
                    },
                },
                stockCardEFatura: true,
                stockCardManufacturer: {
                    include: {
                        brand: true,
                        current: true,
                    },
                },
                stockCardMarketNames: true,
                stockCardPriceLists: {
                    include: {
                        priceList: true,
                    },
                },
                stockCardWarehouse: {
                    include: {
                        warehouse: true,
                    },
                },
                taxRates: true,
                stockCardCategoryItem: {
                    include: {
                        stockCardCategory: true,
                    },
                },
            },
        });

        return stockCards;
    });

    searchStockCardsByWarehouseId = asyncHandler(async (warehouseId: string, criteria: SearchCriteria) => {
        const where: Prisma.StockCardWhereInput = {
            OR: [],
            stockCardWarehouse: {
                some: {
                    warehouseId,
                },
            },
        };

        if (!where.OR) {
            where.OR = [];
        }

        // Eğer belirli kriterler sağlanmışsa, bunları ekle
        if (criteria.productCode) {
            where.OR.push({
                productCode: { contains: criteria.productCode, mode: 'insensitive' },
            });
        }

        if (criteria.productName) {
            where.OR.push({
                productName: { contains: criteria.productName, mode: 'insensitive' },
            });
        }

        if (criteria.barcodes) {
            where.OR.push({
                barcodes: {
                    some: { barcode: { contains: criteria.barcodes, mode: 'insensitive' } },
                },
            });
        }

        if (criteria.marketNames) {
            where.OR.push({
                stockCardMarketNames: {
                    some: { marketName: { contains: criteria.marketNames, mode: 'insensitive' } },
                },
            });
        }

        if (criteria.priceListBarcode) {
            where.OR.push({
                stockCardPriceLists: {
                    some: { barcode: { contains: criteria.priceListBarcode, mode: 'insensitive' } },
                },
            });
        }

        // Eğer hiçbir kriter belirtilmemişse, genel query'yi tüm alanlarda ara
        if (where.OR.length === 0 && criteria.query) {
            where.OR.push(
                { productCode: { contains: criteria.query, mode: 'insensitive' } },
                { productName: { contains: criteria.query, mode: 'insensitive' } },
                { barcodes: { some: { barcode: { contains: criteria.query, mode: 'insensitive' } } } },
                { stockCardMarketNames: { some: { marketName: { contains: criteria.query, mode: 'insensitive' } } } },
                { stockCardPriceLists: { some: { barcode: { contains: criteria.query, mode: 'insensitive' } } } }
            );
        }

        // Eğer hem spesifik kriterler hem genel bir query yoksa, hata döndür
        if (where.OR.length === 0) {
            throw new Error('En az bir arama kriteri veya genel bir sorgu belirtmelisiniz.');
        }

        const stockCards = await prisma.stockCard.findMany({
            where,
            include: {
                barcodes: true,
                brand: true,
                stockCardAttributeItems: {
                    include: {
                        attribute: true,
                    },
                },
                stockCardEFatura: true,
                stockCardManufacturer: {
                    include: {
                        brand: true,
                        current: true,
                    },
                },
                stockCardMarketNames: true,
                stockCardPriceLists: {
                    include: {
                        priceList: true,
                    },
                },
                stockCardWarehouse: {
                    include: {
                        warehouse: true,
                    },
                },
                taxRates: true,
                stockCardCategoryItem: {
                    include: {
                        stockCardCategory: true,
                    },
                },
            },
        });

        return stockCards;
    });

}

export default StockCardService;