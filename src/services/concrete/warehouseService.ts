import prisma from "../../config/prisma";
import { Prisma, Warehouse, ReceiptType, StockTakeType, StockTakeStatus, StokManagementType, GCCode } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";


export interface StockTakeWarehouseProduct {
    stockCardId: string;
    quantity: number;
    note?: string;
}

export interface StockTakeWarehouse {
    warehouseId: string;
    branchCode: string;
    stockTakeType: StockTakeType;
    description?: string;
    reference?: string;
    products: StockTakeWarehouseProduct[];
}

export interface OrderPrepareWarehouse {
    id: string;
    warehouseId: string;
    branchCode: string;
    currentId: string;
    products: Array<{
        stockCardId: string;
        quantity: number;
    }>
}

export interface OrderReturnWarehouse {
    id: string;
    warehouseId: string;
    branchCode: string;
    currentId: string;
    products: Array<{
        stockCardId: string;
        quantity: number;
    }>
}

async function generateDocumentNumber(prisma: any, prefix: string): Promise<string> {
    const lastReceipt = await prisma.receipt.findFirst({
        where: {
            documentNo: {
                startsWith: prefix
            }
        },
        orderBy: {
            documentNo: 'desc'
        }
    });

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    if (!lastReceipt) {
        return `${prefix}${year}${month}00001`;
    }

    const lastNumber = parseInt(lastReceipt.documentNo.slice(-5));
    const newNumber = String(lastNumber + 1).padStart(5, '0');
    return `${prefix}${year}${month}${newNumber}`;
}

async function generateStockTakeDocumentNo(prisma: any): Promise<string> {
    const lastStockTake = await prisma.stockTake.findFirst({
        where: {
            documentNo: {
                startsWith: 'ST'
            }
        },
        orderBy: {
            documentNo: 'desc'
        }
    });

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    if (!lastStockTake) {
        return `ST${year}${month}00001`;
    }

    const lastNumber = parseInt(lastStockTake.documentNo.slice(-5));
    const newNumber = String(lastNumber + 1).padStart(5, '0');
    return `ST${year}${month}${newNumber}`;
}

export class WarehouseService {
    private warehouseRepository: BaseRepository<Warehouse>;

    constructor() {
        this.warehouseRepository = new BaseRepository<Warehouse>(prisma.warehouse);
    }

    async createWarehouse(warehouse: Warehouse, bearerToken: string): Promise<Warehouse> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdWarehouse = await prisma.warehouse.create({
                data: {
                    warehouseName: warehouse.warehouseName,
                    warehouseCode: warehouse.warehouseCode,
                    address: warehouse.address,
                    countryCode: warehouse.countryCode,
                    city: warehouse.city,
                    district: warehouse.district,
                    phone: warehouse.phone,
                    email: warehouse.email,
                    createdByUser: {
                        connect: {
                            username: username
                        }
                    },
                    updatedByUser: {
                        connect: {
                            username: username
                        }

                    },
                    company: warehouse.companyCode ? {
                        connect: { companyCode: warehouse.companyCode },
                    } : {},
                } as Prisma.WarehouseCreateInput,
            });
            return createdWarehouse;
        } catch (error) {
            logger.error("Error creating warehouse", error);
            throw error;
        }
    }

    async updateWarehouse(id: string, warehouse: Partial<Warehouse>, bearerToken: string): Promise<Warehouse> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.warehouse.update({
                where: { id },
                data: {
                    warehouseName: warehouse.warehouseName,
                    warehouseCode: warehouse.warehouseCode,
                    address: warehouse.address,
                    countryCode: warehouse.countryCode,
                    city: warehouse.city,
                    district: warehouse.district,
                    phone: warehouse.phone,
                    email: warehouse.email,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },

                    company: warehouse.companyCode ? {
                        connect: { companyCode: warehouse.companyCode },
                    } : {},
                } as Prisma.WarehouseUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating warehouse with id ${id}`, error);
            throw error;
        }
    }

    async deleteWarehouse(id: string): Promise<boolean> {
        try {
            return await this.warehouseRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting warehouse with id ${id}`, error);
            throw error;
        }
    }

    async getWarehouseById(id: string): Promise<Warehouse | null> {
        try {
            return await this.warehouseRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching warehouse with id ${id}`, error);
            throw error;
        }
    }

    async getWarehousesWithStockCount(): Promise<Warehouse[]> {
        try {
            return await this.warehouseRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all warehouses", error);
            throw error;
        }
    }

    async getAllWarehouses() {
        try {
            const warehouses = await prisma.warehouse.findMany({
                include: {
                    stockCardWarehouse: true,
                },
            });

            // StockCardWarehouse tablosundaki stockCardId'ye göre kaç farklı ürün olduğunu hesaplayıp değişkene atıyoruz.
            const stockCount = warehouses.map((warehouse) => {
                const totalStock = warehouse.stockCardWarehouse.reduce((acc, stockCardWarehouse) => {
                    return acc + stockCardWarehouse.quantity.toNumber();
                }, 0);

                return {
                    id: warehouse.id,
                    warehouseName: warehouse.warehouseName,
                    warehouseCode: warehouse.warehouseCode,
                    address: warehouse.address,
                    countryCode: warehouse.countryCode,
                    city: warehouse.city,
                    district: warehouse.district,
                    phone: warehouse.phone,
                    email: warehouse.email,
                    companyCode: warehouse.companyCode,
                    createdAt: warehouse.createdAt,
                    updatedAt: warehouse.updatedAt,
                    createdBy: warehouse.createdBy,
                    updatedBy: warehouse.updatedBy,
                    stockCount: warehouse.stockCardWarehouse.length,
                    totalStock: totalStock
                };
            });

            return stockCount;

        } catch (error) {
            logger.error("Error fetching warehouses with stock count", error);
            throw error;
        }
    }

    async getWarehousesWithFilters(filter: any): Promise<Warehouse[] | null> {
        try {
            return await this.warehouseRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching warehouses with filters", error);
            throw error;
        }
    }

    async createStocktakeWarehouse(data: StockTakeWarehouse, bearerToken: string): Promise<any> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const result = await prisma.$transaction(async (prisma) => {
                // Ana sayım kaydını oluştur
                const stockTake = await prisma.stockTake.create({
                    data: {
                        documentNo: await generateStockTakeDocumentNo(prisma),
                        warehouseId: data.warehouseId,
                        branchCode: data.branchCode,
                        stockTakeType: data.stockTakeType as StockTakeType,
                        status: 'Completed' as StockTakeStatus,
                        description: data.description,
                        reference: data.reference,
                        startedAt: new Date(),
                        createdBy: username,
                        details: {
                            create: await Promise.all(data.products.map(async (product) => {
                                // Mevcut stok miktarını al
                                const currentStock = await prisma.stockCardWarehouse.findFirst({
                                    where: {
                                        stockCardId: product.stockCardId,
                                        warehouseId: data.warehouseId
                                    }
                                });

                                const currentQuantity = currentStock?.quantity || new Prisma.Decimal(0);
                                const difference = new Prisma.Decimal(product.quantity).minus(currentQuantity);

                                return {
                                    stockCardId: product.stockCardId,
                                    quantity: new Prisma.Decimal(product.quantity),
                                    difference: difference,
                                    note: product.note
                                };
                            }))
                        }
                    },
                    include: {
                        details: {
                            include: {
                                stockCard: true
                            }
                        },
                        warehouse: true,
                        branch: true,
                        createdByUser: true
                    }
                });

                // Stok hareketlerini oluştur
                for (const detail of stockTake.details) {
                    if (!detail.difference.equals(new Prisma.Decimal(0))) {
                        const _productCode = await prisma.stockCard.findUnique({
                            where: { id: detail.stockCardId },
                            select: { productCode: true },
                        });

                        const _warehouseCode = await prisma.warehouse.findUnique({
                            where: { id: data.warehouseId },
                            select: { warehouseCode: true },
                        });

                        await prisma.stockMovement.create({
                            data: {
                                documentType: "Other",
                                invoiceType: "Other",
                                movementType: "Sayim",
                                gcCode: detail.difference.isPositive() ? "Giris" : "Cikis",
                                type: "Stok Sayım",
                                description: "Stok Sayım Farkı",
                                quantity: detail.difference.abs(),
                                stockCard: {
                                    connect: { productCode: _productCode?.productCode },
                                },
                                warehouse: {
                                    connect: { warehouseCode: _warehouseCode?.warehouseCode },
                                },
                                branch: {
                                    connect: { branchCode: data.branchCode },
                                },
                            },
                        });

                        // StockCardWarehouse tablosunu güncelle
                        await prisma.stockCardWarehouse.upsert({
                            where: {
                                stockCardId_warehouseId: {
                                    stockCardId: detail.stockCardId,
                                    warehouseId: data.warehouseId
                                }
                            },
                            update: {
                                quantity: detail.quantity
                            },
                            create: {
                                stockCardId: detail.stockCardId,
                                warehouseId: data.warehouseId,
                                quantity: detail.quantity
                            }
                        });
                    }
                }

                return stockTake;
            });

            return result;
        } catch (error) {
            logger.error("Error creating stocktake warehouse", error);
            throw error;
        }
    }

    async updateStocktakeWarehouse(id: string, data: StockTakeWarehouse): Promise<any> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                const stockTake = await prisma.stockTake.update({
                    where: { id },
                    data: {
                        stockTakeType: data.stockTakeType,
                        description: data.description,
                        reference: data.reference,
                        details: {
                            deleteMany: {},
                            create: await Promise.all(data.products.map(async (product) => {
                                const currentStock = await prisma.stockCardWarehouse.findFirst({
                                    where: {
                                        stockCardId: product.stockCardId,
                                        warehouseId: data.warehouseId
                                    }
                                });

                                const currentQuantity = currentStock?.quantity || new Prisma.Decimal(0);
                                const difference = new Prisma.Decimal(product.quantity).minus(currentQuantity);

                                return {
                                    stockCardId: product.stockCardId,
                                    quantity: new Prisma.Decimal(product.quantity),
                                    difference: difference,
                                    note: product.note
                                };
                            }))
                        }
                    },
                    include: {
                        details: {
                            include: {
                                stockCard: true
                            }
                        },
                        warehouse: true,
                        branch: true
                    }
                });

                // Stok hareketlerini güncelle
                for (const detail of stockTake.details) {
                    if (!detail.difference.equals(new Prisma.Decimal(0))) {
                        const _productCode = await prisma.stockCard.findUnique({
                            where: { id: detail.stockCardId },
                            select: { productCode: true },
                        });

                        const _warehouseCode = await prisma.warehouse.findUnique({
                            where: { id: data.warehouseId },
                            select: { warehouseCode: true },
                        });

                        await prisma.stockMovement.create({
                            data: {
                                documentType: "Other",
                                invoiceType: "Other",
                                movementType: "Sayim",
                                gcCode: detail.difference.isPositive() ? "Giris" : "Cikis",
                                type: "Stok Sayım",
                                description: "Stok Sayım Farkı Güncelleme",
                                quantity: detail.difference.abs(),
                                stockCard: {
                                    connect: { productCode: _productCode?.productCode },
                                },
                                warehouse: {
                                    connect: { warehouseCode: _warehouseCode?.warehouseCode },
                                },
                                branch: {
                                    connect: { branchCode: data.branchCode },
                                },
                            },
                        });

                        // StockCardWarehouse tablosunu güncelle
                        await prisma.stockCardWarehouse.upsert({
                            where: {
                                stockCardId_warehouseId: {
                                    stockCardId: detail.stockCardId,
                                    warehouseId: data.warehouseId
                                }
                            },
                            update: {
                                quantity: detail.quantity
                            },
                            create: {
                                stockCardId: detail.stockCardId,
                                warehouseId: data.warehouseId,
                                quantity: detail.quantity
                            }
                        });
                    }
                }

                return stockTake;
            });

            return result;
        } catch (error) {
            logger.error("Error updating stocktake warehouse", error);
            throw error;
        }
    }

    async deleteStocktakeWarehouse(id: string): Promise<any> {
        try {
            return await prisma.stockTake.delete({
                where: { id },
            });
        } catch (error) {
            logger.error("Error deleting stocktaking warehouse", error);
            throw error;
        }
    }

    async getStocktakeWarehouseById(id: string): Promise<any> {
        try {
            return await prisma.stockTake.findUnique({
                where: { id },
                include: {
                    warehouse: true,
                    details: {
                        include: {
                            stockCard: true
                        }
                    }
                },
            });
        } catch (error) {
            logger.error("Error fetching stocktaking warehouse by id", error);
            throw error;
        }
    }

    async getStocktakeWarehouses(): Promise<any> {
        try {
            return await prisma.stockTake.findMany({});
        } catch (error) {
            logger.error("Error fetching stocktaking warehouses", error);
            throw error;
        }
    }

    async createOrderPrepareWarehouse(data: OrderPrepareWarehouse, bearerToken: string): Promise<any> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const result = await prisma.$transaction(async (prisma) => {
                // Branch'e ait company code'u al
                const branch = await prisma.branch.findUnique({
                    where: { branchCode: data.branchCode },
                    select: { companyCode: true }
                });

                if (!branch) {
                    throw new Error("Şube bulunamadı");
                }

                let totalAmount = 0;
                let receiptDetails = [];

                // Cariye ait aktif fiyat listesini al
                const currentPriceList = await prisma.stockCardPriceList.findFirst({
                    where: {
                        isActive: true
                    },
                    include: {
                        stockCardPriceListItems: true
                    }
                });

                if (!currentPriceList) {
                    throw new Error("Cariye tanımlı aktif fiyat listesi bulunamadı");
                }

                for (const product of data.products) {
                    // Stok kartının fiyat listesindeki fiyatını al
                    const stockCardPrice = await prisma.stockCardPriceListItems.findFirst({
                        where: {
                            stockCardId: product.stockCardId,
                            priceListId: currentPriceList.id
                        }
                    });

                    if (!stockCardPrice) {
                        throw new Error(`${product.stockCardId} ID'li stok kartı için fiyat listesinde fiyat bulunamadı`);
                    }

                    const productUnitPrice = stockCardPrice.price.toNumber();
                    const subtotal = productUnitPrice * product.quantity;
                    const vatRate = stockCardPrice.vatRate || 0;
                    const vatAmount = (subtotal * Number(vatRate)) / 100;
                    const total = subtotal + vatAmount;

                    totalAmount += total;

                    receiptDetails.push({
                        stockCardId: product.stockCardId,
                        quantity: product.quantity,
                        unitPrice: productUnitPrice,
                        subtotal: subtotal,
                        vatRate: vatRate,
                        vatAmount: vatAmount,
                        total: total,
                        warehouseId: data.warehouseId,
                        discount: 0,
                        netPrice: productUnitPrice
                    });

                    // Mevcut stok kontrolü ve güncelleme kodları...

                    // Önce mevcut stok kartı-depo ilişkisini bul
                    const existingStockCardWarehouse = await prisma.stockCardWarehouse.findFirst({
                        where: {
                            stockCardId: product.stockCardId,
                            warehouseId: data.warehouseId
                        },
                        include: {
                            stockCard: true
                        }
                    });

                    if (!existingStockCardWarehouse) {
                        throw new Error(`Stok kartı bulunamadı: ${product.stockCardId}`);
                    }

                    // Yeni miktar = Mevcut miktar - Çıkılacak miktar
                    const newQuantity = existingStockCardWarehouse.quantity.toNumber() - product.quantity;

                    if (newQuantity < 0) {
                        throw new Error(`Yetersiz stok. Stok kartı: ${product.stockCardId}, Mevcut: ${existingStockCardWarehouse.quantity}, İstenen: ${product.quantity}`);
                    }

                    const stockCardWarehouse = await prisma.stockCardWarehouse.update({
                        where: {
                            id: existingStockCardWarehouse.id
                        },
                        data: {
                            quantity: newQuantity
                        },
                        include: {
                            stockCard: true,
                            warehouse: true
                        }
                    });

                    // Ürünün fiyatını al ve toplam tutara ekle
                    const stockCardPriceList = await prisma.stockCardPriceListItems.findFirst({
                        where: {
                            stockCardId: product.stockCardId,
                            priceList: {
                                isActive: true
                            }
                        }
                    });

                    const unitPrice = stockCardPriceList ? stockCardPriceList.price.toNumber() : 0;
                    const productTotal = unitPrice * product.quantity;
                    totalAmount += productTotal;

                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: product.stockCardId },
                        select: { productCode: true },
                    });
                    const _warehouseCode = await prisma.warehouse.findUnique({
                        where: { id: data.warehouseId },
                        select: { warehouseCode: true },
                    });
                    const _branch = await prisma.branchWarehouse.findUnique({
                        where: { id: data.warehouseId },
                        select: { branch: { select: { branchCode: true } } },
                    });

                    await prisma.stockMovement.create({
                        data: {
                            documentType: "Other",
                            invoiceType: "Other",
                            movementType: "Devir",
                            gcCode: "Cikis",
                            type: "Siparis Hazirlama",
                            description: "Siparis Hazirlama Cikisi",
                            quantity: product.quantity,
                            stockCard: {
                                connect: { productCode: _productCode?.productCode },
                            },
                            warehouse: {
                                connect: { warehouseCode: _warehouseCode?.warehouseCode },
                            },
                            branch: {
                                connect: { branchCode: data.branchCode },
                            },
                        },
                    });
                }

                // CurrentMovement oluştur
                const _current = await prisma.current.findUnique({
                    where: { id: data.currentId },
                    select: { currentName: true },
                });

                const currentMovement = await prisma.currentMovement.create({
                    data: {
                        current: {
                            connect: { id: data.currentId }
                        },
                        documentType: "Muhtelif",
                        movementType: "Borc",
                        debtAmount: totalAmount,
                        creditAmount: 0,
                        createdByUser: {
                            connect: { username: username }
                        },
                        description: `Sipariş Hazırlama - ${_current?.currentName}`,
                        branch: {
                            connect: { branchCode: data.branchCode }
                        },
                        company: {
                            connect: { companyCode: branch.companyCode }
                        }
                    }
                });

                const orderPrepare = await prisma.orderPrepareWarehouse.create({
                    data: {
                        warehouse: {
                            connect: { id: data.warehouseId },
                        },
                        createdByUser: {
                            connect: { username: username }
                        },
                        current: {
                            connect: { id: data.currentId },
                        },
                        currentMovement: {
                            connect: { id: currentMovement.id },
                        }
                    },
                    include: {
                        warehouse: true,
                        current: true
                    }
                });

                // Receipt oluştur
                const receipt = await prisma.receipt.create({
                    data: {
                        receiptType: ReceiptType.Cikis,
                        documentNo: await generateDocumentNumber(prisma, "SH"),
                        description: "Sipariş Hazırlama",
                        branchCode: data.branchCode,
                        createdBy: username,
                        currentId: data.currentId,
                        currentMovementId: currentMovement.id,
                    }
                });

                // Receipt Details oluştur
                for (const detail of receiptDetails) {
                    await prisma.receiptDetail.create({
                        data: {
                            receiptId: receipt.id,
                            stockCardId: detail.stockCardId,
                            quantity: new Prisma.Decimal(String(detail.quantity)),
                            unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
                            totalPrice: new Prisma.Decimal(String(detail.total)),
                            vatRate: new Prisma.Decimal(String(detail.vatRate)),
                            discount: new Prisma.Decimal(String(detail.discount)),
                            netPrice: new Prisma.Decimal(String(detail.netPrice)),
                            createdBy: username,
                            updatedBy: username
                        }
                    });
                }

                return orderPrepare;
            });
            return result;
        } catch (error) {
            logger.error("Error preparing order warehouse", error);
            throw error;
        }
    }

    async createOrderReturnWarehouse(data: OrderReturnWarehouse, bearerToken: string): Promise<any> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const result = await prisma.$transaction(async (prisma) => {
                // Branch'e ait company code'u al
                const branch = await prisma.branch.findUnique({
                    where: { branchCode: data.branchCode },
                    select: { companyCode: true }
                });

                if (!branch) {
                    throw new Error("Şube bulunamadı");
                }

                let totalAmount = 0;
                let receiptDetails = [];

                // Cariye ait aktif fiyat listesini al
                const currentPriceList = await prisma.stockCardPriceList.findFirst({
                    where: {
                        isActive: true
                    },
                    include: {
                        stockCardPriceListItems: true
                    }
                });

                if (!currentPriceList) {
                    throw new Error("Cariye tanımlı aktif fiyat listesi bulunamadı");
                }

                for (const product of data.products) {
                    // Stok kartının fiyat listesindeki fiyatını al
                    const stockCardPrice = await prisma.stockCardPriceListItems.findFirst({
                        where: {
                            stockCardId: product.stockCardId,
                            priceListId: currentPriceList.id
                        }
                    });

                    if (!stockCardPrice) {
                        throw new Error(`${product.stockCardId} ID'li stok kartı için fiyat listesinde fiyat bulunamadı`);
                    }

                    const productUnitPrice = stockCardPrice.price.toNumber();
                    const subtotal = productUnitPrice * product.quantity;
                    const vatRate = stockCardPrice.vatRate || 0;
                    const vatAmount = (subtotal * Number(vatRate)) / 100;
                    const total = subtotal + vatAmount;

                    totalAmount += total;

                    receiptDetails.push({
                        stockCardId: product.stockCardId,
                        quantity: product.quantity,
                        unitPrice: productUnitPrice,
                        subtotal: subtotal,
                        vatRate: vatRate,
                        vatAmount: vatAmount,
                        total: total,
                        warehouseId: data.warehouseId,
                        discount: 0,
                        netPrice: productUnitPrice
                    });

                    // Mevcut stok kontrolü ve güncelleme
                    const existingStockCardWarehouse = await prisma.stockCardWarehouse.findFirst({
                        where: {
                            stockCardId: product.stockCardId,
                            warehouseId: data.warehouseId
                        },
                        include: {
                            stockCard: true
                        }
                    });

                    if (!existingStockCardWarehouse) {
                        // Eğer stok kartı-depo ilişkisi yoksa yeni oluştur
                        await prisma.stockCardWarehouse.create({
                            data: {
                                stockCardId: product.stockCardId,
                                warehouseId: data.warehouseId,
                                quantity: product.quantity
                            }
                        });
                    } else {
                        // Varolan stok kartı-depo ilişkisini güncelle
                        const newQuantity = existingStockCardWarehouse.quantity.toNumber() + product.quantity;

                        await prisma.stockCardWarehouse.update({
                            where: {
                                id: existingStockCardWarehouse.id
                            },
                            data: {
                                quantity: newQuantity
                            }
                        });
                    }

                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: product.stockCardId },
                        select: { productCode: true },
                    });
                    const _warehouseCode = await prisma.warehouse.findUnique({
                        where: { id: data.warehouseId },
                        select: { warehouseCode: true },
                    });

                    await prisma.stockMovement.create({
                        data: {
                            documentType: "Other",
                            invoiceType: "Other",
                            movementType: "Devir",
                            gcCode: "Giris",
                            type: "Siparis Iade",
                            description: "Siparis Iade Girisi",
                            quantity: product.quantity,
                            stockCard: {
                                connect: { productCode: _productCode?.productCode },
                            },
                            warehouse: {
                                connect: { warehouseCode: _warehouseCode?.warehouseCode },
                            },
                            branch: {
                                connect: { branchCode: data.branchCode },
                            },
                        },
                    });
                }

                // CurrentMovement oluştur
                const _current = await prisma.current.findUnique({
                    where: { id: data.currentId },
                    select: { currentName: true },
                });

                const currentMovement = await prisma.currentMovement.create({
                    data: {
                        current: {
                            connect: { id: data.currentId }
                        },
                        documentType: "Muhtelif",
                        movementType: "Alacak",
                        debtAmount: 0,
                        creditAmount: totalAmount,
                        createdByUser: {
                            connect: { username: username }
                        },
                        description: `Sipariş İade - ${_current?.currentName}`,
                        branch: {
                            connect: { branchCode: data.branchCode }
                        },
                        company: {
                            connect: { companyCode: branch.companyCode }
                        }
                    }
                });

                const orderReturn = await prisma.orderPrepareWarehouse.create({
                    data: {
                        warehouse: {
                            connect: { id: data.warehouseId },
                        },
                        createdByUser: {
                            connect: { username: username }
                        },
                        current: {
                            connect: { id: data.currentId },
                        },
                        currentMovement: {
                            connect: { id: currentMovement.id },
                        },
                        status: "Returned"
                    },
                    include: {
                        warehouse: true,
                        current: true
                    }
                });

                // Receipt oluştur
                const receipt = await prisma.receipt.create({
                    data: {
                        receiptType: ReceiptType.Giris,
                        documentNo: await generateDocumentNumber(prisma, "SI"),
                        description: "Sipariş İade",
                        branchCode: data.branchCode,
                        createdBy: username,
                        currentId: data.currentId,
                        currentMovementId: currentMovement.id,
                    }
                });

                // Receipt Details oluştur
                for (const detail of receiptDetails) {
                    await prisma.receiptDetail.create({
                        data: {
                            receiptId: receipt.id,
                            stockCardId: detail.stockCardId,
                            quantity: new Prisma.Decimal(String(detail.quantity)),
                            unitPrice: new Prisma.Decimal(String(detail.unitPrice)),
                            totalPrice: new Prisma.Decimal(String(detail.total)),
                            vatRate: new Prisma.Decimal(String(detail.vatRate)),
                            discount: new Prisma.Decimal(String(detail.discount)),
                            netPrice: new Prisma.Decimal(String(detail.netPrice)),
                            createdBy: username,
                            updatedBy: username
                        }
                    });
                }



                return orderReturn;
            });
            return result;
        } catch (error) {
            logger.error("Error returning order warehouse", error);
            throw error;
        }
    }

    async getAllReceipts(): Promise<any> {
        try {
            const receipts = await prisma.receipt.findMany({

                orderBy: {
                    createdAt: 'desc'
                }
            });

            return receipts;
        } catch (error) {
            logger.error("Error fetching all receipts", error);
            throw error;
        }
    }

    async getReceiptById(id: string): Promise<any> {
        try {
            const receipt = await prisma.receipt.findUnique({
                where: { id },
                include: {
                    receiptDetail: {
                        include: {
                            stockCard: true
                        }
                    },
                    current: true,
                    currentMovement: true,
                    createdByUser: true
                }
            });

            if (!receipt) {
                throw new Error("Fiş bulunamadı");
            }

            return receipt;
        } catch (error) {
            logger.error(`Error fetching receipt with id ${id}`, error);
            throw error;
        }
    }

}

export default WarehouseService;