import { Context } from "elysia";
import { Context } from "elysia";
import PermissionService from "../../services/concrete/permissionService";

const permissionService = new PermissionService();

export const PermissionController = {
  // İzin İşlemleri
  getAllPermissions: async (ctx: Context) => {
    try {
      const permissions = await permissionService.getAllPermissions();
      return {
        success: true,
        data: permissions,
        message: "İzinler başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzinler getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getPermissionById: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const permission = await permissionService.getPermissionById(id);

      if (!permission) {
        ctx.set.status = 404;
        return {
          success: false,
          error: "İzin bulunamadı",
        };
      }

      return {
        success: true,
        data: permission,
        message: "İzin başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzin getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  createPermission: async (ctx: Context) => {
    try {
      const data = ctx.body as {
        permissionName: string;
        description: string;
        route?: string;
        groupId?: string;
      };

      const permission = await permissionService.createPermission(data);
      ctx.set.status = 201;
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin oluşturulurken bir hata oluştu",
        details: error.message,
      };
    }
  },
  // İzin İşlemleri
  getAllPermissions: async (ctx: Context) => {
    try {
      const permissions = await permissionService.getAllPermissions();
      return {
        success: true,
        data: permissions,
        message: "İzinler başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzinler getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getPermissionById: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const permission = await permissionService.getPermissionById(id);

      if (!permission) {
        ctx.set.status = 404;
        return {
          success: false,
          error: "İzin bulunamadı",
        };
      }

      return {
        success: true,
        data: permission,
        message: "İzin başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzin getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  createPermission: async (ctx: Context) => {
    try {
      const data = ctx.body as {
        permissionName: string;
        description: string;
        route?: string;
        groupId?: string;
      };

      const permission = await permissionService.createPermission(data);
      ctx.set.status = 201;
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin oluşturulurken bir hata oluştu",
        details: error.message,
      };
    }
  },

  updatePermission: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const data = ctx.body as {
        permissionName?: string;
        description?: string;
        route?: string;
        groupId?: string;
      };

      const permission = await permissionService.updatePermission(id, data);
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla güncellendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin güncellenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  deletePermission: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const permission = await permissionService.deletePermission(id);
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla silindi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin silinirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // İzin Grubu İşlemleri
  getAllPermissionGroups: async (ctx: Context) => {
    try {
      const groups = await permissionService.getAllPermissionGroups();
      return {
        success: true,
        data: groups,
        message: "İzin grupları başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzin grupları getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  createPermissionGroup: async (ctx: Context) => {
    try {
      const data = ctx.body as {
        groupName: string;
        description?: string;
      };

      const group = await permissionService.createPermissionGroup(data);
      ctx.set.status = 201;
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu oluşturulurken bir hata oluştu",
        details: error.message,
      };
    }
  },

  updatePermissionGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const data = ctx.body as {
        groupName?: string;
        description?: string;
      };

      const group = await permissionService.updatePermissionGroup(id, data);
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla güncellendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu güncellenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  deletePermissionGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const group = await permissionService.deletePermissionGroup(id);
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla silindi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu silinirken bir hata oluştu",
        details: error.message,
      };
    }
  },
  updatePermission: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const data = ctx.body as {
        permissionName?: string;
        description?: string;
        route?: string;
        groupId?: string;
      };

      const permission = await permissionService.updatePermission(id, data);
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla güncellendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin güncellenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  deletePermission: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const permission = await permissionService.deletePermission(id);
      return {
        success: true,
        data: permission,
        message: "İzin başarıyla silindi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin silinirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // İzin Grubu İşlemleri
  getAllPermissionGroups: async (ctx: Context) => {
    try {
      const groups = await permissionService.getAllPermissionGroups();
      return {
        success: true,
        data: groups,
        message: "İzin grupları başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "İzin grupları getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  createPermissionGroup: async (ctx: Context) => {
    try {
      const data = ctx.body as {
        groupName: string;
        description?: string;
      };

      const group = await permissionService.createPermissionGroup(data);
      ctx.set.status = 201;
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu oluşturulurken bir hata oluştu",
        details: error.message,
      };
    }
  },

  updatePermissionGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const data = ctx.body as {
        groupName?: string;
        description?: string;
      };

      const group = await permissionService.updatePermissionGroup(id, data);
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla güncellendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu güncellenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  deletePermissionGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const group = await permissionService.deletePermissionGroup(id);
      return {
        success: true,
        data: group,
        message: "İzin grubu başarıyla silindi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzin grubu silinirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // İzin-Grup İlişki İşlemleri
  addPermissionsToGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const group = await permissionService.addPermissionsToGroup(
        id,
        permissionIds
      );
      return {
        success: true,
        data: group,
        message: "İzinler gruba başarıyla eklendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler gruba eklenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  removePermissionsFromGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const group = await permissionService.removePermissionsFromGroup(
        id,
        permissionIds
      );
      return {
        success: true,
        data: group,
        message: "İzinler gruptan başarıyla çıkarıldı",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler gruptan çıkarılırken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // Kullanıcı İzinleri İşlemleri
  getUserPermissions: async (ctx: Context) => {
    try {
      const { username } = ctx.params;
      const permissions = await permissionService.getUserPermissions(username);
      return {
        success: true,
        data: permissions,
        message: "Kullanıcı izinleri başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = error.message === "Kullanıcı bulunamadı" ? 404 : 500;
      return {
        success: false,
        error: "Kullanıcı izinleri getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getPermissionsByRoleName: async (ctx: Context) => {
    try {
      const { roleName } = ctx.params;
      const permissions = await permissionService.getPermissionsByRoleName(
        roleName
      );
      return {
        success: true,
        data: permissions,
        message: "Rol izinleri başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status =
        error.message === "Belirtilen rol bulunamadı" ? 404 : 500;
      return {
        success: false,
        error: "Rol izinleri getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },
  // İzin-Grup İlişki İşlemleri
  addPermissionsToGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const group = await permissionService.addPermissionsToGroup(
        id,
        permissionIds
      );
      return {
        success: true,
        data: group,
        message: "İzinler gruba başarıyla eklendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler gruba eklenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  removePermissionsFromGroup: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const group = await permissionService.removePermissionsFromGroup(
        id,
        permissionIds
      );
      return {
        success: true,
        data: group,
        message: "İzinler gruptan başarıyla çıkarıldı",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler gruptan çıkarılırken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // Kullanıcı İzinleri İşlemleri
  getUserPermissions: async (ctx: Context) => {
    try {
      const { username } = ctx.params;
      const permissions = await permissionService.getUserPermissions(username);
      return {
        success: true,
        data: permissions,
        message: "Kullanıcı izinleri başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = error.message === "Kullanıcı bulunamadı" ? 404 : 500;
      return {
        success: false,
        error: "Kullanıcı izinleri getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getPermissionsByRoleName: async (ctx: Context) => {
    try {
      const { roleName } = ctx.params;
      const permissions = await permissionService.getPermissionsByRoleName(
        roleName
      );
      return {
        success: true,
        data: permissions,
        message: "Rol izinleri başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status =
        error.message === "Belirtilen rol bulunamadı" ? 404 : 500;
      return {
        success: false,
        error: "Rol izinleri getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },
};

export default PermissionController;
