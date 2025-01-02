import prisma from "../../config/prisma";
import { Brand } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

export class BrandService {
    private brandRepository: BaseRepository<Brand>;

    constructor() {
        this.brandRepository = new BaseRepository<Brand>(prisma.brand);
    }

    async createBrand(brand: Brand, bearerToken: string): Promise<Brand> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await this.brandRepository.create({
                ...brand,
                createdBy: username,
            });
        } catch (error) {
            logger.error("Error creating brand", error);
            throw error;
        }
    }

    async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
        try {
            return await this.brandRepository.update(id, brand);
        } catch (error) {
            logger.error(`Error updating brand with id ${id}`, error);
            throw error;
        }
    }

    async deleteBrand(id: string): Promise<boolean> {
        try {
            return await this.brandRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting brand with id ${id}`, error);
            throw error;
        }
    }

    async getBrandById(id: string): Promise<Brand | null> {
        try {
            return await this.brandRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching brand with id ${id}`, error);
            throw error;
        }
    }

    async getAllBrands(): Promise<Brand[]> {
        try {
            return await this.brandRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all brands", error);
            throw error;
        }
    }

    async getBrandsWithFilters(filter: any): Promise<Brand[] | null> {
        try {
            return await this.brandRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching brands with filters", error);
            throw error;
        }
    }
}