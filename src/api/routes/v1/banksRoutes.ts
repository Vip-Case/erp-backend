import { Elysia } from 'elysia';
import BanksController from '../../controllers/banksController';
import { BanksPlain } from '../../../../prisma/prismabox/Banks';

export const BanksRoutes = (app: Elysia) => {
    app.group("/banks", (app) =>
        app.get("/", BanksController.getAllBanks, { tags: ["Banks"] })
            .post("/", BanksController.createBanks, { tags: ["Banks"] })
            .get("/:id", BanksController.getBanksById, { tags: ["Banks"] })
            .put("/:id", BanksController.updateBanks, { tags: ["Banks"] })
            .delete("/:id", BanksController.deleteBanks, { tags: ["Banks"] })
    );
};

export default BanksRoutes;