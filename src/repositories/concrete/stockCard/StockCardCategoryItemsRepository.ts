import { StockCardCategoryItem } from "@prisma/client";
import { IStockCardCategoryItemsRepository } from "../../abstracts/stockCard/IStockCardCategoryItemsRepository";
import prisma from "../../../config/prisma";

export class StockCardCategoryItemsRepository implements IStockCardCategoryItemsRepository {
    async create(item: StockCardCategoryItem): Promise<StockCardCategoryItem> {
        try {
            return await prisma.stockCardCategoryItem.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardCategoryItem:", error);
            throw new Error("Could not create StockCardCategoryItem");
        }
    }

    async createMany(stockCardCategoryItems: StockCardCategoryItem[]): Promise<StockCardCategoryItem[]> {
        try {
            await prisma.stockCardCategoryItem.createMany({ data: stockCardCategoryItems });
            return stockCardCategoryItems;
        } catch (error) {
            console.error("Error creating StockCardCategoryItems:", error);
            throw new Error(`Could not create StockCardCategoryItems`);
        }
    }

    async update(id: string, item: Partial<StockCardCategoryItem>): Promise<StockCardCategoryItem> {
        try {
            return await prisma.stockCardCategoryItem.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardCategoryItem:", error);
            throw new Error("Could not update StockCardCategoryItem");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await prisma.stockCardCategoryItem.delete({
                where: { id },
            });
            return result !== null;
        } catch (error) {
            console.error("Error deleting StockCardCategoryItem:", error);
            throw new Error("Could not delete StockCardCategoryItem");
        }
    }

    async findById(id: string): Promise<StockCardCategoryItem | null> {
        try {
            return await prisma.stockCardCategoryItem.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardCategoryItem by id:", error);
            throw new Error("Could not find StockCardCategoryItem by id");
        }
    }

    async findAll(): Promise<StockCardCategoryItem[]> {
        try {
            return await prisma.stockCardCategoryItem.findMany();
        } catch (error) {
            console.error("Error finding all StockCardCategoryItems:", error);
            throw new Error("Could not find StockCardCategoryItems");
        }
    }
}