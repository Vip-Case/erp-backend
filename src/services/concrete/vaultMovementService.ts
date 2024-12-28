
import prisma from "../../config/prisma";
import { Prisma, VaultMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import VaultService from "./vaultService";
export class VaultMovementService {
    private vaultMovementRepository: BaseRepository<VaultMovement>;

    constructor() {
        this.vaultMovementRepository = new BaseRepository<VaultMovement>(prisma.vaultMovement);
    }

    async createVaultMovement(vaultMovement: VaultMovement): Promise<VaultMovement> {
        try {
            const createdVaultMovement = await prisma.vaultMovement.create({
                data: {
                    description: vaultMovement.description,
                    entering: vaultMovement.entering,
                    emerging: vaultMovement.emerging,
                    vaultDirection: vaultMovement.vaultDirection,
                    vaultType: vaultMovement.vaultType,
                    vaultDocumentType: vaultMovement.vaultDocumentType,

                    vault: vaultMovement.vaultId ? {
                        connect: {
                            id: vaultMovement.vaultId
                        }
                    } : undefined,

                    invoice: vaultMovement?.invoiceId ? {
                        connect: {
                            id: vaultMovement.invoiceId
                        }
                    } : undefined,

                    receipt: vaultMovement?.receiptId ? {
                        connect: {
                            id: vaultMovement.receiptId
                        }
                    } : undefined,

                    currentMovement: vaultMovement.currentMovementId ? {
                        connect: {
                            id: vaultMovement.currentMovementId
                        }
                    } : undefined

                } as Prisma.VaultMovementCreateInput,
            });

            // Vault bakiyesini güncelleme
            await VaultService.updateVaultBalance(
                vaultMovement.vaultId,
                vaultMovement.entering,
                vaultMovement.emerging
            );

            return createdVaultMovement;
        } catch (error) {
            logger.error("Error creating vaultMovement", error);
            throw error;
        }
    }

    async updateVaultMovement(id: string, vaultMovement: Partial<VaultMovement>): Promise<VaultMovement> {
        // Eski vaultMovement bilgilerini alıyoruz
        const oldVaultMovement = await this.vaultMovementRepository.findById(id);
        // Güncellenmemiş enterin ve emerging değerlerini alıyoruz
        const entering: number = Number(oldVaultMovement?.entering || 0);
        const emerging: number = Number(oldVaultMovement?.emerging || 0);
        // Güncellenen enterin ve emerging değerlerini alıyoruz
        const newEntering: number = Number(vaultMovement.entering || 0);
        const newEmerging: number = Number(vaultMovement.emerging || 0);
        // Eski değerlerden yeni değerleri çıkartarak farkı buluyoruz eğer negatif değer ise positive yaparak hesaplamayı yapıyoruz
        const enteringDifference = newEntering - entering;
        const emergingDifference = newEmerging - emerging;
        const enteringValue = enteringDifference < 0 ? enteringDifference * -1 : enteringDifference;
        const emergingValue = emergingDifference < 0 ? emergingDifference * -1 : emergingDifference;
        // Önce yeni gelen veride vaultId var mı kontrol ediyoruz eğer yoksa eski vaultId yi alıyoruz eğer varsa yeni vaultId yi alıyoruz
        const vaultId = vaultMovement.vaultId || oldVaultMovement.vaultId;
        // Vault bakiyesini güncelliyoruz
        VaultService.updateVaultBalance(vaultId, new Prisma.Decimal(enteringValue), new Prisma.Decimal(emergingValue));
        // Güncelleme işlemini yapıyoruz
        try {
            return await prisma.vaultMovement.update({
                where: { id },
                data: {
                    invoiceId: vaultMovement?.invoiceId,
                    receiptId: vaultMovement?.receiptId,
                    description: vaultMovement?.description,
                    entering: vaultMovement?.entering,
                    emerging: vaultMovement?.emerging,
                    vaultDirection: vaultMovement?.vaultDirection,
                    vaultType: vaultMovement?.vaultType,
                    vaultDocumentType: vaultMovement?.vaultDocumentType,

                    Vault: vaultMovement.vaultId ? {
                        connect: {
                            id: vaultMovement.vaultId
                        }
                    } : undefined,

                    Invoice: vaultMovement.invoiceId ? {
                        connect: {
                            id: vaultMovement.invoiceId
                        }
                    } : undefined,

                    Receipt: vaultMovement.receiptId ? {
                        connect: {
                            id: vaultMovement.receiptId
                        }
                    } : undefined,

                    currentMovement: vaultMovement.currentMovementId ? {
                        connect: {
                            id: vaultMovement.currentMovementId
                        }
                    } : undefined

                } as Prisma.VaultMovementUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating vaultMovement with id ${id}`, error);
            throw error;
        }
    }

    async deleteVaultMovement(id: string): Promise<boolean> {
        try {
            return await this.vaultMovementRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting vaultMovement with id ${id}`, error);
            throw error;
        }
    }

    async getVaultMovementById(id: string): Promise<VaultMovement | null> {
        try {
            return await this.vaultMovementRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching vaultMovement with id ${id}`, error);
            throw error;
        }
    }

    async getVaultMovementsByVaultId(vaultId: string): Promise<VaultMovement[]> {
        try {
            return await prisma.vaultMovement.findMany({
                where: { vaultId: vaultId },
                include: {
                    vault: true
                }
            });
        } catch (error) {
            logger.error(`Error fetching vaultMovements with vaultId ${vaultId}`, error);
            throw error;
        }
    }

    async getAllVaultMovements(): Promise<VaultMovement[]> {
        try {
            return await prisma.vaultMovement.findMany({
                include: {
                    vault: true
                }
            });
        } catch (error) {
            logger.error("Error fetching all vaultMovements", error);
            throw error;
        }
    }

}

export default VaultMovementService;