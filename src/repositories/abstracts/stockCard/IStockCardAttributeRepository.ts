import { StockCardAttribute } from "@prisma/client";
import { IBaseRepository } from "../../../interfaces/repositories/IBaseRepository";

export interface IStockCardAttributeRepository extends IBaseRepository<StockCardAttribute>{
    findByAttributeName(attributeName: string): Promise<StockCardAttribute | null>;
}