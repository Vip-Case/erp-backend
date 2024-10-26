
import prisma from "../../config/prisma";
import { Branch, Company, Current, Prisma, StockCard, StockCardPriceList, Warehouse } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class CurrentService {
    private currentRepository: BaseRepository<Current>;

    constructor() {
        this.currentRepository = new BaseRepository<Current>(prisma.current);
    }

    async createCurrent(current: Current): Promise<Current> {
        try {
            const createdCurrent = await prisma.current.create({
                data: {
                    currentCode: current.currentCode,
                    currentName: current.currentName,
                    currentType: current.currentType,
                    institution: current.institution,
                    identityNo: current.identityNo,
                    taxNumber: current.taxNumber,
                    taxOffice: current.taxOffice,
                    title: current.title,
                    name: current.name,
                    surname: current.surname,
                    birthOfDate: current.birthOfDate,
                    webSite: current.webSite,
                    kepAddress: current.kepAddress,
                    mersisNo: current.mersisNo,
                    sicilNo: current.sicilNo,

                    priceList: current.priceListId ? {
                        connect: {
                            id: current.priceListId
                        }
                    } : undefined,

                } as Prisma.CurrentCreateInput,
            });

            return createdCurrent;
        } catch (error) {
            logger.error("Error creating current", error);
            throw error;
        }
    }

    async updateCurrent(id: string, current: Partial<Current>): Promise<Current> {
        try {
            return await prisma.current.update({
                where: {id},
                data: {
                    currentCode: current.currentCode,
                    currentName: current.currentName,
                    currentType: current.currentType,
                    institution: current.institution,
                    identityNo: current.identityNo,
                    taxNumber: current.taxNumber,
                    taxOffice: current.taxOffice,
                    title: current.title,
                    name: current.name,
                    surname: current.surname,
                    birthOfDate: current.birthOfDate,
                    webSite: current.webSite,
                    kepAddress: current.kepAddress,
                    mersisNo: current.mersisNo,
                    sicilNo: current.sicilNo,
                    
                    priceList: current.priceListId ? {
                        connect: {
                            id: current.priceListId
                        }
                    } : {}

                } as Prisma.CurrentUpdateInput
                });
        } catch (error) {
            logger.error(`Error updating current with id ${id}`, error);
            throw error;
        }
    }

    async deleteCurrent(id: string): Promise<boolean> {
        try {
            return await this.currentRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting current with id ${id}`, error);
            throw error;
        }
    }

    async getCurrentById(id: string): Promise<Current | null> {
        try {
            return await this.currentRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching current with id ${id}`, error);
            throw error;
        }
    }

    async getAllCurrents(): Promise<Current[]> {
        try {
            return await this.currentRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all currents", error);
            throw error;
        }
    }

    async getCurrentsWithFilters(filter: any): Promise<Current[] | null> {
        try {
            return await this.currentRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching currents with filters", error);
            throw error;
        }
    }

}

export default CurrentService;