import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const permissionPlugin = () => ({
    beforeHandle: async (ctx: any) => {
        const user = (ctx as any).user; // Bağlamdan kullanıcıyı alıyoruz
        const route = ctx.path; // Rota

        if (!user) {
            throw new Error("Unauthorized: User not authenticated.");
        }

        if (user.isAdmin) {
            return; // Admin kullanıcılar her rotaya erişebilir
        }

        const requiredPermissions = await prisma.permission.findMany({
            where: { route },
            select: { permissionName: true },
        });

        if (!requiredPermissions.length) {
            return; // İzin gerekmeyen rota
        }

        const hasPermission = requiredPermissions.every((p) =>
            user.permissions.includes(p.permissionName)
        );

        if (!hasPermission) {
            throw new Error("Permission denied.");
        }
    },
});
