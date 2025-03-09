import prisma from "../../config/prisma";
import { Role, Permission } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { extractUsernameFromToken } from "./extractUsernameService";

export class RoleService {
    private roleRepository: BaseRepository<Role>;

    constructor() {
        this.roleRepository = new BaseRepository<Role>(prisma.role);
    }

    // Rol oluşturma (izinlerle birlikte)
    async createRole(role: Role, permissionIds: string[], bearerToken: string): Promise<Role> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.role.create({
                data: {
                    ...role,
                    createdBy: username,
                    updatedBy: username,
                    permissions: {
                        connect: permissionIds.map((id) => ({ id })),
                    },
                },
                include: { 
                    permissions: true,
                    createdByUser: true,
                    updatedByUser: true 
                },
            });
        } catch (error) {
            logger.error("Error creating role", error);
            throw error;
        }
    }

    // Rol güncelleme
    async updateRole(id: string, roleData: Partial<Role>, bearerToken: string, permissionIds?: string[]): Promise<Role> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.role.update({
                where: { id },
                data: {
                    ...roleData,
                    updatedBy: username,
                    ...(permissionIds && {
                        permissions: {
                            set: permissionIds.map((id) => ({ id })), // Eski izinleri temizler, yenileri ekler
                        },
                    }),
                },
                include: { 
                    permissions: true,
                    createdByUser: true,
                    updatedByUser: true 
                },
            });
        } catch (error) {
            logger.error(`Error updating role with id ${id}`, error);
            throw error;
        }
    }

    // Diğer metodlar (silme, listeleme) önceki gibi
    async deleteRole(id: string): Promise<boolean> {
        try {
            await this.roleRepository.delete(id);
            return true;
        } catch (error) {
            logger.error(`Error deleting role with id ${id}`, error);
            throw error;
        }
    }

    async getRoleById(id: string): Promise<Role | null> {
        try {
            return await prisma.role.findUnique({
                where: { id },
                include: { 
                    permissions: true,
                    createdByUser: true,
                    updatedByUser: true 
                },
            });
        } catch (error) {
            logger.error(`Error fetching role with id ${id}`, error);
            throw error;
        }
    }

    async getAllRoles(): Promise<Role[]> {
        try {
            return await prisma.role.findMany({ 
                include: { 
                    permissions: true,
                    createdByUser: true,
                    updatedByUser: true 
                } 
            });
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
