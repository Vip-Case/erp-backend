
import prisma from "../../config/prisma";
import { CurrentMovement, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";
import VaultMovementService from "./vaultMovementService";
import { PosMovementService } from "./posMovementService";
import BankMovementService from "./bankMovementService";
import { extractUsernameFromToken } from "./extractUsernameService";
export class CurrentMovementService {
    private vaultMovementService: VaultMovementService;
    private bankMovementService: BankMovementService;
    private posMovementService: PosMovementService;
    private currentMovementRepository: BaseRepository<CurrentMovement>;

    constructor() {
        this.currentMovementRepository = new BaseRepository<CurrentMovement>(prisma.currentMovement);
        this.vaultMovementService = new VaultMovementService();
        this.bankMovementService = new BankMovementService();
        this.posMovementService = new PosMovementService();
    }

    async createCurrentMovement(currentMovement: any, bearerToken: string): Promise<any> {
        try {
            const username = extractUsernameFromToken(bearerToken);
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
                    movementType: currentMovement.movementType,
                    documentType: currentMovement.documentType,
                    paymentType: currentMovement.paymentType,
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

    async updateCurrentMovement(id: string, currentMovement: Partial<CurrentMovement>, bearerToken: string): Promise<CurrentMovement> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const debtAmount = currentMovement.debtAmount ?? new Decimal(0);    // Eğer debtAmount yoksa 0 yap
            const creditAmount = currentMovement.creditAmount ?? new Decimal(0); // Eğer creditAmount yoksa 0 yap
            const updatedCurrentMovement = await prisma.currentMovement.update({
                where: { id },
                data: {
                    dueDate: currentMovement.dueDate,
                    description: currentMovement.description,
                    debtAmount: debtAmount,
                    creditAmount: creditAmount,
                    documentType: currentMovement.documentType,
                    paymentType: currentMovement.paymentType,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },

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

            //  İlişkili olan vaultMovement bilgilerini alıyoruz
            const vaultMovement = await prisma.vaultMovement.findFirst({
                where: {
                    currentMovementId: updatedCurrentMovement.id
                }
            });
            const vaultMovementData = {
                vaultId: vaultMovement?.vaultId,
                entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
                emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
                currentMovementId: updatedCurrentMovement.id
            }
            if (vaultMovement) {
                // VaultMovement bilgilerini güncelliyoruz
                await this.vaultMovementService.updateVaultMovement(vaultMovement.id, vaultMovementData, bearerToken);
            }

            // İlişkili olan bankMovement bilgilerini alıyoruz
            const bankMovement = await prisma.bankMovement.findFirst({
                where: {
                    currentMovementId: updatedCurrentMovement.id
                }
            });
            const bankMovementData = {
                bankId: bankMovement?.bankId,
                entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
                emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
                currentMovementId: updatedCurrentMovement.id
            }
            if (bankMovement) {
                // BankMovement bilgilerini güncelliyoruz
                await this.bankMovementService.updateBankMovement(bankMovement.id, bankMovementData, bearerToken);
            }

            // İlişkili olan posMovement bilgilerini alıyoruz
            const posMovement = await prisma.posMovement.findFirst({
                where: {
                    currentMovementId: updatedCurrentMovement.id
                }
            });
            const posMovementData = {
                posId: posMovement?.posId,
                entering: updatedCurrentMovement.debtAmount ?? new Decimal(0),
                emerging: updatedCurrentMovement.creditAmount ?? new Decimal(0),
                currentMovementId: updatedCurrentMovement.id
            }
            if (posMovement) {
                // PosMovement bilgilerini güncelliyoruz
                await this.posMovementService.updatePosMovement(posMovement.id, posMovementData, bearerToken);
            }

            return updatedCurrentMovement;
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