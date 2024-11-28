
import prisma from "../../config/prisma";
import { Prisma, BankMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import BankService from "./bankService";
export class BankMovementService {
    private bankMovementRepository: BaseRepository<BankMovement>;

    constructor() {
        this.bankMovementRepository = new BaseRepository<BankMovement>(prisma.bankMovement);
    }

    async createBankMovement(bankMovement: BankMovement): Promise<BankMovement> {
        try {
            const createdBankMovement = await prisma.bankMovement.create({
                data: {
                    description: bankMovement.description,
                    entering: bankMovement.entering,
                    emerging: bankMovement.emerging,
                    bankDirection: bankMovement.bankDirection,
                    bankType: bankMovement.bankType,
                    bankDocumentType: bankMovement.bankDocumentType,

                    bank: bankMovement.bankId ? {
                        connect: {
                            id: bankMovement.bankId
                        }
                    } : undefined,

                    invoice: bankMovement?.invoiceId ? {
                        connect: {
                            id: bankMovement.invoiceId
                        }
                    } : undefined,

                    receipt: bankMovement?.receiptId ? {
                        connect: {
                            id: bankMovement.receiptId
                        }
                    } : undefined

                } as Prisma.BankMovementCreateInput,
            });

            BankService.updateBankBalance(bankMovement.bankId, bankMovement.entering, bankMovement.emerging);

            return createdBankMovement;
        } catch (error) {
            logger.error("Error creating bankMovement", error);
            throw error;
        }
    }

    async updateBankMovement(id: string, bankMovement: Partial<BankMovement>): Promise<BankMovement> {
        try {
            return await prisma.bankMovement.update({
                where: { id },
                data: {
                    bankId: bankMovement.bankId,
                    invoiceId: bankMovement.invoiceId,
                    receiptId: bankMovement.receiptId,
                    description: bankMovement.description,
                    entering: bankMovement.entering,
                    emerging: bankMovement.emerging,
                    bankDirection: bankMovement.bankDirection,
                    bankType: bankMovement.bankDirection,
                    bankDocumentType: bankMovement.bankDirection,

                    Bank: bankMovement.bankId ? {
                        connect: {
                            id: bankMovement.bankId
                        }
                    } : undefined,

                    Invoice: bankMovement.invoiceId ? {
                        connect: {
                            id: bankMovement.invoiceId
                        }
                    } : undefined,

                    Receipt: bankMovement.receiptId ? {
                        connect: {
                            id: bankMovement.receiptId
                        }
                    } : undefined

                } as Prisma.BankMovementUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating bankMovement with id ${id}`, error);
            throw error;
        }
    }

    async deleteBankMovement(id: string): Promise<boolean> {
        try {
            return await this.bankMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting bankMovement with id ${id}`, error);
            throw error;
        }
    }

    async getBankMovementById(id: string): Promise<BankMovement | null> {
        try {
            return await this.bankMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching bankMovement with id ${id}`, error);
            throw error;
        }
    }

    async getBankMovementsByBankId(bankId: string): Promise<BankMovement[]> {
        try {
            return await prisma.bankMovement.findMany({
                where: { bankId: bankId },
                include: {
                    bank: true
                }
            });
        } catch (error) {
            logger.error(`Error fetching bankMovements with bankId ${bankId}`, error);
            throw error;
        }
    }

    async getAllBankMovements(): Promise<BankMovement[]> {
        try {
            return await prisma.bankMovement.findMany({
                include: {
                    bank: true
                }
            });
        } catch (error) {
            logger.error("Error fetching all bankMovements", error);
            throw error;
        }
    }

}

export default BankMovementService;