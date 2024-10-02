import { StockCardPriceListItems } from "@prisma/client";
import { IStockCardPriceListItemsRepository } from "../../abstracts/stockCard/IStockCardPriceListItemsRepository";
import prisma from "../../../config/prisma";

export class StockCardPriceListItemsRepository implements IStockCardPriceListItemsRepository {
    async create(item: StockCardPriceListItems): Promise<StockCardPriceListItems> {
        try {
            return await prisma.stockCardPriceListItems.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardPriceListItems:", error);
            throw new Error("Could not create StockCardPriceListItems");
        }
    }

    async createMany(stockCardPriceListItems: StockCardPriceListItems[]): Promise<StockCardPriceListItems[]> {
        try {
            await prisma.stockCardPriceListItems.createMany({ data: stockCardPriceListItems });
            return stockCardPriceListItems;
        } catch (error) {
            console.error("Error creating StockCardPriceListItems:", error);
            throw new Error(`Could not create StockCardPriceListItems`);
        }
    }

    async update(id: string, item: Partial<StockCardPriceListItems>): Promise<StockCardPriceListItems> {
        try {
            return await prisma.stockCardPriceListItems.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardPriceListItems:", error);
            throw new Error("Could not update StockCardPriceListItems");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardPriceListItems.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting StockCardPriceListItems:", error);
            throw new Error("Could not delete StockCardPriceListItems");
        }
    }

    async findById(id: string): Promise<StockCardPriceListItems | null> {
        try {
            return await prisma.stockCardPriceListItems.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardPriceListItems by ID:", error);
            throw new Error("Could not find StockCardPriceListItems by ID");
        }
    }

    async findAll(): Promise<StockCardPriceListItems[]> {
        try {
            return await prisma.stockCardPriceListItems.findMany();
        } catch (error) {
            console.error("Error finding all StockCardPriceListItems:", error);
            throw new Error("Could not find all StockCardPriceListItems");
        }
    }
}