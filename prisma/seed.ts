import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // Varsayılan izinler
    const createPermission = await prisma.permission.upsert({
        where: { permissionName: 'create' },
        update: {},
        create: {
            permissionName: 'create',
            description: 'Create data',
        },
    });

    const readPermission = await prisma.permission.upsert({
        where: { permissionName: 'read' },
        update: {},
        create: {
            permissionName: 'read',
            description: 'Read data',
        },
    });

    const updatePermission = await prisma.permission.upsert({
        where: { permissionName: 'update' },
        update: {},
        create: {
            permissionName: 'update',
            description: 'Update data',
        },
    });

    const deletePermission = await prisma.permission.upsert({
        where: { permissionName: 'delete' },
        update: {},
        create: {
            permissionName: 'delete',
            description: 'Delete data',
        },
    });

    // Varsayılan roller
    const adminRole = await prisma.role.upsert({
        where: { roleName: 'admin' },
        update: {},
        create: {
            roleName: 'admin',
            description: 'Admin role with full access',
            permission: {
                connect: [
                    { id: createPermission.id },
                    { id: readPermission.id },
                    { id: updatePermission.id },
                    { id: deletePermission.id },
                ],
            },
        },
    });

    const userRole = await prisma.role.upsert({
        where: { roleName: 'user' },
        update: {},
        create: {
            roleName: 'user',
            description: 'Standard user role with limited access',
            permission: {
                connect: [
                    { id: readPermission.id },
                ],
            },
        },
    });


    const hashedPassword = await bcrypt.hash('admin_password', 10);

    // Admin rolüyle kullanıcı ekleyin
    await prisma.user.create({
        data: {
            username: 'admin_user',
            email: 'admin@example.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '123456789',
            address: 'Admin Address',
            role: {
                connect: { roleName: 'admin' } // admin rolüyle bağlanıyor
            },
        },
    });

    // Brand ekleme
    await prisma.brand.create({
        data: {
            brandCode: "VPCS",
            brandName: "VipCase",
            createdBy: adminRole.id,
        },
    });
}

main()
    .then(() => {
        console.log("Data oluşturuldu");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
