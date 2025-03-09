import { Elysia } from "elysia";
import { RoleController } from "../../controllers/roleController";

export const RoleRoutes = (app: Elysia) => {
  return app.group("/roles", (app) =>
    app
      // Rol İşlemleri
      .get("/", RoleController.getAllRoles, {
        detail: {
          summary: "Tüm Rolleri Getir",
          tags: ["Roles"],
        },
      })
      .get("/:id", RoleController.getRoleById, {
        detail: {
          summary: "Rol Detayını Getir",
          tags: ["Roles"],
        },
      })
      .post("/", RoleController.createRole, {
        detail: {
          summary: "Yeni Rol Oluştur",
          tags: ["Roles"],
        },
      })
      .put("/:id", RoleController.updateRole, {
        detail: {
          summary: "Rol Güncelle",
          tags: ["Roles"],
        },
      })
      .delete("/:id", RoleController.deleteRole, {
        detail: {
          summary: "Rol Sil",
          tags: ["Roles"],
        },
      })

      // Rol-İzin İlişki İşlemleri
      .post("/:id/permissions", RoleController.addPermissionsToRole, {
        detail: {
          summary: "Role İzin Ekle",
          tags: ["Role Permissions"],
        },
      })
      .delete("/:id/permissions", RoleController.removePermissionsFromRole, {
        detail: {
          summary: "Rolden İzin Çıkar",
          tags: ["Role Permissions"],
        },
      })
      .get("/:id/permissions", RoleController.getRolePermissions, {
        detail: {
          summary: "Rol İzinlerini Getir",
          tags: ["Role Permissions"],
        },
      })

      // Rol-Kullanıcı İlişki İşlemleri
      .post("/:id/users", RoleController.assignRoleToUsers, {
        detail: {
          summary: "Kullanıcılara Rol Ata",
          tags: ["Role Users"],
        },
      })
      .delete("/:id/users", RoleController.removeRoleFromUsers, {
        detail: {
          summary: "Kullanıcılardan Rol Kaldır",
          tags: ["Role Users"],
        },
      })
  );
};

export default RoleRoutes;
