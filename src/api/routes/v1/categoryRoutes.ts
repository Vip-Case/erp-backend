import { Elysia } from 'elysia';
import CategoryController from '../../controllers/categoryController';

export const CategoryRoutes = (app: Elysia) => {
    app.group("/categories", (app) =>
        app.get("/", CategoryController.getAllCategories, { tags: ["Categories"] })
            .post("/", CategoryController.createCategory, { tags: ["Categories"] })
            .get("/:id", CategoryController.getCategoryById, { tags: ["Categories"] })
            .put("/:id", CategoryController.updateCategory, { tags: ["Categories"] })
            .delete("/:id", CategoryController.deleteCategory, { tags: ["Categories"] })
            .get("/filter", CategoryController.getCategoriesWithFilters, { tags: ["Categories"] })
            .get("/withParents", CategoryController.getAllCategoriesWithParentCategories, { tags: ["Categories"] })
    );
  return app;
};

export default CategoryRoutes;