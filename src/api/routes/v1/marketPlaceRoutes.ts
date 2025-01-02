import { Elysia } from 'elysia';
import { MarketPlaceController } from '../../controllers/marketPlaceController';

export const MarketPlaceRoutes = (app: Elysia) => {
    app.group("/marketplaces", (app) =>
        app.get("/", MarketPlaceController.getAllMarketPlaces, { tags: ["MarketPlaces"] })
            .post("/", MarketPlaceController.createMarketPlace, { tags: ["MarketPlaces"] })
            .get("/:id", MarketPlaceController.getMarketPlaceById, { tags: ["MarketPlaces"] })
            .put("/:id", MarketPlaceController.updateMarketPlace, { tags: ["MarketPlaces"] })
            .delete("/:id", MarketPlaceController.deleteMarketPlace, { tags: ["MarketPlaces"] })
    );
    return app;
};

export default MarketPlaceRoutes;