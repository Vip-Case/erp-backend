import { StockCard } from "@prisma/client";
import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";

export interface IStockCardRepository extends IBaseRepository<StockCard> {
    findWithFilters(filters: Partial<StockCard>): Promise<StockCard[]>;
}