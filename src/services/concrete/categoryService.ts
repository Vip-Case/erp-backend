import { StockCardCategory } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import prisma from "../../config/prisma";
import logger from "../../utils/logger";

export class CategoryService {
    private categoryRepository: BaseRepository<StockCardCategory>;

    constructor() {
        this.categoryRepository = new BaseRepository<StockCardCategory>(prisma.stockCardCategory);
    }

    async createCategory(category: StockCardCategory): Promise<StockCardCategory> {
        try {
            return await this.categoryRepository.create(category);
        } catch (error) {
            logger.error("Error creating category", error);
            throw error;
        }
    }

    async updateCategory(id: string, category: Partial<StockCardCategory>): Promise<StockCardCategory> {
        try {
            return await this.categoryRepository.update(id, category);
        } catch (error) {
            logger.error(`Error updating category with id ${id}`, error);
            throw error;
        }
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            return await this.categoryRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting category with id ${id}`, error);
            throw error;
        }
    }

    async getCategoryById(id: string): Promise<StockCardCategory | null> {
        try {
            return await this.categoryRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching category with id ${id}`, error);
            throw error;
        }
    }

    async getAllCategories(): Promise<StockCardCategory[]> {
        try {
            return await this.categoryRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all categories", error);
            throw error;
        }
    }

    async getCategoriesWithFilters(filter: any): Promise<StockCardCategory[] | null> {
        try {
            return await this.categoryRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching categories with filters", error);
            throw error;
        }
    }
}

export default CategoryService;