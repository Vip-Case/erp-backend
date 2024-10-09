import prisma from "../../config/prisma";
import { StockCardPriceList } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class PriceListService {
    private priceListRepository: BaseRepository<StockCardPriceList>;

    constructor() {
        this.priceListRepository = new BaseRepository<StockCardPriceList>(prisma.stockCardPriceList);
    }

    async createPriceList(priceList: StockCardPriceList): Promise<StockCardPriceList> {
        try {
            return await this.priceListRepository.create(priceList);
        } catch (error) {
            logger.error("Error creating price list", error);
            throw error;
        }
    }

    async updatePriceList(id: string, priceList: Partial<StockCardPriceList>): Promise<StockCardPriceList> {
        try {
            return await this.priceListRepository.update(id, priceList);
        } catch (error) {
            logger.error(`Error updating price list with id ${id}`, error);
            throw error;
        }
    }

    async deletePriceList(id: string): Promise<boolean> {
        try {
            return await this.priceListRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting price list with id ${id}`, error);
            throw error;
        }
    }

    async getPriceListById(id: string): Promise<StockCardPriceList | null> {
        try {
            return await this.priceListRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching price list with id ${id}`, error);
            throw error;
        }
    }

    async getAllPriceLists(): Promise<StockCardPriceList[]> {
        try {
            return await this.priceListRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all price lists", error);
            throw error;
        }
    }

    async getPriceListsWithFilters(filter: any): Promise<StockCardPriceList[] | null> {
        try {
            return await this.priceListRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching price lists with filters", error);
            throw error;
        }
    }
}

export default PriceListService;