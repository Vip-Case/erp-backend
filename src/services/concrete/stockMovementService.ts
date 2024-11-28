
import prisma from "../../config/prisma";
import { Prisma, StockMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class StockMovementService {
    private stockMovementRepository: BaseRepository<StockMovement>;

    constructor() {
        this.stockMovementRepository = new BaseRepository<StockMovement>(prisma.stockMovement);
    }

    async createStockMovement(stockMovementData: any): Promise<StockMovement> {
        try {
            const stockMovement = await prisma.stockMovement.create({
                data: {
                    movementType: stockMovementData.movementType,
                    documentType: stockMovementData.documentType,
                    invoiceType: stockMovementData.invoiceType,
                    gcCode: stockMovementData.gcCode,
                    type: stockMovementData.type,
                    description: stockMovementData.description,
                    quantity: stockMovementData.quantity,
                    unitPrice: stockMovementData.unitPrice,
                    totalPrice: stockMovementData.totalPrice,
                    unitOfMeasure: stockMovementData.unitOfMeasure,
                    warehouse: stockMovementData.warehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.warehouseCode
                        }
                    } : {},
                    outWarehouse: stockMovementData.outWarehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.outWarehouseCode
                        }
                    } : undefined,
                    branch: stockMovementData.branchCode ? {
                        connect: {
                            branchCode: stockMovementData.branchCode
                        }
                    } : {},
                    stockCard: stockMovementData.productCode ? {
                        connect: {
                            productCode: stockMovementData.productCode
                        }
                    } : undefined,
                    priceList: stockMovementData.priceListId ? {
                        connect: {
                            id: stockMovementData.priceListId
                        }
                    } : undefined,
                    current: stockMovementData.currentCode ? {
                        connect: {
                            id: stockMovementData.currentCode
                        }
                    } : undefined,
                    invoice: stockMovementData.invoiceId ? {
                        connect: {
                            id: stockMovementData.documentNo
                        }
                    } : undefined
                } as Prisma.StockMovementCreateInput,
            });
            return stockMovement;
        } catch (error) {
            logger.error("Error creating stock movement", error);
            throw error;
        }
    }


    async updateStockMovement(id: string, stockMovementData: Partial<StockMovement>): Promise<StockMovement> {
        try {
            return await prisma.stockMovement.update({
                where: { id },
                data: {
                    movementType: stockMovementData.movementType,
                    documentType: stockMovementData.documentType,
                    invoiceType: stockMovementData.invoiceType,
                    gcCode: stockMovementData.gcCode,
                    type: stockMovementData.type,
                    description: stockMovementData.description,
                    quantity: stockMovementData.quantity,
                    unitPrice: stockMovementData.unitPrice,
                    totalPrice: stockMovementData.totalPrice,
                    unitOfMeasure: stockMovementData.unitOfMeasure,
                    warehouse: stockMovementData.warehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.warehouseCode
                        }
                    } : {},
                    outWarehouse: stockMovementData.outWarehouseCode ? {
                        connect: {
                            warehouseCode: stockMovementData.outWarehouseCode
                        }
                    } : undefined,
                    branch: stockMovementData.branchCode ? {
                        connect: {
                            branchCode: stockMovementData.branchCode
                        }
                    } : {},
                    stockCard: stockMovementData.productCode ? {
                        connect: {
                            productCode: stockMovementData.productCode
                        }
                    } : undefined,
                    priceList: stockMovementData.priceListId ? {
                        connect: {
                            id: stockMovementData.priceListId
                        }
                    } : undefined,
                    current: stockMovementData.currentCode ? {
                        connect: {
                            id: stockMovementData.currentCode
                        }
                    } : undefined,
                    invoice: stockMovementData.documentNo ? {
                        connect: {
                            id: stockMovementData.documentNo
                        }
                    } : undefined
                } as Prisma.StockMovementUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating stock movement with id ${id}`, error);
            throw error;
        }
    }

    async deleteStockMovement(id: string): Promise<boolean> {
        try {
            return await this.stockMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting stock movement with id ${id}`, error);
            throw error;
        }
    }

    async getStockMovementById(id: string): Promise<StockMovement | null> {
        try {
            return await this.stockMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching stock movement with id ${id}`, error);
            throw error;
        }
    }

    async getAllStockMovements(): Promise<StockMovement[]> {
        try {
            return await this.stockMovementRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all stock movements", error);
            throw error;
        }
    }

    async getAllOrderStockMovements(): Promise<StockMovement[]> {
        try {
            return await prisma.stockMovement.findMany({
                where: {
                    documentType: "Order"
                }
            });
        } catch (error) {
            logger.error("Error fetching all order stock movements", error);
            throw error;
        }
    }

    async getAllSalesStockMovements(): Promise<StockMovement[]> {
        try {
            return await prisma.stockMovement.findMany({
                where: {
                    invoiceType: "Sales"
                }
            });
        } catch (error) {
            logger.error("Error fetching all sales stock movements", error);
            throw error;
        }
    }

    async getAllPurchaseStockMovements(): Promise<StockMovement[]> {
        try {
            return await prisma.stockMovement.findMany({
                where: {
                    invoiceType: "Purchase"
                }
            });
        } catch (error) {
            logger.error("Error fetching all purchase stock movements", error);
            throw error;
        }
    }
}

export default StockMovementService;