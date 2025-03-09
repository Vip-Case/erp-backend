import authService from "../../services/concrete/authService";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

export const register = async (ctx: any) => {
  console.log("Request User:", ctx.request.user); // Debug log

  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    return {
      status: 403,
      body: { message: "Auth header is missing" },
    };
  }

  const token = authHeader.split(" ")[1];
  let isAdmin = false;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    isAdmin = decoded.isAdmin || false;
  } catch (error) {
    return {
      status: 403,
      body: { message: "Geçersiz veya süresi dolmuş token." },
    };
  }

  if (!isAdmin) {
    return {
      status: 403,
      body: { message: "Yalnızca adminler kullanıcı oluşturabilir!" },
    };
  }

  // Kullanıcıyı kaydet
  const user = await authService.registerUser(ctx.body, true);
  return {
    status: 201,
    body: { message: "Kullanıcı başarıyla oluşturuldu!", user },
  };
};

export const login = async (ctx: any) => {
  try {
    const { email, password, rememberMe } = ctx.body;
    const deviceInfo = ctx.request.headers.get("User-Agent") || "unknown";
    const ipAddress =
      ctx.request.headers.get("X-Forwarded-For") ||
      ctx.request.headers.get("X-Real-IP") ||
      "unknown";

    const result = await authService.loginUser(
      { email, password, rememberMe },
      deviceInfo,
      ipAddress
    );

    if (result.isSuspicious) {
      ctx.set.status = 203; // Non-Authoritative Information
      return {
        ...result,
        warning:
          "Şüpheli giriş aktivitesi tespit edildi. Lütfen dikkatli olun.",
      };
    }

    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { status: 400, message: error.message };
  }
};

export const me = async (ctx: any) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    return {
      status: 403,
      body: { message: "Auth header is missing" },
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = await authService.me(token);
    return { status: 200, body: user };
  } catch (error: any) {
    ctx.set.status = 401;
    return { status: 401, message: error.message };
  }
};

export const refreshToken = async (ctx: any) => {
  try {
    const { refreshToken } = ctx.body;
    if (!refreshToken) {
      ctx.set.status = 400;
      return { status: 400, message: "Refresh token gerekli" };
    }

    const result = await authService.refreshAccessToken(refreshToken);
    return {
      status: 200,
      message: "Token başarıyla yenilendi",
      ...result,
    };
  } catch (error: any) {
    ctx.set.status = 401;
    return { status: 401, message: error.message };
  }
};

export const logout = async (ctx: any) => {
  try {
    const { sessionId } = ctx.body;
    if (!sessionId) {
      ctx.set.status = 400;
      return { status: 400, message: "Session ID gerekli" };
    }

    const result = await authService.logout(sessionId);
    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { status: 400, message: error.message };
  }
};

export const getActiveSessions = async (ctx: any) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      ctx.set.status = 403;
      return { status: 403, message: "Auth header is missing" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;

    const sessions = await authService.getActiveSessions(decoded.userId);
    return {
      status: 200,
      message: "Aktif oturumlar başarıyla getirildi",
      sessions: sessions.map((session) => ({
        id: session.id,
        deviceInfo: session.deviceInfo,
        browser: session.browser,
        os: session.os,
        device: session.device,
        location: session.location,
        lastActivity: session.lastActivity,
        isSuspicious: session.isSuspicious,
        suspiciousReason: session.suspiciousReason,
        createdAt: session.createdAt,
        rememberMe: session.rememberMe,
      })),
    };
  } catch (error: any) {
    ctx.set.status = 400;
    return { status: 400, message: error.message };
  }
};

export const logoutOtherSessions = async (ctx: any) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      ctx.set.status = 403;
      return { status: 403, message: "Auth header is missing" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;

    const result = await authService.logoutOtherSessions(
      decoded.userId,
      decoded.sessionId
    );
    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { status: 400, message: error.message };
  }
};

export const changePassword = async (ctx: any) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      ctx.set.status = 403;
      return { status: 403, message: "Auth header is missing" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const { currentPassword, newPassword } = ctx.body;

    if (!currentPassword || !newPassword) {
      ctx.set.status = 400;
      return {
        status: 400,
        message: "Mevcut şifre ve yeni şifre gereklidir",
      };
    }

    const result = await authService.changePassword(
      decoded.userId,
      currentPassword,
      newPassword
    );

    return result;
  } catch (error: any) {
    ctx.set.status = 400;
    return { status: 400, message: error.message };
  }
};

export const adminChangeUserPassword = async (ctx: any) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      ctx.set.status = 403;
      return { status: 403, message: "Auth header is missing" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const { targetUserId, newPassword } = ctx.body;

    if (!targetUserId || !newPassword) {
      ctx.set.status = 400;
      return {
        status: 400,
        message: "Hedef kullanıcı ID ve yeni şifre gereklidir",
      };
    }

    const result = await authService.adminChangeUserPassword(
      decoded.userId,
      targetUserId,
      newPassword
    );

    return result;
  } catch (error: any) {
    ctx.set.status = error.message.includes("admin yetkisi") ? 403 : 400;
    return { status: ctx.set.status, message: error.message };
  }
};

export default {
  register,
  login,
  me,
  refreshToken,
  logout,
  getActiveSessions,
  logoutOtherSessions,
  changePassword,
  adminChangeUserPassword,
};
