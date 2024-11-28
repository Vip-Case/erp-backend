import { PrismaClient, StockCardManufacturer } from '@prisma/client';

const prisma = new PrismaClient();

export class ManufacturerService {

    async getAllManufacturers(): Promise<StockCardManufacturer[]> {
        return await prisma.stockCardManufacturer.findMany();
    }

    async getManufacturerById(id: string): Promise<StockCardManufacturer | null> {
        return await prisma.stockCardManufacturer.findUnique({
            where: { id },
        });
    }

    async createManufacturer(data: StockCardManufacturer): Promise<StockCardManufacturer> {
        return await prisma.stockCardManufacturer.create({
            data,
        });
    }

    async updateManufacturer(id: string, data: Partial<StockCardManufacturer>): Promise<StockCardManufacturer> {
        return await prisma.stockCardManufacturer.update({
            where: { id },
            data,
        });
    }

    async deleteManufacturer(id: string): Promise<StockCardManufacturer> {
        return await prisma.stockCardManufacturer.delete({
            where: { id },
        });
    }
}

export default new ManufacturerService();