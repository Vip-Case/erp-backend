import { Elysia } from 'elysia';
import { BrandController } from '../../controllers/brandController';

export const BrandRoutes = (app: Elysia) => {
    app.group("/brands", (app) =>
        app.get("/", BrandController.getAllBrands, { tags: ["Brands"] })
            .post("/", BrandController.createBrand, { tags: ["Brands"] })
            .get("/:id", BrandController.getBrandById, { tags: ["Brands"] })
            .put("/:id", BrandController.updateBrand, { tags: ["Brands"] })
            .delete("/:id", BrandController.deleteBrand, { tags: ["Brands"] })
    );
  return app;
};

export default BrandRoutes;