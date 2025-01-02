
import prisma from "../../config/prisma";
import { MarketPlace, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

interface CustomMarketPlaceCreateInput extends Prisma.MarketPlaceCreateInput {
    companyCode?: string;
}

export class MarketPlaceService {
    private marketPlaceRepository: BaseRepository<MarketPlace>;

    constructor() {
        this.marketPlaceRepository = new BaseRepository<MarketPlace>(prisma.marketPlace);
    }

    async createMarketPlace(data: CustomMarketPlaceCreateInput, bearerToken: string): Promise<MarketPlace> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.marketPlace.create({
                data: {
                    name: data.name,
                    apiBaseUrl: data.apiBaseUrl,
                    logoUrl: data.logoUrl,
                    createdByUser: {
                        connect: {
                            username: username
                        }
                    }, 
                    company: data.companyCode
                    ? {
                          connect: { companyCode: data.companyCode },
                      }
                    : undefined,
                }
            });
        } catch (error) {
            logger.error("Error creating MarketPlace", error);
            throw error;
        }
    }

    async updateMarketPlace(id: string, data: Prisma.MarketPlaceUpdateInput, bearerToken: string): Promise<MarketPlace> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.marketPlace.update({
                where: { id },
                data: {
                    ...data,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    }
                }
            });
        } catch (error) {
            logger.error(`Error updating MarketPlace with id ${id}`, error);
            throw error;
        }
    }

    async deleteMarketPlace(id: string): Promise<boolean> {
        try {
            await this.marketPlaceRepository.delete(id);
            return true;
        } catch (error) {
            logger.error(`Error deleting MarketPlace with id ${id}`, error);
            throw error;
        }
    }

    async getMarketPlaceById(id: string): Promise<MarketPlace | null> {
        try {
            return await prisma.marketPlace.findUnique({
                where: { id },
                include: {
                    Store: true,
                    MarketPlaceAttributes: true
                }
            });
        } catch (error) {
            logger.error(`Error fetching MarketPlace with id ${id}`, error);
            throw error;
        }
    }

    async getAllMarketPlaces(): Promise<MarketPlace[]> {
        try {
            return await prisma.marketPlace.findMany({
                include: {
                    Store: true,
                    MarketPlaceAttributes: true
                }
            });
        } catch (error) {
            logger.error("Error fetching all MarketPlaces", error);
            throw error;
        }
    }
}

export default MarketPlaceService;