
import prisma from "../../config/prisma";
import { Prisma, VaultMovement } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import VaultService from "./vaultService";
import { extractUsernameFromToken } from "./extractUsernameService";
export class VaultMovementService {
    private vaultMovementRepository: BaseRepository<VaultMovement>;

    constructor() {
        this.vaultMovementRepository = new BaseRepository<VaultMovement>(prisma.vaultMovement);
    }

    async createVaultMovement(vaultMovement: VaultMovement, bearerToken: string): Promise<VaultMovement> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdVaultMovement = await prisma.vaultMovement.create({
                data: {
                    description: vaultMovement.description,
                    entering: vaultMovement.entering,
                    emerging: vaultMovement.emerging,
                    vaultDirection: vaultMovement.vaultDirection,
                    vaultType: vaultMovement.vaultType,
                    vaultDocumentType: vaultMovement.vaultDocumentType,
                    createdByUser: {
                        connect: {
                            username: username
                            }
                    },

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
        try {
            return await prisma.vaultMovement.update({
                where: { id },
                data: {
                    vaultId: vaultMovement.vaultId,
                    invoiceId: vaultMovement.invoiceId,
                    receiptId: vaultMovement.receiptId,
                    description: vaultMovement.description,
                    entering: vaultMovement.entering,
                    emerging: vaultMovement.emerging,
                    vaultDirection: vaultMovement.vaultDirection,
                    vaultType: vaultMovement.vaultType,
                    vaultDocumentType: vaultMovement.vaultDocumentType,

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