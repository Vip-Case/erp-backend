
import prisma from "../../config/prisma";
import { Prisma, StockCardAttribute } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class AttributeService {
    private attributeRepository: BaseRepository<StockCardAttribute>;

    constructor() {
        this.attributeRepository = new BaseRepository<StockCardAttribute>(prisma.stockCardAttribute);
    }

    async createAttribute(attribute: StockCardAttribute): Promise<StockCardAttribute> {
        try {
            return await this.attributeRepository.create(attribute);
        } catch (error) {
            logger.error("Error creating attribute", error);
            throw error;
        }
    }

    async createManyAttribute(attributes: StockCardAttribute[]): Promise<Prisma.BatchPayload> {
        try {
            return await prisma.stockCardAttribute.createMany({
                data: attributes
            });
        } catch (error) {
            logger.error("Error creating multiple attributes", error);
            throw error;
        }
    }

    async updateAttribute(id: string, attribute: Partial<StockCardAttribute>): Promise<StockCardAttribute> {
        try {
            return await this.attributeRepository.update(id, attribute);
        } catch (error) {
            logger.error(`Error updating attribute with id ${id}`, error);
            throw error;
        }
    }

    async deleteAttribute(id: string): Promise<boolean> {
        try {
            return await this.attributeRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting attribute with id ${id}`, error);
            throw error;
        }
    }

    async getAttributeById(id: string): Promise<StockCardAttribute | null> {
        try {
            return await this.attributeRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching attribute with id ${id}`, error);
            throw error;
        }
    }

    async getAllAttributes(): Promise<StockCardAttribute[]> {
        try {
            return await this.attributeRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all attributes", error);
            throw error;
        }
    }

    async getAttributesWithFilters(filter: any): Promise<StockCardAttribute[] | null> {
        try {
            return await this.attributeRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching attributes with filters", error);
            throw error;
        }
    }
}

export default AttributeService;
