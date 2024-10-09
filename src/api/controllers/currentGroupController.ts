
import CurrentGroupService from '../../services/concrete/currentGroupService';
import { Context } from 'elysia';
import { CurrentReportGroup } from '@prisma/client';

// Service Initialization
const currentGroupService = new CurrentGroupService();

export const CurrentGroupController = {

    createCurrentGroup: async (ctx: Context) => {
        const currentGroupData: CurrentReportGroup = ctx.body as CurrentReportGroup;
        try {
            const currentGroup = await currentGroupService.createCurrentGroup(currentGroupData);
            ctx.set.status = 200;
            return currentGroup;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error creating currentGroup", details: error.message };
        }
    },

    updateCurrentGroup: async (ctx: Context) => {
        const { id } = ctx.params;
        const currentGroupData: Partial<CurrentReportGroup> = ctx.body as Partial<CurrentReportGroup>;
        try {
            const currentGroup = await currentGroupService.updateCurrentGroup(id, currentGroupData);
            ctx.set.status = 200;
            return currentGroup;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error updating currentGroup", details: error.message };
        }
    },

    deleteCurrentGroup: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const currentGroup = await currentGroupService.deleteCurrentGroup(id);
            ctx.set.status = 200;
            return currentGroup;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error deleting currentGroup", details: error.message };
        }
    },

    getCurrentGroupById: async (ctx: Context) => {
        const { id } = ctx.params;
        try {
            const currentGroup = await currentGroupService.getCurrentGroupById(id);
            if (!currentGroup) {
                return ctx.error(404, 'CurrentGroup not found');
            }
            ctx.set.status = 200;
            return currentGroup;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentGroup", details: error.message };
        }
    },

    getAllCurrentGroups: async (ctx: Context) => {
        try {
            const currentGroups = await currentGroupService.getAllCurrentGroups();
            if (!currentGroups) {
                return ctx.error(404, 'CurrentGroups not found');
            }
            ctx.set.status = 200;
            return currentGroups;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentGroups", details: error.message };
        }
    },

    getCurrentGroupsWithFilters: async (ctx: Context) => {
        const { filters } = ctx.params;
        try {
            const currentGroups = await currentGroupService.getCurrentGroupsWithFilters(filters);
            if (!currentGroups) {
                return ctx.error(404, 'CurrentGroups not found');
            }
            ctx.set.status = 200;
            return currentGroups;
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Error fetching currentGroups", details: error.message };
        }
    }
}

export default CurrentGroupController;