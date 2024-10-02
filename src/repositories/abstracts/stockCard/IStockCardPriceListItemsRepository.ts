import { StockCardPriceListItems } from "@prisma/client";
import { IBaseRepository } from "../../../interfaces/repositories/IBaseRepository";

export interface IStockCardPriceListItemsRepository extends IBaseRepository<StockCardPriceListItems>{
    createMany(stockCardPriceListItems: StockCardPriceListItems[]): Promise<StockCardPriceListItems[]>;
}