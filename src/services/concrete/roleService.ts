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
  async createRole(data: {
    roleName: string;
    description: string;
    permissionIds?: string[];
  }): Promise<Role> {
    try {
      return await prisma.role.create({
        data: {
          roleName: data.roleName,
          description: data.description,
          ...(data.permissionIds && {
            permissions: {
              connect: data.permissionIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu rol adı zaten kullanılıyor.");
      }
      throw new Error("Rol oluşturulurken bir hata oluştu: " + error.message);
    }
  }

  // Rol güncelleme
  async updateRole(
    id: string,
    data: {
      roleName?: string;
      description?: string;
      permissionIds?: string[];
    }
  ): Promise<Role> {
    try {
      const updateData: any = {
        ...(data.roleName && { roleName: data.roleName }),
        ...(data.description && { description: data.description }),
      };

      if (data.permissionIds) {
        // Önce mevcut tüm izinleri kaldır
        await prisma.role.update({
          where: { id },
          data: {
            permissions: {
              set: [],
            },
          },
        });

        // Sonra yeni izinleri ekle
        updateData.permissions = {
          connect: data.permissionIds.map((id) => ({ id })),
        };
      }

      return await prisma.role.update({
        where: { id },
        data: updateData,
        include: {
          permissions: true,
          users: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu rol adı zaten kullanılıyor.");
      }
      throw new Error("Rol güncellenirken bir hata oluştu: " + error.message);
    }
  }

  // Diğer metodlar (silme, listeleme) önceki gibi
  async deleteRole(id: string): Promise<Role> {
    try {
      return await prisma.role.delete({
        where: { id },
        include: {
          permissions: true,
          users: true,
        },
      });
    } catch (error: any) {
      throw new Error("Rol silinirken bir hata oluştu: " + error.message);
    }
  }

  async getRoleById(id: string): Promise<Role | null> {
    return await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        users: true,
      },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return await prisma.role.findMany({
      include: {
        permissions: true,
        users: true,
      },
    });
  }

  async getRolesWithFilters(filter: any): Promise<Role[] | null> {
    try {
      return await this.roleRepository.findWithFilters(filter);
    } catch (error) {
      logger.error("Error fetching roles with filters", error);
      throw error;
    }
  }

  async addPermissionsToRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: permissionIds.map((id) => ({ id })),
          },
        },
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      throw new Error(
        "İzinler role eklenirken bir hata oluştu: " + error.message
      );
    }
  }

  async removePermissionsFromRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            disconnect: permissionIds.map((id) => ({ id })),
          },
        },
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      throw new Error(
        "İzinler rolden çıkarılırken bir hata oluştu: " + error.message
      );
    }
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      throw new Error("Rol bulunamadı");
    }

    return role.permissions;
  }

  async assignRoleToUsers(roleId: string, userIds: string[]): Promise<Role> {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          users: {
            connect: userIds.map((id) => ({ id })),
          },
        },
        include: {
          users: true,
          permissions: true,
        },
      });
    } catch (error: any) {
      throw new Error(
        "Rol kullanıcılara atanırken bir hata oluştu: " + error.message
      );
    }
  }

  async removeRoleFromUsers(roleId: string, userIds: string[]): Promise<Role> {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          users: {
            disconnect: userIds.map((id) => ({ id })),
          },
        },
        include: {
          users: true,
          permissions: true,
        },
      });
    } catch (error: any) {
      throw new Error(
        "Rol kullanıcılardan kaldırılırken bir hata oluştu: " + error.message
      );
    }
  }
}

export default RoleService;
