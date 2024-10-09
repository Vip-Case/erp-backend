
import prisma from "../../config/prisma";
import { Role } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class RoleService {
    private roleRepository: BaseRepository<Role>;

    constructor() {
        this.roleRepository = new BaseRepository<Role>(prisma.role);
    }

    async createRole(role: Role): Promise<Role> {
        try {
            return await this.roleRepository.create(role);
        } catch (error) {
            logger.error("Error creating role", error);
            throw error;
        }
    }

    async updateRole(id: string, role: Partial<Role>): Promise<Role> {
        try {
            return await this.roleRepository.update(id, role);
        } catch (error) {
            logger.error(`Error updating role with id ${id}`, error);
            throw error;
        }
    }

    async deleteRole(id: string): Promise<boolean> {
        try {
            return await this.roleRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting role with id ${id}`, error);
            throw error;
        }
    }

    async getRoleById(id: string): Promise<Role | null> {
        try {
            return await this.roleRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching role with id ${id}`, error);
            throw error;
        }
    }

    async getAllRoles(): Promise<Role[]> {
        try {
            return await this.roleRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all roles", error);
            throw error;
        }
    }

    async getRolesWithFilters(filter: any): Promise<Role[] | null> {
        try {
            return await this.roleRepository.findWithFilters(filter);
        } catch (error) {
            logger.error("Error fetching roles with filters", error);
            throw error;
        }
    }
}

export default RoleService;