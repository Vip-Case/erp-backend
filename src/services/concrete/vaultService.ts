
import prisma from "../../config/prisma";
import { Prisma, Vault } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";
import { extractUsernameFromToken } from "./extractUsernameService";

export class VaultService {
    private vaultRepository: BaseRepository<Vault>;

    constructor() {
        this.vaultRepository = new BaseRepository<Vault>(prisma.vault);
    }

    async createVault(vault: Vault, bearerToken: string): Promise<Vault> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdVault = await prisma.vault.create({
                data: {
                    vaultName: vault.vaultName,
                    balance: vault.balance,
                    currency: vault.currency,
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

                    branch: vault.branchCode ? {
                        connect: { branchCode: vault.branchCode },
                    } : {},

                } as Prisma.VaultCreateInput,
            });
            return createdVault;
        } catch (error) {
            logger.error("Error creating vault", error);
            throw error;
        }
    }

    async updateVault(id: string, vault: Partial<Vault>, bearerToken: string): Promise<Vault> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.vault.update({
                where: { id },
                data: {
                    vaultName: vault.vaultName,
                    balance: vault.balance,
                    currency: vault.currency,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },

                    branch: vault.branchCode ? {
                        connect: { branchCode: vault.branchCode },
                    } : {},

                } as Prisma.VaultUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating vault with id ${id}`, error);
            throw error;
        }
    }

    static async updateVaultBalance(id: string, entering: Decimal, emerging: Decimal): Promise<Vault> {
        try {
            const vaultService = new VaultService();
            const vault = await vaultService.getVaultById(id);
            if (!vault) {
                throw new Error(`Vault with id ${id} not found`);
            }

            const updatedBalance = vault.balance.add(entering).sub(emerging);
            return await prisma.vault.update({
                where: { id },
                data: {
                    balance: updatedBalance,
                } as Prisma.VaultUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating vault balance with id ${id}`, error);
            throw error;
        }
    }

    async deleteVault(id: string): Promise<any> {
        try {
            const result = await this.vaultRepository.delete(id);
            const result2 = await prisma.vaultMovement.deleteMany({
                where: {
                    vaultId: id,
                },
            });

            return result && result2;
        } catch (error) {
            logger.error(`Error deleting vault with id ${id}`, error);
            throw error;
        }
    }

    async getVaultById(id: string): Promise<Vault | null> {
        try {
            return await this.vaultRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching vault with id ${id}`, error);
            throw error;
        }
    }

    async getAllVaults(): Promise<Vault[]> {
        try {
            return await this.vaultRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all vaults", error);
            throw error;
        }
    }

}

export default VaultService;