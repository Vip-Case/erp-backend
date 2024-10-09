import { Elysia } from 'elysia';
import PriceListController from '../../controllers/priceListController';

export const PriceListRoutes = (app: Elysia) => {
    app.group("/priceLists", (app) =>
        app.get("/", PriceListController.getAllPriceLists, { tags: ["Price Lists"] })
            .post("/", PriceListController.createPriceList, { tags: ["Price Lists"] })
            .get("/:id", PriceListController.getPriceListById, { tags: ["Price Lists"] })
            .put("/:id", PriceListController.updatePriceList, { tags: ["Price Lists"] })
            .delete("/:id", PriceListController.deletePriceList, { tags: ["Price Lists"] })
            
    );
};

export default PriceListRoutes;