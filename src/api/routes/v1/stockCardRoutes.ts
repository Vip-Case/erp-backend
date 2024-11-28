import { Elysia } from 'elysia';
import StockCardController from '../../controllers/stockCardController';


export const StockCardRoutes = (app: Elysia) => {
    app.group("/stockcards", (app) =>
        app.get("/createStockCard", StockCardController.getAllStockCards, { tags: ["Stock Cards"] }) //, body: StockCardPlainInputCreate, response: { body: StockCardPlain }
            .post("/create", StockCardController.createStockCard, { tags: ["Stock Cards"] }) //, response: { body: StockCardPlain }
            .get("/:id", StockCardController.getStockCardById, { tags: ["Stock Cards"] })
            .put("/:id", StockCardController.updateStockCard, { tags: ["Stock Cards"] })
            .delete("/:id", StockCardController.deleteStockCard, { tags: ["Stock Cards"] })
            .post("/", StockCardController.createStockCardsWithRelations, { tags: ["Stock Cards"] })
            .put("/updateStockCardsWithRelations/:id", StockCardController.updateStockCardsWithRelations, { tags: ["Stock Cards"] })
            .delete("/deleteStockCardsWithRelations/:id", StockCardController.deleteStockCardsWithRelations, { tags: ["Stock Cards"] })
            .delete("/deleteManyStockCardsWithRelations", StockCardController.deleteManyStockCardsWithRelations, { tags: ["Stock Cards"] })
            .get("/stockCardsWithRelations", StockCardController.getAllStockCardsWithRelations, { tags: ["Stock Cards"] })
            .get("/stockCardsWithRelations/:id", StockCardController.getStockCardsWithRelationsById, { tags: ["Stock Cards"] })
            .get("/search", StockCardController.searchStockCards, { tags: ["Stock Cards"] })
    );
};

export default StockCardRoutes;