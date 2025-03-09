import { Context } from "elysia";
import RoleService from "../../services/concrete/roleService";

const roleService = new RoleService();

export const RoleController = {
  // Rol İşlemleri
  getAllRoles: async (ctx: Context) => {
    try {
      const roles = await roleService.getAllRoles();
      return {
        success: true,
        data: roles,
        message: "Roller başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "Roller getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getRoleById: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const role = await roleService.getRoleById(id);

      if (!role) {
        ctx.set.status = 404;
        return {
          success: false,
          error: "Rol bulunamadı",
        };
      }

      return {
        success: true,
        data: role,
        message: "Rol başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = 500;
      return {
        success: false,
        error: "Rol getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  createRole: async (ctx: Context) => {
    try {
      const data = ctx.body as {
        roleName: string;
        description: string;
        permissionIds?: string[];
      };

      const role = await roleService.createRole(data);
      ctx.set.status = 201;
      return {
        success: true,
        data: role,
        message: "Rol başarıyla oluşturuldu",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "Rol oluşturulurken bir hata oluştu",
        details: error.message,
      };
    }
  },

  updateRole: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const data = ctx.body as {
        roleName?: string;
        description?: string;
        permissionIds?: string[];
      };

      const role = await roleService.updateRole(id, data);
      return {
        success: true,
        data: role,
        message: "Rol başarıyla güncellendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "Rol güncellenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  deleteRole: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const role = await roleService.deleteRole(id);
      return {
        success: true,
        data: role,
        message: "Rol başarıyla silindi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "Rol silinirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // Rol-İzin İlişki İşlemleri
  addPermissionsToRole: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const role = await roleService.addPermissionsToRole(id, permissionIds);
      return {
        success: true,
        data: role,
        message: "İzinler role başarıyla eklendi",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler role eklenirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  removePermissionsFromRole: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { permissionIds } = ctx.body as { permissionIds: string[] };

      const role = await roleService.removePermissionsFromRole(
        id,
        permissionIds
      );
      return {
        success: true,
        data: role,
        message: "İzinler rolden başarıyla çıkarıldı",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "İzinler rolden çıkarılırken bir hata oluştu",
        details: error.message,
      };
    }
  },

  getRolePermissions: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const permissions = await roleService.getRolePermissions(id);
      return {
        success: true,
        data: permissions,
        message: "Rol izinleri başarıyla getirildi",
      };
    } catch (error: any) {
      ctx.set.status = error.message === "Rol bulunamadı" ? 404 : 500;
      return {
        success: false,
        error: "Rol izinleri getirilirken bir hata oluştu",
        details: error.message,
      };
    }
  },

  // Rol-Kullanıcı İlişki İşlemleri
  assignRoleToUsers: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { userIds } = ctx.body as { userIds: string[] };

      const role = await roleService.assignRoleToUsers(id, userIds);
      return {
        success: true,
        data: role,
        message: "Rol kullanıcılara başarıyla atandı",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "Rol kullanıcılara atanırken bir hata oluştu",
        details: error.message,
      };
    }
  },

  removeRoleFromUsers: async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const { userIds } = ctx.body as { userIds: string[] };

      const role = await roleService.removeRoleFromUsers(id, userIds);
      return {
        success: true,
        data: role,
        message: "Rol kullanıcılardan başarıyla kaldırıldı",
      };
    } catch (error: any) {
      ctx.set.status = 400;
      return {
        success: false,
        error: "Rol kullanıcılardan kaldırılırken bir hata oluştu",
        details: error.message,
      };
    }
  },
};

export default RoleController;
