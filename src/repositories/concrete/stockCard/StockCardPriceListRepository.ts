import { StockCardPriceList } from "@prisma/client";
import { IStockCardPriceListRepository } from "../../abstracts/stockCard/IStockCardPriceListRepository";
import prisma from "../../../config/prisma";

export class StockCardPriceListRepository implements IStockCardPriceListRepository {
    async create(item: StockCardPriceList): Promise<StockCardPriceList> {
        try {
            return await prisma.stockCardPriceList.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardPriceList:", error);
            throw new Error("Could not create StockCardPriceList");
        }
    }

    async update(id: string, item: Partial<StockCardPriceList>): Promise<StockCardPriceList> {
        try {
            return await prisma.stockCardPriceList.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardPriceList:", error);
            throw new Error("Could not update StockCardPriceList");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.stockCardPriceList.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting StockCardPriceList:", error);
            throw new Error("Could not delete StockCardPriceList");
        }
    }

    async findById(id: string): Promise<StockCardPriceList | null> {
        try {
            return await prisma.stockCardPriceList.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardPriceList by ID:", error);
            throw new Error("Could not find StockCardPriceList by ID");
        }
    }

    async findAll(): Promise<StockCardPriceList[]> {
        try {
            return await prisma.stockCardPriceList.findMany();
        } catch (error) {
            console.error("Error finding all StockCardPriceLists:", error);
            throw new Error("Could not find all StockCardPriceLists");
        }
    }
}