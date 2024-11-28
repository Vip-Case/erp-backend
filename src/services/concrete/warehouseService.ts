
import prisma from "../../config/prisma";
import { Prisma, Warehouse } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class WarehouseService {
    private warehouseRepository: BaseRepository<Warehouse>;

    constructor() {
        this.warehouseRepository = new BaseRepository<Warehouse>(prisma.warehouse);
    }

    async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
        try {
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
}

export default WarehouseService;