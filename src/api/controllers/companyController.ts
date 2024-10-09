
import CompanyService from '../../services/concrete/companyService';
import { Context } from 'elysia';
import { Company } from '@prisma/client';

// Service Initialization
const companyService = new CompanyService();

export const CompanyController = {

    createCompany: async (ctx: Context) => {
        const companyData: Company = ctx.body as Company;
        try {
            const company = await companyService.createCompany(companyData);
            ctx.set.status = 200;
            return company;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating company", details: error.message };
        }
    },

    updateCompany: async (ctx: Context) => {
        const { id } = ctx.params;
        const companyData: Partial<Company> = ctx.body as Partial<Company>;
        try {
            const company = await companyService.updateCompany(id, companyData);
            ctx.set.status = 200;
            return company;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating company", details: error.message };
        }
    },

    deleteCompany: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const company = await companyService.deleteCompany(id);
            ctx.set.status = 200;
            return company;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting company", details: error.message };
        }
    },

    getCompanyById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const company = await companyService.getCompanyById(id);
            if (!company) {
                return ctx.error(404, 'Company not found');
            }
            ctx.set.status = 200;
            return company;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching company", details: error.message };
        }
    },

    getAllCompanies: async (ctx: Context) => {
        try {
            const companies = await companyService.getAllCompanies();
            ctx.set.status = 200;
            return companies;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching companies", details: error.message };
        }
    },

    getCompaniesWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Company>;
        try {
            const companies = await companyService.getCompaniesWithFilters(filters);
            ctx.set.status = 200;
            return companies;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching companies", details: error.message };
        }
    }
}

export default CompanyController;