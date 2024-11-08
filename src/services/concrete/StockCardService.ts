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

export class StockCardService {


    async createStockCard(stockCard: StockCard, warehouseIds: string[] | undefined): Promise<StockCard> {
        try {
            if (warehouseIds = undefined) {
                const resultWithoutWarehouse = await prisma.stockCard.create({
                    data: {
                        ...stockCard,

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
                const resultWithWarehouse = await prisma.stockCard.create({
                    data: {
                        ...stockCard,

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
                                warehouse: { connect: { id: warehouse.id } },
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


    }) {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                console.log(data);
                const stockCard = await prisma.stockCard.update({
                    where: { id: data.stockCard.id },
                    data: {
                        ...data.stockCard,

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

                // Veritabanındaki mevcut barkodları al
                const existingBarcodes = await prisma.stockCardBarcode.findMany({
                    where: { stockCardId: stockCardId },
                    select: { barcode: true },
                });

                // Gelen `data.barcodes` içindeki barkodları listeye dönüştür
                const newBarcodeValues = data.barcodes ? data.barcodes.map((barcode) => barcode.barcode) : [];

                // Mevcut olup yeni barkod listesinde bulunmayanları sil
                const barcodesToDelete = existingBarcodes.filter(
                    (existingBarcode) => !newBarcodeValues.includes(existingBarcode.barcode)
                );

                await Promise.all(
                    barcodesToDelete.map(async (barcode) => {
                        await prisma.stockCardBarcode.delete({
                            where: { barcode: barcode.barcode },
                        });
                    })
                );

                // Yeni olup mevcut listede olmayan barkodları ekleyin
                const existingBarcodeValues = existingBarcodes.map((barcode) => barcode.barcode);
                const barcodesToCreate = newBarcodeValues.filter(
                    (newBarcode) => !existingBarcodeValues.includes(newBarcode)
                );

                await Promise.all(
                    barcodesToCreate.map(async (barcode) => {
                        await prisma.stockCardBarcode.create({
                            data: {
                                barcode: barcode,
                                stockCard: { connect: { id: stockCardId } },
                            },
                        });
                    })
                );

                // Attribute işlemleri
                const existingAttributes = await prisma.stockCardAttributeItems.findMany({
                    where: { stockCardId: stockCardId },
                    select: { attributeId: true }
                });
                const newAttributeIds = data.attributes ? data.attributes.map((attribute) => attribute.attributeId) : [];
                const attributesToDelete = existingAttributes.filter((existingAttribute) => !newAttributeIds.includes(existingAttribute.attributeId));

                await Promise.all(
                    attributesToDelete.map(async (attribute) => {
                        await prisma.stockCardAttributeItems.delete({
                            where: { id: attribute.attributeId },
                        });
                    })
                );

                if (data.attributes) {
                    await Promise.all(
                        data.attributes.map(async (attribute) => {
                            const existingAttribute = await prisma.stockCardAttributeItems.findFirst({
                                where: {
                                    stockCardId: stockCardId,
                                    attributeId: attribute.attributeId
                                },
                            });
                            if (!existingAttribute) {
                                await prisma.stockCardAttributeItems.create({
                                    data: {
                                        attribute: { connect: { id: attribute.attributeId } },
                                        stockCard: { connect: { id: stockCardId } },
                                    },
                                });
                            }
                        })
                    );
                }

                // MarketName işlemleri
                const existingMarketNames = await prisma.stockCardMarketNames.findMany({
                    where: { stockCardId: stockCardId },
                    select: { marketName: true }
                });
                const newMarketNames = data.marketNames ? data.marketNames.map((marketName) => marketName.marketName) : [];
                const marketNamesToDelete = existingMarketNames.filter((existingMarketName) => !newMarketNames.includes(existingMarketName.marketName));

                await Promise.all(
                    marketNamesToDelete.map(async (marketName) => {
                        await prisma.stockCardMarketNames.delete({
                            where: { id: marketName.marketName },
                        });
                    })
                );

                if (data.marketNames) {
                    await Promise.all(
                        data.marketNames.map(async (marketName) => {
                            const existingMarketName = await prisma.stockCardMarketNames.findFirst({
                                where: {
                                    stockCardId: stockCardId,
                                    marketName: marketName.id
                                },
                            });
                            if (!existingMarketName) {
                                await prisma.stockCardMarketNames.create({
                                    data: {
                                        marketName: marketName.id,
                                        stockCardId: stockCardId,
                                    },
                                });
                            }
                        })
                    );
                }

                // Mevcut CategoryItem'leri al
                const existingCategoryItems = await prisma.stockCardCategoryItem.findMany({
                    where: { stockCardId: stockCardId },
                    select: { id: true, categoryId: true },
                });

                // Gelen yeni `categoryItem` öğelerini `categoryId` olarak listeye dönüştür
                const newCategoryIds = data.categoryItem ? data.categoryItem.map((categoryItem) => categoryItem.categoryId) : [];

                // Veritabanında olup yeni listede olmayan `categoryId` öğelerini belirleyip sil
                const categoryItemsToDelete = existingCategoryItems.filter(
                    (existingCategoryItem) => !newCategoryIds.includes(existingCategoryItem.categoryId)
                );

                await Promise.all(
                    categoryItemsToDelete.map(async (categoryItem) => {
                        await prisma.stockCardCategoryItem.delete({
                            where: { id: categoryItem.id }, // `categoryId` yerine `id` kullanarak güvenli silme işlemi yapıyoruz
                        });
                    })
                );

                // Yeni olup veritabanında olmayan `categoryId` öğelerini belirleyip ekle
                const existingCategoryIds = existingCategoryItems.map((item) => item.categoryId);
                const categoryItemsToCreate = newCategoryIds.filter(
                    (categoryId) => !existingCategoryIds.includes(categoryId)
                );

                await Promise.all(
                    categoryItemsToCreate.map(async (categoryId) => {
                        await prisma.stockCardCategoryItem.create({
                            data: {
                                stockCardCategory: { connect: { id: categoryId } },
                                stockCard: { connect: { id: stockCardId } },
                            },
                        });
                    })
                );

                if (data.priceListItems) {
                    await Promise.all(
                        data.priceListItems.map((priceListItem) =>
                            prisma.stockCardPriceListItems.update({
                                where: { id: priceListItem.id },
                                data: {
                                    priceList: {
                                        connect: { id: priceListItem.priceListId }
                                    },
                                    stockCard: { connect: { id: stockCardId } },
                                    price: priceListItem.price ?? 0,
                                }
                            })
                        )
                    );
                }

                if (data.taxRates) {
                    await Promise.all(
                        data.taxRates.map((taxRate) =>
                            prisma.stockCardTaxRate.update({
                                where: { id: taxRate.id },
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
                            prisma.stockCardEFatura.update({
                                where: { id: eFatura.id },
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
                            prisma.stockCardManufacturer.update({
                                where: { id: manufacturer.id },
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


                if (data.stockCardWarehouse) {
                    await Promise.all(
                        data.stockCardWarehouse.map((warehouse) =>
                            prisma.stockCardWarehouse.update({
                                where: { id: warehouse.id },
                                data: {
                                    stockCard: { connect: { id: stockCardId } },
                                    warehouse: { connect: { id: warehouse.id } },
                                    quantity: warehouse?.quantity,
                                }
                            })
                        )
                    );
                }

                return stockCard;
            });

            return result;
        } catch (error) {
            logger.error("Error update StockCard with relations:", error);
            throw new Error("Could not update StockCard with relations");
        }
    };

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
            });
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
}

export default StockCardService;
