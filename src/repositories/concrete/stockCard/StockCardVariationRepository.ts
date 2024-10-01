import { StockCardVariation } from "@prisma/client";
import { IStockCardVariationRepository } from "../../abstracts/stockCard/IStockCardVariationRepository";
import prisma from "../../../config/prisma";

export class StockCardVariationRepository implements IStockCardVariationRepository {
    async create(item: StockCardVariation): Promise<StockCardVariation> {
        try {
            return await prisma.stockCardVariation.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardVariation:", error);
            throw new Error("Could not create StockCardVariation");
        }
    }

    async update(id: string, item: Partial<StockCardVariation>): Promise<StockCardVariation> {
        try {
            return await prisma.stockCardVariation.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardVariation:", error);
            throw new Error("Could not update StockCardVariation");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardVariation.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting StockCardVariation:", error);
            throw new Error("Could not delete StockCardVariation");
        }
    }

    async findById(id: string): Promise<StockCardVariation | null> {
        try {
            return await prisma.stockCardVariation.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardVariation by ID:", error);
            throw new Error("Could not find StockCardVariation by ID");
        }
    }

    async findAll(): Promise<StockCardVariation[]> {
        try {
            return await prisma.stockCardVariation.findMany();
        } catch (error) {
            console.error("Error finding all StockCardVariations:", error);
            throw new Error("Could not find all StockCardVariations");
        }
    }
}