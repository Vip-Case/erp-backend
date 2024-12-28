
import prisma from "../../config/prisma";
import { CurrentMovement, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";
export class CurrentMovementService {
    private currentMovementRepository: BaseRepository<CurrentMovement>;

    constructor() {
        this.currentMovementRepository = new BaseRepository<CurrentMovement>(prisma.currentMovement);
    }

    async createCurrentMovement(currentMovement: any): Promise<any> {
        try {
            const companyCode = await prisma.company.findFirst();
            console.log("companyCode", companyCode);
            const getLastBalanceAmountByCurrentId = await prisma.currentMovement.findFirst({
                where: {
                    currentCode: currentMovement.currentCode
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            const createdCurrentMovement = await prisma.currentMovement.create({
                data: {
                    dueDate: currentMovement.dueDate,
                    description: currentMovement.description,
                    debtAmount: currentMovement.debtAmount,
                    creditAmount: currentMovement.creditAmount,
                    balanceAmount: (currentMovement.debtAmount - currentMovement.creditAmount),
                    movementType: currentMovement.movementType,
                    documentType: currentMovement.documentType,
                    paymentType: currentMovement.paymentType,

                    current: currentMovement.currentCode ? {
                        connect: {
                            currentCode: currentMovement.currentCode
                        }
                    } : undefined,
                    company: currentMovement.companyCode ? {
                        connect: {
                            companyCode: currentMovement.companyCode
                        }
                    } : {
                        connect: {
                            companyCode: companyCode?.companyCode
                        }
                    },
                    branch: currentMovement.branchCode ? {
                        connect: {
                            branchCode: currentMovement.branchCode
                        }
                    } : {},
                    StockCardPriceList: currentMovement?.priceListId ? {
                        connect: {
                            id: currentMovement.priceListId
                        }
                    } : undefined,
                    invoice: currentMovement?.documentNo ? {
                        connect: {
                            id: currentMovement.documentNo
                        }
                    } : undefined,
                } as Prisma.CurrentMovementCreateInput,
            });
            return createdCurrentMovement;
        } catch (error) {
            logger.error("Error creating current movement", error);
            throw error;
        }
    }

    async updateCurrentMovement(id: string, currentMovement: Partial<CurrentMovement>): Promise<CurrentMovement> {
        try {
            const debtAmount = currentMovement.debtAmount ?? new Decimal(0);    // Eğer debtAmount yoksa 0 yap
            const creditAmount = currentMovement.creditAmount ?? new Decimal(0); // Eğer creditAmount yoksa 0 yap
            return await prisma.currentMovement.update({
                where: { id },
                data: {
                    dueDate: currentMovement.dueDate,
                    description: currentMovement.description,
                    debtAmount: debtAmount,
                    creditAmount: creditAmount,
                    documentType: currentMovement.documentType,
                    paymentType: currentMovement.paymentType,

                    current: currentMovement.currentCode ? {
                        connect: {
                            currentCode: currentMovement.currentCode
                        }
                    } : undefined,
                    company: currentMovement.companyCode ? {
                        connect: {
                            companyCode: currentMovement.companyCode
                        }
                    } : {},
                    branch: currentMovement.branchCode ? {
                        connect: {
                            branchCode: currentMovement.branchCode
                        }
                    } : {},
                    StockCardPriceList: currentMovement.priceListId ? {
                        connect: {
                            id: currentMovement.priceListId
                        }
                    } : undefined,
                    invoice: currentMovement.documentNo ? {
                        connect: {
                            id: currentMovement.documentNo
                        }
                    } : undefined,
                } as Prisma.CurrentMovementUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating current movement with id ${id}`, error);
            throw error;
        }
    }

    async deleteCurrentMovement(id: string): Promise<boolean> {
        try {
            return await this.currentMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting current movement with id ${id}`, error);
            throw error;
        }
    }

    async getCurrentMovementById(id: string): Promise<CurrentMovement | null> {
        try {
            return await this.currentMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching current movement with id ${id}`, error);
            throw error;
        }
    }

    async getAllCurrentMovements(): Promise<CurrentMovement[]> {
        try {
            return await this.currentMovementRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all current movements", error);
            throw error;
        }
    }

    async getAllCurrentMovementsWithCurrents(): Promise<CurrentMovement[]> {
        try {
            return await prisma.currentMovement.findMany({
                include: {
                    current: true,
                }
            });
        } catch (error) {
            logger.error("Error fetching all current movements with currents", error);
            throw error;
        }
    }

    async getAllCurrentMovementsWithCurrentsByCurrentId(currentId: string): Promise<CurrentMovement[]> {
        try {
            return await prisma.currentMovement.findMany({
                where: {
                    current: {
                        id: currentId
                    }
                }
            });
        } catch (error) {
            logger.error("Error fetching all current movements with currents by current id", error);
            throw error;
        }
    }

    async getCurrentMovementsWithFilters(filter: any): Promise<CurrentMovement[] | null> {
        try {
            return await this.currentMovementRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching current movements with filters", error);
            throw error;
        }
    }
}

export default CurrentMovementService;