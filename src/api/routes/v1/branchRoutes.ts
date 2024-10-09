
import { Elysia } from 'elysia';
import BranchController from '../../controllers/branchController';
import { BranchPlain } from '../../../../prisma/prismabox/Branch';

export const BranchRoutes = (app: Elysia) => {
    app.group("/branches", (app) =>
        app.get("/", BranchController.getAllBranches, { tags: ["Branches"]})
            .post("/", BranchController.createBranch, { tags: ["Branches"] })
            .get("/:id", BranchController.getBranchById, { tags: ["Branches"] })
            .put("/:id", BranchController.updateBranch, { tags: ["Branches"] })
            .delete("/:id", BranchController.deleteBranch, { tags: ["Branches"] })
            .get("/filter", BranchController.getBranchesWithFilters, { tags: ["Branches"] })
    );
};

export default BranchRoutes;