import { StockCardCategory } from "@prisma/client";
import { IStockCardCategoryRepository } from "../../abstracts/stockCard/IStockCardCategoryRepository";
import prisma from "../../../config/prisma";

export class StockCardCategoryRepository implements IStockCardCategoryRepository {
    async create(item: StockCardCategory): Promise<StockCardCategory> {
        try {
            return await prisma.stockCardCategory.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardCategory:", error);
            throw new Error("Could not create StockCardCategory");
        }
    }

    async update(id: string, item: Partial<StockCardCategory>): Promise<StockCardCategory> {
        try {
            return await prisma.stockCardCategory.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardCategory:", error);
            throw new Error("Could not update StockCardCategory");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardCategory.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting StockCardCategory:", error);
            throw new Error("Could not delete StockCardCategory");
        }
    }

    async findById(id: string): Promise<StockCardCategory | null> {
        try {
            return await prisma.stockCardCategory.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardCategory by ID:", error);
            throw new Error("Could not find StockCardCategory by ID");
        }
    }

    async findAll(): Promise<StockCardCategory[]> {
        try {
            return await prisma.stockCardCategory.findMany();
        } catch (error) {
            console.error("Error finding all StockCardCategories:", error);
            throw new Error("Could not find all StockCardCategories");
        }
    }

    async findByName(name: string): Promise<StockCardCategory | null> {
        try {
            return await prisma.stockCardCategory.findFirst({
                where: { categoryName: name },
            });
        } catch (error) {
            console.error("Error finding StockCardCategory by name:", error);
            throw new Error("Could not find StockCardCategory by name");
        }
    }
}