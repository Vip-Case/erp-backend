import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../interfaces/repositories/IBaseRepository';

export class BaseRepository<T> implements IBaseRepository<T> {

    private prisma: PrismaClient;
    private model: any;

    constructor(model: any) {
        this.prisma = new PrismaClient();
        this.model = model;
    }

    async findAll(options?: object): Promise<T[]> {
        return this.model.findMany(options);
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findUnique({
            where: { id: id },
        });
    }

    async findByIdWithOptions(id: string, options: object): Promise<T | null> {
        return this.model.findUnique({
            where: { id: id },
            ...options,
        });
    }
    
    async findWithFilters(filter: any): Promise<T[] | null> {
        return this.model.findMany({
            where: filter,
        });
    }

    async create(item: T): Promise<T> {
        return this.model.create({
            data: item,
        });
    }

    async update(id: string, item: Partial<T>): Promise<T> {
        return this.model.update({
            where: { id: id },
            data: item,
        });
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.model.delete({
                where: { id: id },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteWithFilters(filter: any): Promise<boolean> {
        try {
            await this.model.deleteMany({
                where: filter,
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}