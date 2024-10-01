import { StockCard } from "@prisma/client";
import { IStockCardRepository } from "../../abstracts/stockCard/IStockCardRepository";
import prisma from "../../../config/prisma";

export class StockCardRepository implements IStockCardRepository {
    async create(item: StockCard): Promise<StockCard> {
        try {
            return await prisma.stockCard.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCard:", error);
            throw new Error("Could not create StockCard");
        }
    }

    async update(id: string, item: Partial<StockCard>): Promise<StockCard> {
        try {
            return await prisma.stockCard.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCard:", error);
            throw new Error("Could not update StockCard");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await prisma.stockCard.delete({
                where: { id },
            });
            return result !== null;
        } catch (error) {
            console.error("Error deleting StockCard:", error);
            throw new Error("Could not delete StockCard");
        }
    }

    async findById(id: string): Promise<StockCard | null> {
        try {
            return await prisma.stockCard.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async findAll(): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany();
        } catch (error) {
            console.error("Error finding all StockCards:", error);
            throw new Error("Could not find StockCards");
        }
    }

    async findWithFilters(filters: Partial<StockCard>): Promise<StockCard[]> {
        try {
            return await prisma.stockCard.findMany({
                where: {
                    ...filters,
                },
            });
        } catch (error) {
            console.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }
}