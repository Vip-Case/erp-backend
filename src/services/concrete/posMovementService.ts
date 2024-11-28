
import prisma from "../../config/prisma";
import { Prisma, PosMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import PosService from "./posService";
export class PosMovementService {
    private posMovementRepository: BaseRepository<PosMovement>;

    constructor() {
        this.posMovementRepository = new BaseRepository<PosMovement>(prisma.posMovement);
    }

    async createPosMovement(posMovement: PosMovement): Promise<PosMovement> {
        try {
            const createdPosMovement = await prisma.posMovement.create({
                data: {
                    description: posMovement.description,
                    entering: posMovement.entering,
                    emerging: posMovement.emerging,
                    posDirection: posMovement.posDirection,
                    posType: posMovement.posType,
                    posDocumentType: posMovement.posDocumentType,

                    pos: posMovement.posId ? {
                        connect: {
                            id: posMovement.posId
                        }
                    } : undefined,

                    invoice: posMovement?.invoiceId ? {
                        connect: {
                            id: posMovement.invoiceId
                        }
                    } : undefined,

                    receipt: posMovement?.receiptId ? {
                        connect: {
                            id: posMovement.receiptId
                        }
                    } : undefined

                } as Prisma.PosMovementCreateInput,
            });

            PosService.updatePosBalance(posMovement.posId, posMovement.entering, posMovement.emerging);

            return createdPosMovement;
        } catch (error) {
            logger.error("Error creating posMovement", error);
            throw error;
        }
    }

    async updatePosMovement(id: string, posMovement: Partial<PosMovement>): Promise<PosMovement> {
        try {
            return await prisma.posMovement.update({
                where: { id },
                data: {
                    posId: posMovement.posId,
                    invoiceId: posMovement.invoiceId,
                    receiptId: posMovement.receiptId,
                    description: posMovement.description,
                    entering: posMovement.entering,
                    emerging: posMovement.emerging,
                    posDirection: posMovement.posDirection,
                    posType: posMovement.posDirection,
                    posDocumentType: posMovement.posDirection,

                    Pos: posMovement.posId ? {
                        connect: {
                            id: posMovement.posId
                        }
                    } : undefined,

                    Invoice: posMovement.invoiceId ? {
                        connect: {
                            id: posMovement.invoiceId
                        }
                    } : undefined,

                    Receipt: posMovement.receiptId ? {
                        connect: {
                            id: posMovement.receiptId
                        }
                    } : undefined

                } as Prisma.PosMovementUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating posMovement with id ${id}`, error);
            throw error;
        }
    }

    async deletePosMovement(id: string): Promise<boolean> {
        try {
            return await this.posMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting posMovement with id ${id}`, error);
            throw error;
        }
    }

    async getPosMovementById(id: string): Promise<PosMovement | null> {
        try {
            return await this.posMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching posMovement with id ${id}`, error);
            throw error;
        }
    }

    async getPosMovementsByPosId(posId: string): Promise<PosMovement[]> {
        try {
            return await prisma.posMovement.findMany({
                where: { posId: posId },
                include: {
                    pos: true
                }
            });
        } catch (error) {
            logger.error(`Error fetching posMovements with posId ${posId}`, error);
            throw error;
        }
    }

    async getAllPosMovements(): Promise<PosMovement[]> {
        try {
            return await prisma.posMovement.findMany({
                include: {
                    pos: true
                }
            });
        } catch (error) {
            logger.error("Error fetching all posMovements", error);
            throw error;
        }
    }

}

export default PosMovementService;