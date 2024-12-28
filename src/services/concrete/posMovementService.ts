
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
                    } : undefined,

                    currentMovement: posMovement?.currentMovementId ? {
                        connect: {
                            id: posMovement.currentMovementId
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
            // Eski posMovement bilgilerini alıyoruz
            const oldPosMovement = await this.posMovementRepository.findById(id);
            // Güncellenmemiş enterin ve emerging değerlerini alıyoruz
            const entering: number = Number(oldPosMovement?.entering || 0);
            const emerging: number = Number(oldPosMovement?.emerging || 0);
            // Güncellenen enterin ve emerging değerlerini alıyoruz
            const newEntering: number = Number(posMovement.entering || 0);
            const newEmerging: number = Number(posMovement.emerging || 0);
            // Eski değerlerden yeni değerleri çıkartarak farkı buluyoruz eğer negatif değer ise positive yaparak hesaplamayı yapıyoruz
            const enteringDifference = newEntering - entering;
            const emergingDifference = newEmerging - emerging;
            const enteringValue = enteringDifference < 0 ? enteringDifference * -1 : enteringDifference;
            const emergingValue = emergingDifference < 0 ? emergingDifference * -1 : emergingDifference;
            // Önce yeni gelen veride posId var mı kontrol ediyoruz eğer yoksa eski posId yi alıyoruz eğer varsa yeni posId yi alıyoruz
            const posId = posMovement.posId || oldPosMovement.posId;
            // Pos bakiyesini güncelliyoruz
            PosService.updatePosBalance(posId, new Prisma.Decimal(enteringValue), new Prisma.Decimal(emergingValue));
            // Güncelleme işlemini yapıyoruz
            const updatedPosMovement = await prisma.posMovement.update({
                where: { id },
                data: {
                    posId: posMovement?.posId,
                    invoiceId: posMovement?.invoiceId,
                    receiptId: posMovement?.receiptId,
                    description: posMovement?.description,
                    entering: posMovement?.entering,
                    emerging: posMovement?.emerging,
                    posDirection: posMovement?.posDirection,
                    posType: posMovement?.posType,
                    posDocumentType: posMovement?.posDocumentType,

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

            return updatedPosMovement;
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