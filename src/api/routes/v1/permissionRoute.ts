import { Elysia } from "elysia";
import { PermissionController } from "../../controllers/permissionController";

export const PermissionRoutes = (app: Elysia) => {
  return app.group("/permissions", (app) =>
    app
      // İzin İşlemleri
      .get("/", PermissionController.getAllPermissions, {
        detail: {
          summary: "Tüm İzinleri Getir",
          tags: ["Permissions"],
        },
      })
      .get("/:id", PermissionController.getPermissionById, {
        detail: {
          summary: "İzin Detayını Getir",
          tags: ["Permissions"],
        },
      })
      .post("/", PermissionController.createPermission, {
        detail: {
          summary: "Yeni İzin Oluştur",
          tags: ["Permissions"],
        },
      })
      .put("/:id", PermissionController.updatePermission, {
        detail: {
          summary: "İzin Güncelle",
          tags: ["Permissions"],
        },
      })
      .delete("/:id", PermissionController.deletePermission, {
        detail: {
          summary: "İzin Sil",
          tags: ["Permissions"],
        },
      })

      // İzin Grubu İşlemleri
      .get("/groups", PermissionController.getAllPermissionGroups, {
        detail: {
          summary: "Tüm İzin Gruplarını Getir",
          tags: ["Permission Groups"],
        },
      })
      .post("/groups", PermissionController.createPermissionGroup, {
        detail: {
          summary: "Yeni İzin Grubu Oluştur",
          tags: ["Permission Groups"],
        },
      })
      .put("/groups/:id", PermissionController.updatePermissionGroup, {
        detail: {
          summary: "İzin Grubu Güncelle",
          tags: ["Permission Groups"],
        },
      })
      .delete("/groups/:id", PermissionController.deletePermissionGroup, {
        detail: {
          summary: "İzin Grubu Sil",
          tags: ["Permission Groups"],
        },
      })

      // İzin-Grup İlişki İşlemleri
      .post(
        "/groups/:id/permissions",
        PermissionController.addPermissionsToGroup,
        {
          detail: {
            summary: "Gruba İzin Ekle",
            tags: ["Permission Groups"],
          },
        }
      )
      .delete(
        "/groups/:id/permissions",
        PermissionController.removePermissionsFromGroup,
        {
          detail: {
            summary: "Gruptan İzin Çıkar",
            tags: ["Permission Groups"],
          },
        }
      )

      // Kullanıcı İzinleri İşlemleri
      .get("/users/:username", PermissionController.getUserPermissions, {
        detail: {
          summary: "Kullanıcı İzinlerini Getir",
          tags: ["User Permissions"],
        },
      })
      .get("/roles/:roleName", PermissionController.getPermissionsByRoleName, {
        detail: {
          summary: "Role Ait İzinleri Getir",
          tags: ["Role Permissions"],
        },
      })
  );
};

export default PermissionRoutes;