import { StockCardBarcode } from "@prisma/client";
import { IStockCardBarcodeRepository } from "../../abstracts/stockCard/IStockCardBarcodeRepository";
import prisma from "../../../config/prisma";

export class StockCardBarcodeRepository implements IStockCardBarcodeRepository {
    async create(item: StockCardBarcode): Promise<StockCardBarcode> {
        try {
            return await prisma.stockCardBarcode.create({ data: item });
        } catch (error) {
            console.error("Error creating StockCardBarcode:", error);
            throw new Error("Could not create StockCardBarcode");
        }
    }

    async update(id: string, item: Partial<StockCardBarcode>): Promise<StockCardBarcode> {
        try {
            return await prisma.stockCardBarcode.update({
                where: { id },
                data: item,
            });
        } catch (error) {
            console.error("Error updating StockCardBarcode:", error);
            throw new Error("Could not update StockCardBarcode");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await prisma.stockCardBarcode.delete({
                where: { id },
            });
            return result !== null;
        } catch (error) {
            console.error("Error deleting StockCardBarcode:", error);
            throw new Error("Could not delete StockCardBarcode");
        }
    }

    async findById(id: string): Promise<StockCardBarcode | null> {
        try {
            return await prisma.stockCardBarcode.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("Error finding StockCardBarcode by id:", error);
            throw new Error("Could not find StockCardBarcode");
        }
    }

    async findAll(): Promise<StockCardBarcode[]> {
        try {
            return await prisma.stockCardBarcode.findMany();
        } catch (error) {
            console.error("Error finding all StockCardBarcodes:", error);
            throw new Error("Could not find StockCardBarcodes");
        }
    }
}