import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role, Permission, User } from "@prisma/client";
import redis from "../../config/redis";
import emailService from "./emailService";
import logger from "../../utils/logger";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";
const REFRESH_SECRET_KEY =
  process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_KEY";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  lastActivity: Date;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isSuspicious: boolean;
  suspiciousReason: string | null;
  location: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  rememberMe: boolean;
}

interface UserWithRelations extends User {
  role: (Role & { permissions: Permission[] })[];
  permission: Permission[];
  failedLoginAttempts: number;
  lastFailedLoginAt: Date | null;
  lockedUntil: Date | null;
}

interface SuspiciousActivityCheck {
  isNewLocation: boolean;
  isNewDevice: boolean;
  isNewBrowser: boolean;
  isNewOS: boolean;
  isUnusualTime: boolean;
  isMultipleFailedAttempts: boolean;
}

// Kullanıcı Kayıt
export const registerUser = async (
  userData: any,
  createdByAdmin: boolean = false
) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Sadece adminler kullanıcı oluşturabilir
  if (!createdByAdmin) {
    if (!userData.permissionGroups?.length && !userData.permissions?.length) {
      throw new Error("Seçilen izinler veya gruplar geçerli değil.");
    }
  }

  // Rol kontrolü
  const role = await prisma.role.findUnique({
    where: { roleName: userData.roleName },
    include: { permissions: true },
    include: { permissions: true },
  });

  console.log("Role Name:", userData.roleName);
  if (!role) {
    throw new Error("Geçersiz rol.");
  }

  // İzin gruplarını al
  const groups = userData.permissionGroups?.length
    ? await prisma.permissionGroup.findMany({
        where: { groupName: { in: userData.permissionGroups } },
        include: { permissions: true },
      })
    : [];

  console.log("Gruplar:", groups);
  // Gruplardan izinleri topla
  const groupPermissions = groups.flatMap((group) => group.permissions);

  // Bireysel izinleri doğrula
  const individualPermissions = userData.permissions?.length
    ? await prisma.permission.findMany({
        where: { permissionName: { in: userData.permissions } },
      })
    : [];

  console.log("Bireysel İzinler:", individualPermissions);
  // Tüm izinleri birleştir (gruplar + bireysel)
  const aggregatedPermissions = [
    ...new Set([...groupPermissions, ...individualPermissions]),
  ];

  console.log("Tüm İzinler:", aggregatedPermissions);
  if (aggregatedPermissions.length === 0 && !createdByAdmin) {
    throw new Error("Seçilen izinler veya gruplar geçerli değil.");
  }

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address,
      companyCode: userData.companyCode,
      role: { connect: { id: role.id } },
      permission: {
        connect: aggregatedPermissions.map((perm) => ({ id: perm.id })),
      },
    },
  });

  console.log("Kullanıcı başarıyla oluşturuldu:", user);
  return user;
};

// Token süreleri için sabitler
const TOKEN_DURATIONS = {
  DEFAULT: {
    ACCESS_TOKEN: "1d",
    REFRESH_TOKEN: "2d",
    REFRESH_TOKEN_MS: 2 * 24 * 60 * 60 * 1000, // 2 gün
  },
  REMEMBER_ME: {
    ACCESS_TOKEN: "1d",
    REFRESH_TOKEN: "7d",
    REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000, // 7 gün
  },
};

const MAX_CONCURRENT_SESSIONS = 5; // Maksimum eşzamanlı oturum sayısı

const generateTokenPair = async (
  user: UserWithRelations,
  deviceInfo: string,
  ipAddress: string,
  rememberMe: boolean = false,
  familyId: string = crypto.randomUUID()
): Promise<TokenPair> => {
  // Aktif oturum sayısını kontrol et
  const activeSessions = await prisma.session.count({
    where: {
      userId: user.id,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (activeSessions >= MAX_CONCURRENT_SESSIONS) {
    // En eski oturumu sonlandır
    const oldestSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (oldestSession) {
      await prisma.session.update({
        where: { id: oldestSession.id },
        data: {
          isActive: false,
          expiresAt: new Date(),
          refreshToken: "",
        },
      });
    }
  }

  const sessionId = crypto.randomUUID();
  const permissions = getAggregatedPermissions(user);

  // Token sürelerini belirle
  const duration = rememberMe
    ? TOKEN_DURATIONS.REMEMBER_ME
    : TOKEN_DURATIONS.DEFAULT;

  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      roles:
        user.role?.map((role: Role) => ({
          roleName: role.roleName,
        })) || [],
      isAdmin:
        user.role?.some((role: Role) => role.roleName === "admin") || false,
      sessionId,
      familyId,
    },
    SECRET_KEY,
    { expiresIn: duration.ACCESS_TOKEN as jwt.SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      sessionId,
      familyId,
    },
    REFRESH_SECRET_KEY,
    { expiresIn: duration.REFRESH_TOKEN as jwt.SignOptions["expiresIn"] }
  );

  // Token ailesini kaydet
  await updateTokenFamily(familyId, refreshToken);

  // Oturum kaydı
  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshToken,
      deviceInfo,
      ipAddress,
      isActive: true,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + duration.REFRESH_TOKEN_MS),
      rememberMe,
    },
  });

  return { accessToken, refreshToken };
};

// Redis blacklist key formatı
const BLACKLIST_PREFIX = "token:blacklist:";
const USED_TOKENS_PREFIX = "token:used:";
const TOKEN_FAMILY_PREFIX = "token:family:";

// Token blacklist için Redis kullanımı
const addToBlacklist = async (token: string, expiresIn: number) => {
  try {
    await redis.set(`${BLACKLIST_PREFIX}${token}`, "1", "EX", expiresIn);
    logger.info("Token blacklist'e eklendi");
  } catch (error) {
    logger.error("Token blacklist'e eklenirken hata oluştu:", error);
  }
};

const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await redis.get(`${BLACKLIST_PREFIX}${token}`);
    return !!result;
  } catch (error) {
    logger.error("Token blacklist kontrolü sırasında hata:", error);
    return false;
  }
};

// Token'ın daha önce kullanılıp kullanılmadığını kontrol et
const markTokenAsUsed = async (
  token: string,
  familyId: string
): Promise<boolean> => {
  try {
    // SET NX kullanarak atomic bir şekilde token'ı işaretle
    const key = `${USED_TOKENS_PREFIX}${token}`;
    const result = await redis
      .multi()
      .setnx(key, familyId)
      .expire(key, 60 * 60) // 1 saat
      .exec();

    return result !== null && result[0][1] === 1;
  } catch (error) {
    logger.error("Token kullanım kaydı sırasında hata:", error);
    return false;
  }
};

const getTokenFamily = async (familyId: string): Promise<string | null> => {
  try {
    return await redis.get(`${TOKEN_FAMILY_PREFIX}${familyId}`);
  } catch (error) {
    logger.error("Token ailesi kontrolü sırasında hata:", error);
    return null;
  }
};

const updateTokenFamily = async (familyId: string, refreshToken: string) => {
  try {
    const key = `${TOKEN_FAMILY_PREFIX}${familyId}`;
    await redis
      .multi()
      .set(key, refreshToken)
      .expire(key, 7 * 24 * 60 * 60) // 7 gün
      .exec();
  } catch (error) {
    logger.error("Token ailesi güncelleme sırasında hata:", error);
  }
};

const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  try {
    // Blacklist kontrolü
    const isBlacklisted = await isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new Error("Token geçersiz kılınmış");
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as any;
    const { userId, sessionId, familyId } = decoded;

    // Token'ın daha önce kullanılıp kullanılmadığını kontrol et
    const isTokenFresh = await markTokenAsUsed(refreshToken, familyId);
    if (!isTokenFresh) {
      // Token daha önce kullanılmış, potansiyel yeniden kullanım girişimi
      await redis.del(`${TOKEN_FAMILY_PREFIX}${familyId}`);
      await addToBlacklist(refreshToken, 60 * 60 * 24 * 7); // 7 gün
      throw new Error("Token yeniden kullanım denemesi tespit edildi");
    }

    // Token ailesini kontrol et
    const currentFamilyToken = await getTokenFamily(familyId);
    if (!currentFamilyToken) {
      // Aile kaydı yoksa potansiyel yeniden kullanım girişimi
      throw new Error("Geçersiz token ailesi");
    }

    if (currentFamilyToken !== refreshToken) {
      // Farklı bir token kullanılmış, tüm aileyi geçersiz kıl
      await redis.del(`${TOKEN_FAMILY_PREFIX}${familyId}`);
      await addToBlacklist(refreshToken, 60 * 60 * 24 * 7); // 7 gün
      throw new Error("Token yeniden kullanım denemesi tespit edildi");
    }

    // Oturum kontrolü
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        refreshToken,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      throw new Error("Geçersiz veya süresi dolmuş oturum");
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { include: { permissions: true } },
        permission: true,
      },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Yeni token çifti oluştur
    const newFamilyId = crypto.randomUUID();
    const { accessToken, refreshToken: newRefreshToken } =
      await generateTokenPair(
        user,
        session.deviceInfo || "",
        session.ipAddress || "",
        session.rememberMe,
        newFamilyId
      );

    // Yeni token ailesini kaydet
    await updateTokenFamily(newFamilyId, newRefreshToken);

    // Eski token'ı blacklist'e ekle
    await addToBlacklist(refreshToken, 60 * 60); // 1 saat

    // Oturumu güncelle
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: newRefreshToken,
        lastActivity: new Date(),
      },
    });

    // Güvenlik logu oluştur
    await prisma.securityLog.create({
      data: {
        userId,
        action: "token_refresh",
        description: "Token yenileme başarılı",
        timestamp: new Date(),
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    // Hata durumunda güvenlik logu
    if (error instanceof jwt.JsonWebTokenError) {
      const decoded = jwt.decode(refreshToken) as any;
      if (decoded?.userId) {
        await prisma.securityLog.create({
          data: {
            userId: decoded.userId,
            action: "token_refresh_failed",
            description: `Token yenileme başarısız: ${error.message}`,
            timestamp: new Date(),
          },
        });
      }
    }

    logger.error("Token yenileme başarısız:", error);
    throw error;
  }
};

const getAggregatedPermissions = (user: UserWithRelations): string[] => {
  const rolePermissions = user.role.flatMap(
    (role: Role & { permissions: Permission[] }) =>
      role.permissions.map((perm: Permission) => perm.permissionName)
  );
  const individualPermissions = user.permission.map(
    (perm: Permission) => perm.permissionName
  );
  return [...new Set([...rolePermissions, ...individualPermissions])];
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 30;

const checkSuspiciousActivity = async (
  userId: string,
  deviceInfo: string,
  ipAddress: string
): Promise<{ isSuspicious: boolean; reason?: string }> => {
  try {
    // Son başarılı oturumları al
    const recentSessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        isSuspicious: false,
      },
      orderBy: {
        lastActivity: "desc",
      },
      take: 5,
    });

    // Eğer hiç oturum yoksa (ilk giriş), şüpheli aktivite kontrolü yapma
    if (recentSessions.length === 0) {
      return { isSuspicious: false };
    }

    const checks: SuspiciousActivityCheck = {
      isNewLocation: true,
      isNewDevice: true,
      isNewBrowser: true,
      isNewOS: true,
      isUnusualTime: false,
      isMultipleFailedAttempts: false,
    };

    // Cihaz bilgilerini parse et
    const userAgent = deviceInfo;
    const browser = getBrowserInfo(userAgent);
    const os = getOSInfo(userAgent);
    const device = getDeviceInfo(userAgent);

    // Lokasyon bilgisini al
    const location = await getLocationFromIP(ipAddress);

    // Önceki oturumlarla karşılaştır
    for (const session of recentSessions) {
      if (session.location === location) checks.isNewLocation = false;
      if (session.device === device) checks.isNewDevice = false;
      if (session.browser === browser) checks.isNewBrowser = false;
      if (session.os === os) checks.isNewOS = false;
    }

    // Saat kontrolü (gece yarısı 00:00 - 05:00 arası)
    const hour = new Date().getHours();
    checks.isUnusualTime = hour >= 0 && hour < 5;

    // Son 30 dakika içindeki başarısız giriş denemeleri
    const recentFailedAttempts = await prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true, lastFailedLoginAt: true },
    });

    if (recentFailedAttempts?.lastFailedLoginAt) {
      const timeSinceLastFailure =
        Date.now() - recentFailedAttempts.lastFailedLoginAt.getTime();
      if (
        timeSinceLastFailure <= 30 * 60 * 1000 &&
        recentFailedAttempts.failedLoginAttempts >= 3
      ) {
        checks.isMultipleFailedAttempts = true;
      }
    }

    // Şüpheli aktivite değerlendirmesi
    // Lokasyon değişikliği ve başarısız giriş denemeleri daha önemli
    let suspiciousScore = 0;
    if (checks.isNewLocation) suspiciousScore += 2; // Lokasyon değişikliği daha ağırlıklı
    if (checks.isMultipleFailedAttempts) suspiciousScore += 2; // Başarısız denemeler daha ağırlıklı
    if (checks.isNewDevice) suspiciousScore += 1;
    if (checks.isNewBrowser) suspiciousScore += 0.5;
    if (checks.isNewOS) suspiciousScore += 0.5;
    if (checks.isUnusualTime) suspiciousScore += 1;

    const isSuspicious = suspiciousScore >= 3; // En az 3 puan gerekli

    let reason = "";
    if (isSuspicious) {
      const reasons = [];
      if (checks.isNewLocation) reasons.push("Yeni lokasyon");
      if (checks.isNewDevice) reasons.push("Yeni cihaz");
      if (checks.isNewBrowser) reasons.push("Yeni tarayıcı");
      if (checks.isNewOS) reasons.push("Yeni işletim sistemi");
      if (checks.isUnusualTime) reasons.push("Alışılmadık saat");
      if (checks.isMultipleFailedAttempts)
        reasons.push("Çoklu başarısız giriş denemesi");

      reason = `Şüpheli aktivite nedenleri: ${reasons.join(", ")}`;
    }

    return { isSuspicious, reason };
  } catch (error) {
    console.error("Şüpheli aktivite kontrolü sırasında hata:", error);
    return { isSuspicious: false };
  }
};

// Yardımcı fonksiyonlar
const getBrowserInfo = (userAgent: string): string => {
  // Basit tarayıcı tespiti
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Unknown";
};

const getOSInfo = (userAgent: string): string => {
  // Basit işletim sistemi tespiti
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";
  return "Unknown";
};

const getDeviceInfo = (userAgent: string): string => {
  // Basit cihaz tespiti
  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
};

const getLocationFromIP = async (ipAddress: string): Promise<string> => {
  try {
    // IP'den lokasyon tespiti (örnek implementasyon)
    // Gerçek uygulamada bir IP geolocation servisi kullanılmalı
    return "Unknown";
  } catch (error) {
    console.error("IP lokasyon tespiti sırasında hata:", error);
    return "Unknown";
  }
};

// Login fonksiyonunu güncelle
export const loginUser = async (
  credentials: { email: string; password: string; rememberMe?: boolean },
  deviceInfo: string,
  ipAddress: string
) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
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

  // Hesap kilitli mi kontrol et
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingTime = Math.ceil(
      (user.lockedUntil.getTime() - new Date().getTime()) / 1000 / 60
    );

    // E-posta bildirimi gönder
    await emailService.sendAccountLockedEmail(user.email, {
      remainingMinutes: remainingTime,
      failedAttempts: user.failedLoginAttempts,
      lastAttemptTime: new Date().toLocaleString(),
      ip: ipAddress,
    });

    throw new Error(
      `Hesabınız kilitli. ${remainingTime} dakika sonra tekrar deneyiniz.`
    );
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    // Başarısız giriş denemesini kaydet
    const failedAttempts = user.failedLoginAttempts + 1;
    const updates: any = {
      failedLoginAttempts: failedAttempts,
      lastFailedLoginAt: new Date(),
    };

    // Maksimum deneme sayısı aşıldıysa hesabı kilitle
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockedUntil = new Date(
        Date.now() + LOCK_TIME_MINUTES * 60 * 1000
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updates,
    });

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      // E-posta bildirimi gönder
      await emailService.sendAccountLockedEmail(user.email, {
        remainingMinutes: LOCK_TIME_MINUTES,
        failedAttempts,
        lastAttemptTime: new Date().toLocaleString(),
        ip: ipAddress,
      });

      throw new Error(
        `Çok fazla başarısız giriş denemesi. Hesabınız ${LOCK_TIME_MINUTES} dakika kilitlendi.`
      );
    }

    throw new Error(
      `Geçersiz şifre. ${
        MAX_LOGIN_ATTEMPTS - failedAttempts
      } deneme hakkınız kaldı.`
    );
  }

  // Başarılı giriş - sayaçları sıfırla
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lastFailedLoginAt: null,
      lockedUntil: null,
    },
  });

  // Şüpheli aktivite kontrolü
  const { isSuspicious, reason } = await checkSuspiciousActivity(
    user.id,
    deviceInfo,
    ipAddress
  );

  if (isSuspicious) {
    // E-posta bildirimi gönder
    await emailService.sendSuspiciousActivityEmail(user.email, {
      location: await getLocationFromIP(ipAddress),
      device: getDeviceInfo(deviceInfo),
      browser: getBrowserInfo(deviceInfo),
      time: new Date().toLocaleString(),
      ip: ipAddress,
    });
  }

  const { accessToken, refreshToken } = await generateTokenPair(
    user,
    deviceInfo,
    ipAddress,
    credentials.rememberMe
  );

  // Yeni cihazdan giriş kontrolü
  const isNewDevice = await isNewDeviceLogin(user.id, deviceInfo);
  if (isNewDevice) {
    // E-posta bildirimi gönder
    await emailService.sendNewDeviceLoginEmail(user.email, {
      device: getDeviceInfo(deviceInfo),
      browser: getBrowserInfo(deviceInfo),
      location: await getLocationFromIP(ipAddress),
      time: new Date().toLocaleString(),
      ip: ipAddress,
    });
  }

  // User agent bilgilerini parse et
  const browser = getBrowserInfo(deviceInfo);
  const os = getOSInfo(deviceInfo);
  const device = getDeviceInfo(deviceInfo);
  const location = await getLocationFromIP(ipAddress);

  // Oturum oluştur
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      deviceInfo,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
      isSuspicious,
      suspiciousReason: reason || null,
      location,
      userAgent: deviceInfo,
      browser,
      os,
      device,
      rememberMe: credentials.rememberMe || false,
    },
  });

  return {
    status: 200,
    message: "Giriş başarılı!",
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyCode: user.companyCode,
      roles: user.role.map((role) => ({
        id: role.id,
        name: role.roleName,
      })),
    },
    isSuspicious,
    suspiciousReason: reason,
  };
};

// Yeni cihaz kontrolü
const isNewDeviceLogin = async (
  userId: string,
  deviceInfo: string
): Promise<boolean> => {
  const previousSessions = await prisma.session.findMany({
    where: {
      userId,
      deviceInfo,
    },
    take: 1,
  });

  return previousSessions.length === 0;
};

// Logout fonksiyonunu güncelle
export const logout = async (sessionId: string) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Oturum bulunamadı");
  }

  // Refresh token'ı blacklist'e ekle
  if (session.refreshToken) {
    await addToBlacklist(
      session.refreshToken,
      Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)
    );
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      isActive: false,
      expiresAt: new Date(),
      refreshToken: "",
      lastActivity: new Date(),
    },
  });

  return { status: 200, message: "Oturum başarıyla sonlandırıldı" };
};

// Tüm aktif oturumları getir
export const getActiveSessions = async (userId: string) => {
  return await prisma.session.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      lastActivity: "desc",
    },
  });
};

// Diğer oturumlardan çıkış yap
export const logoutOtherSessions = async (
  userId: string,
  currentSessionId: string
) => {
  await prisma.session.updateMany({
    where: {
      userId,
      id: { not: currentSessionId },
      isActive: true,
    },
    data: {
      isActive: false,
      expiresAt: new Date(),
    },
  });
  return { status: 200, message: "Diğer oturumlar sonlandırıldı" };
};

const MAX_INACTIVITY_MINUTES = 30; // 30 dakika inaktivite süresi

export const me = async (auth_token: string) => {
  const decoded = jwt.verify(auth_token, SECRET_KEY) as any;

  // Aktif session kontrolü
  const activeSession = await prisma.session.findFirst({
    where: {
      id: decoded.sessionId,
      userId: decoded.userId,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!activeSession) {
    throw new Error("Geçersiz veya süresi dolmuş oturum");
  }

  // İnaktivite kontrolü
  const lastActivity = new Date(activeSession.lastActivity);
  const inactivityTime = Math.floor(
    (Date.now() - lastActivity.getTime()) / (1000 * 60)
  );

  if (inactivityTime > MAX_INACTIVITY_MINUTES) {
    // Oturumu sonlandır
    await prisma.session.update({
      where: { id: activeSession.id },
      data: {
        isActive: false,
        expiresAt: new Date(),
        refreshToken: "",
      },
    });
    throw new Error("Oturum inaktivite nedeniyle sonlandırıldı");
  }

  // Son aktivite zamanını güncelle
  await prisma.session.update({
    where: { id: activeSession.id },
    data: {
      lastActivity: new Date(),
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      role: true,
      permission: true,
    },
  });

  if (!user) throw new Error("Kullanıcı bulunamadı.");

  const isAdmin = user.role?.some((role) => role.roleName === "admin") || false;

  return {
    user: {
      ...user,
      isAdmin,
    },
    session: {
      id: activeSession.id,
      deviceInfo: activeSession.deviceInfo,
      lastActivity: activeSession.lastActivity,
      isSuspicious: activeSession.isSuspicious,
      suspiciousReason: activeSession.suspiciousReason,
    },
  };
};

// Şifre politikası kontrolü
const isPasswordValid = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
};

// Kullanıcının kendi şifresini değiştirmesi için
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    // Mevcut şifreyi kontrol et
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Mevcut şifre yanlış");
    }

    // Yeni şifre eski şifre ile aynı olmamalı
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("Yeni şifre eski şifre ile aynı olamaz");
    }

    // Şifre politikası kontrolü
    if (!isPasswordValid(newPassword)) {
      throw new Error(
        "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir"
      );
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Tüm aktif oturumları sonlandır
    await prisma.session.updateMany({
      where: {
        userId: userId,
        isActive: true,
      },
      data: {
        isActive: false,
        expiresAt: new Date(),
      },
    });

    // Email bildirimi gönder
    await emailService.sendPasswordChangeEmail(user.email, {
      time: new Date().toLocaleString(),
    });

    return {
      success: true,
      message: "Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın.",
    };
  } catch (error: any) {
    logger.error("Şifre değiştirme hatası:", error);
    throw new Error(error.message);
  }
};

// Admin tarafından şifre değiştirme
export const adminChangeUserPassword = async (
  adminId: string,
  targetUserId: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: {
        role: true,
      },
    });

    if (!admin || !admin.role.some((role) => role.roleName === "admin")) {
      throw new Error("Bu işlem için admin yetkisi gereklidir");
    }

    // Hedef kullanıcıyı bul
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error("Hedef kullanıcı bulunamadı");
    }

    // Şifre politikası kontrolü
    if (!isPasswordValid(newPassword)) {
      throw new Error(
        "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir"
      );
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Kullanıcının tüm aktif oturumlarını sonlandır
    await prisma.session.updateMany({
      where: {
        userId: targetUserId,
        isActive: true,
      },
      data: {
        isActive: false,
        expiresAt: new Date(),
      },
    });

    // Email bildirimi gönder
    await emailService.sendPasswordChangeByAdminEmail(targetUser.email, {
      time: new Date().toLocaleString(),
      adminUsername: admin.username,
    });

    // Güvenlik logu oluştur
    await prisma.securityLog.create({
      data: {
        userId: targetUserId,
        adminId: adminId,
        action: "password_change_by_admin",
        description: `Şifre ${admin.username} tarafından değiştirildi`,
        timestamp: new Date(),
      },
    });

    return {
      success: true,
      message: "Kullanıcı şifresi başarıyla değiştirildi",
    };
  } catch (error: any) {
    logger.error("Admin şifre değiştirme hatası:", error);
    throw new Error(error.message);
  }
};

export default {
  registerUser,
  loginUser,
  me,
  refreshAccessToken,
  logout,
  getActiveSessions,
  logoutOtherSessions,
  changePassword,
  adminChangeUserPassword,
};
