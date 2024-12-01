import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const permissionGuard = async (ctx: any) => {
    const user = ctx.user;
    const route = ctx.request?.path;

    if (!user) {
        ctx.response.status = 401;
        throw new Error("Unauthorized: User not authenticated.");
    }

    if (user.isAdmin) {
        return; // Admin tüm rotalara erişebilir
    }

    const requiredPermissions = await prisma.permission.findMany({
        where: { route },
        select: { permissionName: true },
    });

    if (!requiredPermissions.length) {
        return; // Bu rota için izin kontrolü gerekmez
    }

    const hasPermission = requiredPermissions.every((p) =>
        user.permissions.includes(p.permissionName)
    );

    if (!hasPermission) {
        ctx.response.status = 403;
        throw new Error("Permission denied.");
    }
};
