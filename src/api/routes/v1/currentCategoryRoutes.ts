import { Elysia } from 'elysia';
import CurrentCategoryController from '../../controllers/currentCategoryController';

export const CurrentCategoryRoutes = (app: Elysia) => {
    app.group("/currentCategories", (app) =>
        app.get("/", CurrentCategoryController.getAllCategories, { tags: ["Current Categories"] })
            .post("/", CurrentCategoryController.createCategory, { tags: ["Current Categories"] })
            .get("/:id", CurrentCategoryController.getCategoryById, { tags: ["Current Categories"] })
            .put("/:id", CurrentCategoryController.updateCategory, { tags: ["Current Categories"] })
            .delete("/:id", CurrentCategoryController.deleteCategory, { tags: ["Current Categories"] })
            .get("/filter", CurrentCategoryController.getCategoriesWithFilters, { tags: ["Current Categories"] })
            .get("/withParents", CurrentCategoryController.getAllCategoriesWithParentCategories, { tags: ["Current Categories"] })
    );
};

export default CurrentCategoryRoutes;