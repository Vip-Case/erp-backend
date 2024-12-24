import CurrentService from '../../services/concrete/currentService';
import { Context } from 'elysia';
import { $Enums, CurrentAddress, CurrentBranch, CurrentCategoryItem, CurrentFinancial, CurrentOfficials, CurrentRisk, Prisma } from '@prisma/client';

// Service Initialization
const currentService = new CurrentService();

interface SearchCriteria {
    search: string;
}

interface CurrentCreateInput {
    id?: string
    currentCode: string
    currentName: string
    currentType?: $Enums.CurrentType
    institution?: $Enums.InstitutionType
    identityNo?: string | null
    taxNumber?: string | null
    taxOffice?: string | null
    title?: string | null
    name?: string | null
    surname?: string | null
    webSite?: string | null
    birthOfDate?: Date | string | null
    kepAddress?: string | null
    mersisNo?: string | null
    sicilNo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
    priceListId: string
}

export const CurrentController = {

    createCurrent: async (ctx: Context) => {
        const data = ctx.body as {
            current: CurrentCreateInput;
            currentAddress?: Prisma.CurrentAddressCreateNestedManyWithoutCurrentInput;
            currentBranch?: Prisma.CurrentBranchCreateNestedManyWithoutCurrentInput;
            currentCategoryItem?: Prisma.CurrentCategoryItemCreateNestedManyWithoutCurrentInput;
            currentFinancial?: Prisma.CurrentFinancialCreateNestedManyWithoutCurrentInput;
            currentRisk?: Prisma.CurrentRiskCreateNestedManyWithoutCurrentInput;
            currentOfficials?: Prisma.CurrentOfficialsCreateNestedManyWithoutCurrentInput;
        };

        try {
            const createData = {
                current: {
                    ...data.current,
                    priceListId: data.current.priceListId
                },
                currentAddress: data.currentAddress,
                currentBranch: data.currentBranch,
                currentCategoryItem: data.currentCategoryItem,
                currentFinancial: data.currentFinancial,
                currentRisk: data.currentRisk,
                currentOfficials: data.currentOfficials,
            };
            const newCurrent = await currentService.createCurrent(createData);
            ctx.set.status = 200;
            return newCurrent;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating current", details: error.message };
        }
    },

    updateCurrent: async (ctx: Context) => {
        const { id } = ctx.params;
        const data = ctx.body as {
            current: CurrentCreateInput;
            currentAddress?: Prisma.CurrentAddressCreateNestedManyWithoutCurrentInput;
            currentBranch?: Prisma.CurrentBranchCreateNestedManyWithoutCurrentInput;
            currentCategoryItem?: Prisma.CurrentCategoryItemCreateNestedManyWithoutCurrentInput;
            currentFinancial?: Prisma.CurrentFinancialCreateNestedManyWithoutCurrentInput;
            currentRisk?: Prisma.CurrentRiskCreateNestedManyWithoutCurrentInput;
            currentOfficials?: Prisma.CurrentOfficialsCreateNestedManyWithoutCurrentInput;
        };

        try {
            const updateData = {
                current: {
                    ...data.current,
                    priceListId: data.current.priceListId
                },
                currentAddress: data.currentAddress,
                currentBranch: data.currentBranch,
                currentCategoryItem: data.currentCategoryItem,
                currentFinancial: data.currentFinancial,
                currentRisk: data.currentRisk,
                currentOfficials: data.currentOfficials,
            };

            const updatedCurrent = await currentService.updateCurrent(id, updateData);
            ctx.set.status = 200;
            return updatedCurrent;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating current", details: error };
        }

    },

    deleteCurrent: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const deleted = await currentService.deleteCurrentWithRelations(id);
            ctx.set.status = 200;
            return { success: deleted, message: "true" };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting current", details: error.message };
        }
    },

    getCurrentById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const current = await currentService.getCurrentById(id);
            if (!current) {
                return ctx.error(404, 'Current not found');
            }
            ctx.set.status = 200;
            return current;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching current", details: error.message };
        }
    },

    getAllCurrents: async (ctx: Context) => {
        try {
            const currents = await currentService.getAllCurrents();
            ctx.set.status = 200;
            return currents;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currents", details: error.message };
        }
    },

    getCurrentsWithFilters: async (ctx: Context) => {
        const filters = ctx.query as Partial<Prisma.CurrentWhereInput>;

        try {
            const currents = await currentService.getCurrentsWithFilters(filters);
            ctx.set.status = 200;
            return currents;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currents", details: error.message };
        }
    },

    searchCurrents: async (ctx: Context) => {
        const criteria = ctx.query as unknown as SearchCriteria;
        try {
            const currents = await currentService.searchCurrents(criteria);
            ctx.set.status = 200;
            return currents;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching stock cards", details: error.message };
        }
    },

    createWithRelations: async (ctx: Context) => {
        const data = ctx.body as any;
        console.log(data);
        try {
            const newCurrent = await currentService.createCurrentWithRelations(data);
            ctx.set.status = 200;
            return newCurrent;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating current", details: error.message };
        }
    },

    deleteManyCurrentsWithRelations: async (ctx: Context) => {
        const data = ctx.body;
        try {
            const deleted = await currentService.deleteManyCurrentsWithRelations(data);
            ctx.set.status = 200;
            return { success: deleted, message: "true" };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting current", details: error.message };
        }
    }
}

export default CurrentController;
