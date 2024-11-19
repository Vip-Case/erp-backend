
import CurrentCategoryService from '../../services/concrete/currentCategory';
import { Context } from 'elysia';
import { CurrentCategory } from '@prisma/client';

// Service Initialization
const categoryService = new CurrentCategoryService();

export const CurrentCategoryController = {

    createCategory: async (ctx: Context) => {
        const categoryData: CurrentCategory = ctx.body as CurrentCategory;
        try {
            const category = await categoryService.createCategory(categoryData);
            ctx.set.status = 200;
            return category;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating category", details: error.message };
        }
    },

    updateCategory: async (ctx: Context) => {
        const { id } = ctx.params;
        const categoryData: Partial<CurrentCategory> = ctx.body as Partial<CurrentCategory>;
        try {
            const category = await categoryService.updateCategory(id, categoryData);
            ctx.set.status = 200;
            return category;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating category", details: error.message };
        }
    },

    deleteCategory: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const category = await categoryService.deleteCategory(id);
            ctx.set.status = 200;
            return category;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting category", details: error.message };
        }
    },

    getCategoryById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                return ctx.error(404, 'Category not found');
            }
            ctx.set.status = 200;
            return category;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching category", details: error.message };
        }
    },

    getAllCategories: async (ctx: Context) => {
        try {
            const categories = await categoryService.getAllCategories();
            ctx.set.status = 200;
            return categories;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching categories", details: error.message };
        }
    },

    getCategoriesWithFilters: async (ctx: Context) => {
        const filter = ctx.query;
        try {
            const categories = await categoryService.getCategoriesWithFilters(filter);
            ctx.set.status = 200;
            return categories;
        }
        catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching categories with filters", details: error.message };
        }
    },

    getAllCategoriesWithParentCategories: async (ctx: Context) => {
        try {
            const categories = await categoryService.getAllCategoriesWithParentCategories();
            ctx.set.status = 200;
            return categories;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching categories", details: error.message };
        }
    }
}

export default CurrentCategoryController;