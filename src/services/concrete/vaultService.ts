
import prisma from "../../config/prisma";
import { Prisma, Vault } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class VaultService {
    private vaultRepository: BaseRepository<Vault>;
    
    constructor() {
        this.vaultRepository = new BaseRepository<Vault>(prisma.vault);
    }

    async createVault(vault: Vault): Promise<Vault> {
        try {
            const createdVault = await prisma.vault.create({
                data: {
                    vaultName: vault.vaultName,
                    balance: vault.balance,
                    currency: vault.currency,
                    branch: {
                        connect: { branchCode: vault.branchCode }, // Sadece ilişki kullanılıyor
                    },

                } as Prisma.VaultCreateInput,
            });
            return createdVault;
        } catch (error) {
            logger.error("Error creating vault", error);
            throw error;
        }
    }

    async updateVault(id: string, vault: Partial<Vault>): Promise<Vault> {
        try {
            return await prisma.vault.update({
                where: {id},
                data: {
                    vaultName: vault.vaultName,
                    balance: vault.balance,
                    currency: vault.currency,
                    branch: {
                        connect: { branchCode: vault.branchCode }, // Sadece ilişki kullanılıyor
                    },

                } as Prisma.VaultUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating vault with id ${id}`, error);
            throw error;
        }
    }

    async deleteVault(id: string): Promise<boolean> {
        try {
            return await this.vaultRepository.delete(id);
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