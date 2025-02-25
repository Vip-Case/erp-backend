import { Elysia } from "elysia";
import {
  register,
  login,
  me,
  refreshToken,
  logout,
  getActiveSessions,
  logoutOtherSessions,
  changePassword,
  adminChangeUserPassword,
} from "../../controllers/authController";

export const authRoutes = (app: Elysia) => {
  return app.group("/auth", (app) =>
    app
      .post("/register", register, {
        detail: {
          summary: "Yeni Kullanıcı Kaydı",
          tags: ["Auth"],
          description:
            "Yalnızca admin kullanıcılar yeni kullanıcı oluşturabilir",
        },
      })
      .post("/login", login, {
        detail: {
          summary: "Kullanıcı Girişi",
          tags: ["Auth"],
          description: "Kullanıcı girişi ve oturum başlatma",
        },
      })
      .get("/me", me, {
        detail: {
          summary: "Mevcut Kullanıcı Bilgileri",
          tags: ["Auth"],
          description: "Aktif oturumdaki kullanıcının bilgilerini getirir",
        },
      })
      .post("/refresh-token", refreshToken, {
        detail: {
          summary: "Access Token Yenileme",
          tags: ["Auth"],
          description: "Refresh token kullanarak yeni bir access token alır",
        },
      })
      .post("/logout", logout, {
        detail: {
          summary: "Oturum Kapatma",
          tags: ["Auth"],
          description: "Belirtilen oturumu sonlandırır",
        },
      })
      .get("/sessions", getActiveSessions, {
        detail: {
          summary: "Aktif Oturumları Listele",
          tags: ["Auth"],
          description: "Kullanıcının tüm aktif oturumlarını listeler",
        },
      })
      .post("/logout-others", logoutOtherSessions, {
        detail: {
          summary: "Diğer Oturumları Kapat",
          tags: ["Auth"],
          description: "Mevcut oturum dışındaki tüm oturumları sonlandırır",
        },
      })
      .post("/change-password", changePassword, {
        detail: {
          summary: "Şifre Değiştir",
          tags: ["Auth"],
          description: "Kullanıcının kendi şifresini değiştirmesi",
        },
      })
      .post("/admin/change-user-password", adminChangeUserPassword, {
        detail: {
          summary: "Kullanıcı Şifresi Değiştir (Admin)",
          tags: ["Auth"],
          description: "Admin tarafından kullanıcı şifresinin değiştirilmesi",
        },
      })
  );
};

export default authRoutes;
