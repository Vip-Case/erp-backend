import { Elysia } from 'elysia';
import StockCardController from '../../controllers/stockCardController';
import { StockCardPlainInputCreate } from '../../../../prisma/prismabox/StockCard';
import { StockCardPlain } from '../../../../prisma/prismabox/StockCard';

export const StockCardRoutes = (app: Elysia) => {
    app.group("/stockcards", (app) =>
        app.get("/", StockCardController.getAllStockCards, { tags: ["Stock Cards"] })
            .post("", StockCardController.createStockCard, { tags: ["Stock Cards"], body: StockCardPlainInputCreate, response: { body: StockCardPlain } })
            .get("/:id", StockCardController.getStockCardById, { tags: ["Stock Cards"], response: { body: StockCardPlain } })
            .put("/:id", StockCardController.updateStockCard, { tags: ["Stock Cards"] })
            .delete("/:id", StockCardController.deleteStockCard, { tags: ["Stock Cards"] })
            .post("/createStockCardsWithRelations", StockCardController.createStockCardsWithRelations, { tags: ["Stock Cards"] })
            .put("/updateStockCardsWithRelations/:id", StockCardController.updateStockCardsWithRelations, { tags: ["Stock Cards"] })
            .delete("/deleteStockCardsWithRelations/:id", StockCardController.deleteStockCardsWithRelations, { tags: ["Stock Cards"] })
            .get("/stockCardsWithRelations", StockCardController.getAllStockCardsWithRelations, { tags: ["Stock Cards"] })
            .get("/stockCardsWithRelations/:id", StockCardController.getStockCardsWithRelationsById, { tags: ["Stock Cards"] })
    );
};

export default StockCardRoutes;