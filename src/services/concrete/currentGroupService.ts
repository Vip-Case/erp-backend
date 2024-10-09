
import prisma from "../../config/prisma";
import { CurrentReportGroup } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class CurrentGroupService {
    private currentGroupRepository: BaseRepository<CurrentReportGroup>;

    constructor() {
        this.currentGroupRepository = new BaseRepository<CurrentReportGroup>(prisma.currentReportGroup);
    }

    async createCurrentGroup(currentGroup: CurrentReportGroup): Promise<CurrentReportGroup> {
        try {
            return await this.currentGroupRepository.create(currentGroup);
        } catch (error) {
            logger.error("Error creating current group", error);
            throw error;
        }
    }

    async updateCurrentGroup(id: string, currentGroup: Partial<CurrentReportGroup>): Promise<CurrentReportGroup> {
        try {
            return await this.currentGroupRepository.update(id, currentGroup);
        } catch (error) {
            logger.error(`Error updating current group with id ${id}`, error);
            throw error;
        }
    }

    async deleteCurrentGroup(id: string): Promise<boolean> {
        try {
            return await this.currentGroupRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting current group with id ${id}`, error);
            throw error;
        }
    }

    async getCurrentGroupById(id: string): Promise<CurrentReportGroup | null> {
        try {
            return await this.currentGroupRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching current group with id ${id}`, error);
            throw error;
        }
    }

    async getAllCurrentGroups(): Promise<CurrentReportGroup[]> {
        try {
            return await this.currentGroupRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all current groups", error);
            throw error;
        }
    }

    async getCurrentGroupsWithFilters(filter: any): Promise<CurrentReportGroup[] | null> {
        try {
            return await this.currentGroupRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching current groups with filters", error);
            throw error;
        }
    }
}

export default CurrentGroupService;