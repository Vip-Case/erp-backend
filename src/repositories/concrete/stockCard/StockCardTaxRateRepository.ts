import { StockCardTaxRate } from "@prisma/client";
import { IStockCardTaxRateRepository } from "../../abstracts/stockCard/IStockCardTaxRateRepository";
import prisma from "../../../config/prisma";

export class StockCardTaxRateRepository implements IStockCardTaxRateRepository {
    async create(item: StockCardTaxRate): Promise<StockCardTaxRate> {
        try {
            return await prisma.stockCardTaxRate.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardTaxRate:", error);
            throw new Error("Could not create StockCardTaxRate");
        }
    }

    async update(id: string, item: Partial<StockCardTaxRate>): Promise<StockCardTaxRate> {
        try {
            return await prisma.stockCardTaxRate.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardTaxRate:", error);
            throw new Error("Could not update StockCardTaxRate");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardTaxRate.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting StockCardTaxRate:", error);
            throw new Error("Could not delete StockCardTaxRate");
        }
    }

    async findById(id: string): Promise<StockCardTaxRate | null> {
        try {
            return await prisma.stockCardTaxRate.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardTaxRate by ID:", error);
            throw new Error("Could not find StockCardTaxRate by ID");
        }
    }

    async findAll(): Promise<StockCardTaxRate[]> {
        try {
            return await prisma.stockCardTaxRate.findMany();
        } catch (error) {
            console.error("Error finding all StockCardTaxRates:", error);
            throw new Error("Could not find all StockCardTaxRates");
        }
    }
}