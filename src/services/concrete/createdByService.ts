import { PrismaClient } from '@prisma/client';

export class CreatedByService extends PrismaClient {
    /**
     * Yeni bir kayıt oluştururken `createdBy` bilgisi ekler.
     */
    async createWithAudit(model: string, data: any, username: string) {
        console.log('Service - Gelen Kullanıcı Adı:', username); // Kullanıcı adı
        console.log('Service - Gelen Model:', model); // Model adı
        console.log('Service - Gelen Data:', data); // Veri
    
        if (!username) {
            throw new Error("Kullanıcı adı eksik!");
        }
    
        return await (this as any)[model].create({
            data: {
                ...data,
                createdBy: username,
            },
        });
    }
    
    async updateWithAudit(model: string, where: any, data: any, username: string) {
        console.log('Model:', model); // Gelen model
        console.log('Where:', where); // Güncellenecek kriter
        console.log('Data:', data); // Gelen veri
        console.log('Username:', username); // Kullanıcı adı
    
        if (!(this as any)[model]) {
            throw new Error(`Hata: ${model} adında bir Prisma modeli bulunamadı.`);
        }
    
        return await (this as any)[model].update({
            where,
            data: {
                ...data,
                updatedBy: username,
            },
        });
    }
}
