
import BranchService from '../../services/concrete/branchService';
import { Context } from 'elysia';
import { Branch } from '@prisma/client';

// Service Initialization
const branchService = new BranchService();

export const BranchController = {

    createBranch: async (ctx: Context) => {
        const branchData: Branch = ctx.body as Branch;
        const bearerToken = ctx.request.headers.get("Authorization");

        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }

        try {
            const branch = await branchService.createBranch(branchData, bearerToken);
            ctx.set.status = 200;
            return branch;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating branch", details: error.message };
        }
    },

    updateBranch: async (ctx: Context) => {
        const { id } = ctx.params;
        const branchData: Partial<Branch> = ctx.body as Partial<Branch>;
        try {
            const branch = await branchService.updateBranch(id, branchData);
            ctx.set.status = 200;
            return branch;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating branch", details: error.message };
        }
    },

    deleteBranch: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const branch = await branchService.deleteBranch(id);
            ctx.set.status = 200;
            return branch;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting branch", details: error.message };
        }
    },

    getBranchById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const branch = await branchService.getBranchById(id);
            if (!branch) {
                return ctx.error(404, 'Branch not found');
            }
            ctx.set.status = 200;
            return branch;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching branch", details: error.message };
        }
    },

    getAllBranches: async (ctx: Context) => {
        try {
            const branches = await branchService.getAllBranches();
            ctx.set.status = 200;
            return branches;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching branches", details: error.message };
        }
    },

    getBranchesWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Branch>;
        try {
            const branches = await branchService.getBranchesWithFilters(filters);
            ctx.set.status = 200;
            return branches;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching branches", details: error.message };
        }
    }
}

export default BranchController;