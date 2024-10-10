
import prisma from "../../config/prisma";
import { CurrentMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class CurrentMovementService {
    private currentMovementRepository: BaseRepository<CurrentMovement>;

    constructor() {
        this.currentMovementRepository = new BaseRepository<CurrentMovement>(prisma.currentMovement);
    }

    async createCurrentMovement(currentMovement: any): Promise<CurrentMovement> {
        try {
            const createdCurrentMovement = await prisma.currentMovement.create({
                data: {
                    dueDate: currentMovement.dueDate,
                    description: currentMovement.description,
                    debtAmount: currentMovement.debtAmount,
                    creditAmount: currentMovement.creditAmount,
                    balanceAmount: currentMovement.balanceAmount,
                    movementType: currentMovement.movementType,
                    documentType: currentMovement.documentType,
                    current: currentMovement.currentCode ? {
                        connect: {
                            id: currentMovement.currentCode
                        }
                    } : undefined,
                    company: currentMovement.companyCode ? {
                        connect: {
                            id: currentMovement.companyCode
                        }
                    } : {},
                    branch: currentMovement.branchCode ? {
                        connect: {
                            id: currentMovement.branchCode
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
                }
            });
            return createdCurrentMovement;
        } catch (error) {
            logger.error("Error creating current movement", error);
            throw error;
        }
    }

    async updateCurrentMovement(id: string, currentMovement: Partial<CurrentMovement>): Promise<CurrentMovement> {
        try {
            return await this.currentMovementRepository.update(id, currentMovement);
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