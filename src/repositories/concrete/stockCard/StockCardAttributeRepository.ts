import prisma from "../../../config/prisma";
import { StockCardAttribute } from "@prisma/client";
import { IStockCardAttributeRepository } from "../../abstracts/stockCard/IStockCardAttributeRepository";

export class StockCardAttributeRepository implements IStockCardAttributeRepository {
    async create(item: StockCardAttribute): Promise<StockCardAttribute> {
        try {
            return await prisma.stockCardAttribute.create({ data: item });
        } catch (error) {
            console.error('Error creating StockCardAttribute:', error);
            throw new Error('Could not create StockCardAttribute');
        }
    }

    async update(id: string, item: Partial<StockCardAttribute>): Promise<StockCardAttribute> {
        try {
            return await prisma.stockCardAttribute.update({
                where: { id },
                data: item
            });
        } catch (error) {
            console.error('Error updating StockCardAttribute:', error);
            throw new Error('Could not update StockCardAttribute');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardAttribute.delete({ where: { id } });
            return true;
        } catch (error) {
            console.error('Error deleting StockCardAttribute:', error);
            throw new Error('Could not delete StockCardAttribute');
        }
    }

    async findById(id: string): Promise<StockCardAttribute | null> {
        try {
            return await prisma.stockCardAttribute.findUnique({ where: { id } });
        } catch (error) {
            console.error('Error finding StockCardAttribute by id:', error);
            throw new Error('Could not find StockCardAttribute by id');
        }
    }

    async findAll(): Promise<StockCardAttribute[]> {
        try {
            return await prisma.stockCardAttribute.findMany();
        } catch (error) {
            console.error('Error finding all StockCardAttributes:', error);
            throw new Error('Could not find StockCardAttributes');
        }
    }

    async findByAttributeName(attributeName: string): Promise<StockCardAttribute | null> {
        try {
            return await prisma.stockCardAttribute.findFirst({
                where: { attributeName }
            });
        } catch (error) {
            console.error('Error finding StockCardAttribute by attributeName:', error);
            throw new Error('Could not find StockCardAttribute by attributeName');
        }
    }    
}