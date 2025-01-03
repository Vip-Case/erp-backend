
import prisma from "../../config/prisma";
import { Prisma, Warehouse } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";


export interface StocktakeWarehouse {
    id: string;
    warehouseId: string;
    branchCode: string;
    products: Array<{
        stockCardId: string;
        quantity: number;
    }>
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

    async updateWarehouse(id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> {
        try {
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

    async createStocktakeWarehouse(data: StocktakeWarehouse): Promise<any> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                await prisma.stockTake.create({
                    data: {
                        stockCardIds: data.products.map((product) => product.stockCardId),
                        warehouse: {
                            connect: { id: data.warehouseId },
                        },
                    },
                });

                await prisma.warehouse.update({
                    where: { id: data.warehouseId },
                    data: {
                        stockCardWarehouse: {
                            deleteMany: {},
                        },
                    },
                });

                for (const product of data.products) {
                    await prisma.stockCardWarehouse.create({
                        data: {
                            quantity: product.quantity,
                            stockCard: {
                                connect: { id: product.stockCardId },
                            },
                            warehouse: {
                                connect: { id: data.warehouseId },
                            },
                        },
                    });

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
                            gcCode: "Giris",
                            type: "Stok Sayım",
                            description: "Stok Sayımı",
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
            });
            return result;
        } catch (error) {
            logger.error("Error stocktaking warehouse", error);
            throw error;
        }
    }

    async updateStocktakeWarehouse(id: string, data: StocktakeWarehouse): Promise<any> {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                await prisma.stockTake.update({
                    where: { id },
                    data: {
                        stockCardIds: data.products.map((product) => product.stockCardId),
                        warehouse: {
                            connect: { id: data.warehouseId },
                        },
                    },
                });

                await prisma.warehouse.update({
                    where: { id: data.warehouseId },
                    data: {
                        stockCardWarehouse: {
                            deleteMany: {},
                        },
                    },
                });

                for (const product of data.products) {
                    await prisma.stockCardWarehouse.create({
                        data: {
                            quantity: product.quantity,
                            stockCard: {
                                connect: { id: product.stockCardId },
                            },
                            warehouse: {
                                connect: { id: data.warehouseId },
                            },
                        },
                    });

                    const _productCode = await prisma.stockCard.findUnique({
                        where: { id: product.stockCardId },
                        select: { productCode: true },
                    });

                    await prisma.stockMovement.update({
                        where: { id: product.stockCardId }, // Add the appropriate unique identifier here
                        data: {
                            quantity: product.quantity,
                            stockCard: {
                                connect: { productCode: _productCode?.productCode },
                            },
                        },
                    });
                }
            });
            return result;
        } catch (error) {
            logger.error("Error updating stocktaking warehouse", error);
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
                },
            });
        } catch (error) {
            logger.error("Error fetching stocktaking warehouse by id", error);
            throw error;
        }
    }

    async getStocktakeWarehouses(): Promise<any> {
        try {
            return await prisma.stockTake.findMany({
                include: {
                    warehouse: true,
                },
            });
        } catch (error) {
            logger.error("Error fetching stocktaking warehouses", error);
            throw error;
        }
    }


}

export default WarehouseService;