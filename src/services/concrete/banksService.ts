
import prisma from "../../config/prisma";
import { Banks } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class BanksService {
    private banksRepository: BaseRepository<Banks>;

    constructor() {
        this.banksRepository = new BaseRepository<Banks>(prisma.banks);
    }

    async createBanks(banks: Banks): Promise<Banks> {
        try {
            return await this.banksRepository.create(banks);
        } catch (error) {
            logger.error("Error creating banks", error);
            throw error;
        }
    }

    async updateBanks(id: string, banks: Partial<Banks>): Promise<Banks> {
        try {
            return await this.banksRepository.update(id, banks);
        } catch (error) {
            logger.error(`Error updating banks with id ${id}`, error);
            throw error;
        }
    }

    async deleteBanks(id: string): Promise<boolean> {
        try {
            return await this.banksRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting banks with id ${id}`, error);
            throw error;
        }
    }

    async getBanksById(id: string): Promise<Banks | null> {
        try {
            return await this.banksRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching banks with id ${id}`, error);
            throw error;
        }
    }

    async getAllBanks(): Promise<Banks[]> {
        try {
            return await this.banksRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all banks", error);
            throw error;
        }
    }

    async getBanksWithFilters(filter: any): Promise<Banks[] | null> {
        try {
            return await this.banksRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching banks with filters", error);
            throw error;
        }
    }
}

export default BanksService;