
import prisma from "../../config/prisma";
import { Prisma, Bank } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";

export class BankService {
    private bankRepository: BaseRepository<Bank>;

    constructor() {
        this.bankRepository = new BaseRepository<Bank>(prisma.bank);
    }

    async createBank(bank: Bank): Promise<Bank> {
        try {
            const createdBank = await prisma.bank.create({
                data: {
                    bankName: bank.bankName,
                    branchCode: bank.branchCode,
                    balance: bank.balance,
                    currency: bank.currency,

                    branch: bank.branchCode ? {
                        connect: { branchCode: bank.branchCode },
                    } : {},

                } as Prisma.BankCreateInput,
            });
            return createdBank;
        } catch (error) {
            logger.error("Error creating bank", error);
            throw error;
        }
    }

    async updateBank(id: string, bank: Partial<Bank>): Promise<Bank> {
        try {
            return await prisma.bank.update({
                where: { id },
                data: {
                    bankName: bank.bankName,
                    branchCode: bank.branchCode,
                    balance: bank.balance,
                    currency: bank.currency,

                    branch: bank.branchCode ? {
                        connect: { branchCode: bank.branchCode },
                    } : {},

                } as Prisma.BankUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating bank with id ${id}`, error);
            throw error;
        }
    }

    static async updateBankBalance(id: string, entering: Decimal, emerging: Decimal): Promise<Bank> {
        try {
            const bankService = new BankService();
            const bank = await bankService.getBankById(id);
            if (!bank) {
                throw new Error(`Bank with id ${id} not found`);
            }

            const updatedBalance = bank.balance.add(entering).sub(emerging);
            return await prisma.bank.update({
                where: { id },
                data: {
                    balance: updatedBalance,
                } as Prisma.BankUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating bank balance with id ${id}`, error);
            throw error;
        }
    }

    async deleteBank(id: string): Promise<boolean> {
        try {
            return await this.bankRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting bank with id ${id}`, error);
            throw error;
        }
    }

    async getBankById(id: string): Promise<Bank | null> {
        try {
            return await this.bankRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching bank with id ${id}`, error);
            throw error;
        }
    }

    async getAllBanks(): Promise<Bank[]> {
        try {
            return await this.bankRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all banks", error);
            throw error;
        }
    }

}

export default BankService;