
import prisma from "../../config/prisma";
import { Company } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class CompanyService {
    private companyRepository: BaseRepository<Company>;

    constructor() {
        this.companyRepository = new BaseRepository<Company>(prisma.company);
    }

    async createCompany(company: Company): Promise<Company> {

        try {
            return await this.companyRepository.create(company);
        } catch (error) {
            logger.error("Error creating company", error);
            throw error;
        }
    }

    async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
        try {
            return await this.companyRepository.update(id, company);
        } catch (error) {
            logger.error(`Error updating company with id ${id}`, error);
            throw error;
        }
    }

    async deleteCompany(id: string): Promise<boolean> {
        try {
            return await this.companyRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting company with id ${id}`, error);
            throw error;
        }
    }

    async getCompanyById(id: string): Promise<Company | null> {
        try {
            return await this.companyRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching company with id ${id}`, error);
            throw error;
        }
    }

    async getAllCompanies(): Promise<Company[]> {
        try {
            return await this.companyRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all companies", error);
            throw error;
        }
    }

    async getCompaniesWithFilters(filter: any): Promise<Company[] | null> {
        try {
            return await this.companyRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching companies with filters", error);
            throw error;
        }
    }
}

export default CompanyService;