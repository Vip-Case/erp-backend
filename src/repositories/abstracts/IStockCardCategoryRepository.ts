import { StockCardCategory } from "@prisma/client";
import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";

export interface IStockCardCategoryRepository extends IBaseRepository<StockCardCategory>{
    findByName(name: string): Promise<StockCardCategory |
        null>;
}