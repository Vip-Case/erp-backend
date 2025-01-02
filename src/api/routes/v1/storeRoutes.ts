import { Elysia } from 'elysia';
import { StoreController } from '../../controllers/storeController';

export const StoreRoutes = (app: Elysia) => {
    app.group("/stores", (app) =>
        app.get("/", StoreController.getAllStores, { tags: ["Stores"] })
            .post("/", StoreController.createStore, { tags: ["Stores"] })
            .get("/:id", StoreController.getStoreById, { tags: ["Stores"] })
            .put("/:id", StoreController.updateStore, { tags: ["Stores"] })
            .delete("/:id", StoreController.deleteStore, { tags: ["Stores"] })
    );
    return app;
};

export default StoreRoutes;