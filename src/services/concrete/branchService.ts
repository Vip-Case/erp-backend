
import prisma from "../../config/prisma";
import { Branch } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class BranchService {
    private branchRepository: BaseRepository<Branch>;

    constructor() {
        this.branchRepository = new BaseRepository<Branch>(prisma.branch);
    }

    async createBranch(branch: Branch): Promise<Branch> {
        try {
            return await this.branchRepository.create(branch);
        } catch (error) {
            logger.error("Error creating branch", error);
            throw error;
        }
    }

    async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
        try {
            return await this.branchRepository.update(id, branch);
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