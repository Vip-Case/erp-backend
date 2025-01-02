import { BrandService } from '../../services/concrete/brandService'; '../../services/concrete/brandService';
import { Context } from 'elysia';
import { Brand } from '@prisma/client';

const brandService = new BrandService();

export const BrandController = {

    createBrand: async (ctx: Context) => {
        const brandData: Brand = ctx.body as Brand;
        const bearerToken = ctx.request.headers.get("Authorization");
        
        if (!bearerToken) {
            return ctx.error(401, "Authorization header is missing.");
        }
        
        try {
            const brand = await brandService.createBrand(brandData, bearerToken);
            ctx.set.status = 200;
            return brand;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating brand", details: error.message };
        }
    },

    updateBrand: async (ctx: Context) => {
        const { id } = ctx.params;
        const brandData: Partial<Brand> = ctx.body as Partial<Brand>;
        try {
            const brand = await brandService.updateBrand(id, brandData);
            ctx.set.status = 200;
            return brand;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating brand", details: error.message };
        }
    },

    deleteBrand: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const brand = await brandService.deleteBrand(id);
            ctx.set.status = 200;
            return brand;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting brand", details: error.message };
        }
    },

    getBrandById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const brand = await brandService.getBrandById(id);
            if (!brand) {
                return ctx.error(404, 'Brand not found');
            }
            ctx.set.status = 200;
            return brand;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching brand", details: error.message };
        }
    },

    getAllBrands: async (ctx: Context) => {
        try {
            const brands = await brandService.getAllBrands();
            ctx.set.status = 200;
            return brands;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching brands", details: error.message };
        }
    },

    getBrandsWithFilters: async (ctx: Context) => {
        const filter = ctx.query;
        try {
            const brands = await brandService.getBrandsWithFilters(filter);
            ctx.set.status = 200;
            return brands;
        }
        catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching brands with filters", details: error.message };
        }
    }
}

export default BrandController;