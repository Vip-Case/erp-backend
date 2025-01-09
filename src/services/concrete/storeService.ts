
import prisma from "../../config/prisma";
import { Store, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

export class StoreService {
    private storeRepository: BaseRepository<Store>;

    constructor() {
        this.storeRepository = new BaseRepository<Store>(prisma.store);
    }

    async createStore(data: any, bearerToken: string): Promise<Store> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.store.create({
                data: {
                    name: data.name,
                    marketPlace: {
                        connect: { id: data.marketPlaceId }, // marketPlaceId yerine marketPlace kullanımı
                    },
                    apiCredentials: data.apiCredentials,
                    autoInvoiceCreation: data.autoInvoiceCreation ?? false, // Varsayılan false
                    storeUrl: data.storeUrl ?? null, // Null ya da string değeri
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
                } as Prisma.StoreCreateInput,
            });
        } catch (error) {
            logger.error("Error creating Store", error);
            throw error;
        }
    }

    async updateStore(id: string, data: Prisma.StoreUpdateInput, bearerToken: string): Promise<Store> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.store.update({
                where: { id },
                data: {
                    ...data,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },
                } as Prisma.StoreUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating Store with id ${id}`, error);
            throw error;
        }
    }

    async deleteStore(id: string): Promise<boolean> {
        try {
            await this.storeRepository.delete(id);
            return true;
        } catch (error) {
            logger.error(`Error deleting Store with id ${id}`, error);
            throw error;
        }
    }

    async getStoreById(id: string): Promise<Store | null> {
        try {
            return await prisma.store.findUnique({
                where: { id },
                include: {
                    marketPlace: true,
                }
            });
        } catch (error) {
            logger.error(`Error fetching Store with id ${id}`, error);
            throw error;
        }
    }

    async getAllStores(): Promise<Store[]> {
        try {
            return await prisma.store.findMany({
                include: {
                    marketPlace: true,
                }
            });
        } catch (error) {
            logger.error("Error fetching all Stores", error);
            throw error;
        }
    }
}