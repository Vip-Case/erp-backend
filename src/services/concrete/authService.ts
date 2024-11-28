import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

// Kullanıcı Kayıt
export const registerUser = async (userData: any, createdByAdmin: boolean = false) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Sadece adminler kullanıcı oluşturabilir
  if (!createdByAdmin) {
    throw new Error('Yalnızca adminler yeni kullanıcı oluşturabilir.');
  }

  // Rol kontrolü
  const role = await prisma.role.findUnique({
    where: { roleName: userData.roleName },
    include: { permission: true },
  });

  if (!role) {
    throw new Error('Geçersiz rol.');
  }

  // İzin gruplarını al
  const groups = await prisma.permissionGroup.findMany({
    where: { groupName: { in: userData.permissionGroups || [] } },
    include: { permissions: true },
  });

  // Gruplardan izinleri topla
  const groupPermissions = groups.flatMap((group) => group.permissions);

  // Bireysel izinleri doğrula
  const individualPermissions = await prisma.permission.findMany({
    where: { permissionName: { in: userData.permissions || [] } },
  });

  // Tüm izinleri birleştir (gruplar + bireysel)
  const aggregatedPermissions = [...new Set([...groupPermissions, ...individualPermissions])];

  if (aggregatedPermissions.length === 0) {
    throw new Error('Seçilen izinler veya gruplar geçerli değil.');
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

  return user;
};

// Kullanıcı Giriş
export const loginUser = async (credentials: any) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    include: {
      role: { include: { permission: true } },
      permission: true,
    },
  });

  if (!user) throw new Error('Kullanıcı bulunamadı.');

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) throw new Error('Geçersiz şifre.');

  // Admin rolü kontrolü
  const isAdmin = user.role.some((role) => role.roleName === 'admin');

  const rolePermissions = user.role.flatMap((role) => role.permission.map((perm) => perm.permissionName));
  const individualPermissions = user.permission.map((perm) => perm.permissionName);
  const aggregatedPermissions = [...new Set([...rolePermissions, ...individualPermissions])];

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.role.map((role) => role.roleName),
      permissions: aggregatedPermissions,
      isAdmin,
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  return { token, user };
};

export default { registerUser, loginUser }