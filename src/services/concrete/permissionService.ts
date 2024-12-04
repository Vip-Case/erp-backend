import prisma from "../../config/prisma";
import { Permission } from "@prisma/client";

export class PermissionService {
    async getAllPermissions(): Promise<Permission[]> {
        return await prisma.permission.findMany();
    }

    async createPermission(permissionData: Partial<Permission>): Promise<Permission> {
        try {
            return await prisma.permission.create({
                data: {
                    permissionName: permissionData.permissionName!,
                    description: permissionData.description!, // Zorunlu alan
                    route: permissionData.route!,
                },
            });
        } catch (error: any) {
            if (error.code === "P2002") {
                throw new Error("Bu izin zaten mevcut.");
            }
            throw new Error("Permission oluşturulurken hata oluştu.");
        }
    }
    

    async deletePermission(id: string): Promise<Permission> {
        return await prisma.permission.delete({
            where: { id },
        });
    }
}

export default PermissionService;
