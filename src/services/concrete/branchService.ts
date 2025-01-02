
import prisma from "../../config/prisma";
import { Branch, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";
export class BranchService {
    private branchRepository: BaseRepository<Branch>;

    constructor() {
        this.branchRepository = new BaseRepository<Branch>(prisma.branch);
    }

    async createBranch(branch: Branch, bearerToken: string): Promise<Branch> {

        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdBranch = await prisma.branch.create({
                data: {
                    branchName: branch.branchName,
                    branchCode: branch.branchCode,
                    address: branch.address,
                    countryCode: branch.countryCode,
                    city: branch.city,
                    district: branch.district,
                    phone: branch.phone,
                    email: branch.email,
                    website: branch.website,
                    createdByUser: {
                        connect: {
                            username: username
                            }
                    },

                    company: branch.companyCode ? {
                        connect: { companyCode: branch.companyCode },
                    } : {}
                } as Prisma.BranchCreateInput
            });
            return createdBranch;
        } catch (error) {
            logger.error("Error creating branch", error);
            throw error;
        }
    }

    async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
        try {
            return await prisma.branch.update({
                where: {id}, 
                data: {
                    branchName: branch.branchName,
                    branchCode: branch.branchCode,
                    address: branch.address,
                    countryCode: branch.countryCode,
                    city: branch.city,
                    district: branch.district,
                    phone: branch.phone,
                    email: branch.email,
                    website: branch.website,

                    company: branch.companyCode ? {
                        connect: { companyCode: branch.companyCode },
                    } : {}
                } as Prisma.BranchUpdateInput
            });
        } catch (error) {
            logger.error(`Error updating branch with id ${id}`, error);
            throw error;
        }
    }

    async deleteBranch(id: string): Promise<boolean> {
        try {
            return await this.branchRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting branch with id ${id}`, error);
            throw error;
        }
    }

    async getBranchById(id: string): Promise<Branch | null> {
        try {
            return await this.branchRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching branch with id ${id}`, error);
            throw error;
        }
    }

    async getAllBranches(): Promise<Branch[]> {
        try {
            return await this.branchRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all branches", error);
            throw error;
        }
    }

    async getBranchesWithFilters(filter: any): Promise<Branch[] | null> {
        try {
            return await this.branchRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching branches with filters", error);
            throw error;
        }
    }
}

export default BranchService;