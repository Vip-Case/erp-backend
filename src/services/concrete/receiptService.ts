
import prisma from "../../config/prisma";
import { Prisma, Receipt, ReceiptDetail } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

export const ReceiptRelations = {
    ReceiptDetail: true
};

export class ReceiptService {
    private receiptRepository: BaseRepository<Receipt>;
    private receiptDetailRepository = new BaseRepository<ReceiptDetail>(prisma.receiptDetail);

    constructor() {
        this.receiptRepository = new BaseRepository<Receipt>(prisma.receipt);
    }

    async createReceipt(receipt: Receipt, bearerToken: string): Promise<Receipt> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdReceipt = await prisma.receipt.create({
                data: {
                    receiptType: receipt.receiptType,
                    receiptDate: receipt.receiptDate,
                    documentNo: receipt.documentNo,
                    description: receipt.description,
                    createdByUser: {
                        connect: {
                            username: username
                            }
                    },
                    branch: receipt.branchCode ? {
                        connect: { branchCode: receipt.branchCode },
                    } : {},

                    inReceiptWarehouse: receipt.inWarehouse ? {
                        connect: { warehouseCode: receipt.inWarehouse },
                    } : {},

                    outReceiptWarehouse: receipt.outWarehouse ? {
                        connect: { warehouseCode: receipt.outWarehouse },
                    } : {}

                } as Prisma.ReceiptCreateInput,
            });
            return createdReceipt;
        } catch (error) {
            logger.error("Error creating receipt", error);
            throw error;
        }
    }

    async updateReceipt(id: string, receipt: Partial<Receipt>): Promise<Receipt> {
        try {
            return await prisma.receipt.update({
                where: { id },
                data: {
                    receiptType: receipt.receiptType,
                    receiptDate: receipt.receiptDate,
                    documentNo: receipt.documentNo,
                    description: receipt.description,

                    branch: receipt.branchCode ? {
                        connect: { branchCode: receipt.branchCode },
                    } : {},

                    warehouse: receipt.warehouseCode ? {
                        connect: { warehouseCode: receipt.warehouseCode },
                    } : {}

                } as Prisma.ReceiptUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating receipt with id ${id}`, error);
            throw error;
        }
    }

    async deleteReceipt(id: string): Promise<boolean> {
        try {
            return await this.receiptRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting receipt with id ${id}`, error);
            throw error;
        }
    }

    async getReceiptById(id: string): Promise<Receipt | null> {
        try {
            return await this.receiptRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching receipt with id ${id}`, error);
            throw error;
        }
    }

    async getAllReceipts(): Promise<Receipt[]> {
        try {
            return await this.receiptRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all receipts", error);
            throw error;
        }
    }

    async createReceiptWithRelations(receipt: Receipt, receiptDetails: ReceiptDetail[]): Promise<Receipt> {
        try {
            const newReceipt = await this.receiptRepository.create(receipt);
            for (const receiptDetail of receiptDetails) {
                receiptDetail.receiptId = newReceipt.id;
                await this.receiptDetailRepository.create(receiptDetail);
            }
            return newReceipt;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async updateReceiptWithRelations(id: string, receipt: Partial<Receipt>, receiptDetails: ReceiptDetail[]): Promise<Receipt> {
        try {
            await this.receiptDetailRepository.deleteWithFilters({ receiptId: id });
            for (const receiptDetail of receiptDetails) {
                receiptDetail.receiptId = id;
                await this.receiptDetailRepository.create(receiptDetail);
            }
            return this.receiptRepository.update(id, receipt);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async deleteReceiptWithRelations(id: string): Promise<boolean> {
        try {
            await this.receiptDetailRepository.deleteWithFilters({ receiptId: id });
            return this.receiptRepository.delete(id);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getAllReceiptsWithRelations(): Promise<Receipt[]> {
        return this.receiptRepository.findAll(
            {
                include: {
                    receiptDetail: true
                }
            }
        );
    }

    async getReceiptWithRelationsById(id: string): Promise<Receipt | null> {
        return this.receiptRepository.findByIdWithOptions(id, {
            include: {
                ReceiptDetail: true
            }
        });
    }
}

export default ReceiptService;