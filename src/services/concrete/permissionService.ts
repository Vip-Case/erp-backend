import prisma from "../../config/prisma";
import { Permission, PermissionGroup } from "@prisma/client";
import { extractUsernameFromToken } from "./extractUsernameService";

export class PermissionService {
  async getAllPermissions(): Promise<Permission[]> {
    return await prisma.permission.findMany({
      include: {
        group: true,
        roles: true,
        users: true,
      },
    });
  }

  async getPermissionById(id: string): Promise<Permission | null> {
    return await prisma.permission.findUnique({
      where: { id },
      include: {
        group: true,
        roles: true,
        users: true,
      },
    });
  }

  async createPermission(data: {
    permissionName: string;
    description: string;
    route?: string;
    groupId?: string;
  }): Promise<Permission> {
    try {
      return await prisma.permission.create({
        data: {
          permissionName: data.permissionName,
          description: data.description,
          route: data.route,
          groupId: data.groupId,
        },
        include: {
          group: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu izin adı veya rota zaten kullanılıyor.");
      }
      throw new Error("İzin oluşturulurken bir hata oluştu: " + error.message);
    }
  }

  async updatePermission(
    id: string,
    data: {
      permissionName?: string;
      description?: string;
      route?: string;
      groupId?: string;
    }
  ): Promise<Permission> {
    try {
      return await prisma.permission.update({
        where: { id },
        data,
        include: {
          group: true,
          roles: true,
          users: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu izin adı veya rota zaten kullanılıyor.");
      }
      throw new Error("İzin güncellenirken bir hata oluştu: " + error.message);
    }
  }

  async deletePermission(id: string): Promise<Permission> {
    try {
      return await prisma.permission.delete({
        where: { id },
        include: {
          group: true,
          roles: true,
          users: true,
        },
      });
    } catch (error: any) {
      throw new Error("İzin silinirken bir hata oluştu: " + error.message);
    }
  }

  // İzin Grubu İşlemleri
  async getAllPermissionGroups(): Promise<PermissionGroup[]> {
    return await prisma.permissionGroup.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async createPermissionGroup(data: {
    groupName: string;
    description?: string;
  }): Promise<PermissionGroup> {
    try {
      return await prisma.permissionGroup.create({
        data,
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu grup adı zaten kullanılıyor.");
      }
      throw new Error(
        "İzin grubu oluşturulurken bir hata oluştu: " + error.message
      );
    }
  }

  async updatePermissionGroup(
    id: string,
    data: {
      groupName?: string;
      description?: string;
    }
  ): Promise<PermissionGroup> {
    try {
      return await prisma.permissionGroup.update({
        where: { id },
        data,
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Bu grup adı zaten kullanılıyor.");
      }
      throw new Error(
        "İzin grubu güncellenirken bir hata oluştu: " + error.message
      );
    }
  }

  async deletePermissionGroup(id: string): Promise<PermissionGroup> {
    try {
      return await prisma.permissionGroup.delete({
        where: { id },
        include: {
          permissions: true,
        },
      });
    } catch (error: any) {
      throw new Error(
        "İzin grubu silinirken bir hata oluştu: " + error.message
      );
    }
  }

  // İzin-Grup İlişki İşlemleri
  async addPermissionsToGroup(
    id: string,
    permissionIds: string[]
  ): Promise<PermissionGroup> {
    try {
      return await prisma.permissionGroup.update({
        where: { id },
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
        "İzinler gruba eklenirken bir hata oluştu: " + error.message
      );
    }
  }

  async removePermissionsFromGroup(
    id: string,
    permissionIds: string[]
  ): Promise<PermissionGroup> {
    try {
      return await prisma.permissionGroup.update({
        where: { id },
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
        "İzinler gruptan çıkarılırken bir hata oluştu: " + error.message
      );
    }
  }

  // Rota İzinleri İşlemleri
  async syncRoutePermissions(routes: string[]): Promise<void> {
    try {
      for (const route of routes) {
        const permissionName = route.replace(/\//g, "_").substring(1);
        await prisma.permission.upsert({
          where: { permissionName },
          update: {},
          create: {
            permissionName,
            description: `Permission for ${route}`,
            route,
          },
        });
      }
    } catch (error: any) {
      throw new Error(
        "Rota izinleri senkronize edilirken bir hata oluştu: " + error.message
      );
    }
  }

  // Kullanıcı İzinleri İşlemleri
  async getUserPermissions(username: string): Promise<Permission[]> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        permission: true,
      },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Rol ve direkt izinleri birleştir
    const rolePermissions = user.role.flatMap((role) => role.permissions);
    const directPermissions = user.permission;

    // Tekrar eden izinleri kaldır
    const allPermissions = [...rolePermissions, ...directPermissions];
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id)
    );

    return uniquePermissions;
  }

  async getPermissionsByRoleName(roleName: string): Promise<string[]> {
    try {
      const role = await prisma.role.findUnique({
        where: { roleName },
        include: {
          permissions: true,
        },
      });

      if (!role) {
        throw new Error("Belirtilen rol bulunamadı");
      }

      return role.permissions.map((permission) => permission.permissionName);
    } catch (error: any) {
      throw new Error(
        "Rol izinleri getirilirken bir hata oluştu: " + error.message
      );
    }
  }
}

export default PermissionService;