import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

export class NotificationService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Bearer token'dan username'i çıkarır
     * @param bearerToken - Bearer token
     * @returns username
     */
    private extractUsernameFromToken(bearerToken: string): string {
        try {
            const token = bearerToken.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY) as any;
            return decoded.username;
        } catch (error) {
            logger.error('Token decode hatası:', error);
            throw new Error('Geçersiz veya süresi dolmuş token');
        }
    }

    /**
     * Stok seviyesi düşük olan ürünler için bildirim oluşturur
     * @param bearerToken - Bearer token
     * @param criticalLevel - Kritik stok seviyesi (varsayılan: 50)
     * @param warningLevel - Uyarı stok seviyesi (varsayılan: 20)
     */
    /**
     * Stok kartlarının risk seviyelerini kontrol eder ve bildirim oluşturur
     */
    async checkStockLevels(): Promise<void> {
        try {
            // Stok kartları ve ilişkili depoları al
            const stockCardData = await this.prisma.stockCard.findMany({
                where: {
                    riskQuantities: {
                        not: null // Risk miktarı atanmış ürünler
                    }
                },
                include: {
                    stockCardWarehouse: {
                        select: {
                            quantity: true,
                            warehouseId: true
                        }
                    }
                }
            });

            let notificationCount = 0;

            for (const stockCard of stockCardData) {
                const { riskQuantities, productCode, productName, stockCardWarehouse } = stockCard;

                for (const warehouse of stockCardWarehouse) {
                    if (warehouse.quantity.toNumber() <= riskQuantities!.toNumber()) {
                        const severity = warehouse.quantity.toNumber() === 0 ? 'CRITICAL' : 'WARNING';
                        const message = `Stok Uyarısı: ${productName} (${productCode}) - Depo: ${warehouse.warehouseId} stok seviyesi ${warehouse.quantity} adete düşmüştür.`;

                        // Bildirim oluştur
                        await this.prisma.notification.create({
                            data: {
                                title: 'Düşük Stok Uyarısı',
                                message,
                                type: 'STOCK_ALERT',
                                severity,
                                read: false,
                                createdAt: new Date()
                            }
                        });

                        logger.info(`Bildirim oluşturuldu: ${message}`);
                        notificationCount++;
                    }
                }
            }

            logger.info(`${notificationCount} adet düşük stok bildirimi oluşturuldu.`);
        } catch (error) {
            logger.error('Stok seviyesi kontrolü sırasında hata:', error);
            throw new Error('Stok seviyesi bildirimleri oluşturulurken bir hata oluştu.');
        }
    }

    /**
     * Okunmamış bildirimleri getirir
     * @param bearerToken - Bearer token
     */
    async getUnreadNotifications(bearerToken: string) {
        try {
            const username = this.extractUsernameFromToken(bearerToken);

            return await this.prisma.notification.findMany({
                where: {
                    read: false,
                    user: {
                        username: username
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            logger.error('Okunmamış bildirimler getirilirken hata:', error);
            throw new Error('Okunmamış bildirimler getirilirken bir hata oluştu');
        }
    }

    /**
     * Tüm bildirimleri getirir
     * @param bearerToken - Bearer token
     */
    async getAllNotifications(bearerToken: string) {
        try {
            const username = this.extractUsernameFromToken(bearerToken);

            return await this.prisma.notification.findMany({
                where: {
                    user: {
                        username: username
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            logger.error('Tüm bildirimler getirilirken hata:', error);
            throw new Error('Bildirimler getirilirken bir hata oluştu');
        }
    }

    /**
     * Belirtilen bildirimleri siler
     * @param bearerToken - Bearer token
     * @param ids - Silinecek bildirimlerin ID listesi
     */
    async deleteNotifications(bearerToken: string, ids: string | string[]) {
        try {
            const username = this.extractUsernameFromToken(bearerToken);
            const idList = Array.isArray(ids) ? ids : [ids];
            
            await this.prisma.notification.deleteMany({
                where: {
                    id: {
                        in: idList
                    },
                    user: {
                        username: username
                    }
                }
            });

            logger.info(`${idList.length} adet bildirim silindi`);
        } catch (error) {
            logger.error('Bildirimler silinirken hata:', error);
            throw new Error('Bildirimler silinirken bir hata oluştu');
        }
    }

    /**
     * Belirtilen bildirimleri okundu olarak işaretler
     * @param bearerToken - Bearer token
     * @param ids - Okundu olarak işaretlenecek bildirimlerin ID listesi
     */
    async markNotificationsAsRead(bearerToken: string, ids: string | string[]) {
        try {
            const username = this.extractUsernameFromToken(bearerToken);
            const idList = Array.isArray(ids) ? ids : [ids];
            
            await this.prisma.notification.updateMany({
                where: {
                    id: {
                        in: idList
                    },
                    user: {
                        username: username
                    }
                },
                data: {
                    read: true,
                    readAt: new Date(),
                    readBy: username
                }
            });

            logger.info(`${idList.length} adet bildirim okundu olarak işaretlendi`);
        } catch (error) {
            logger.error('Bildirimler okundu olarak işaretlenirken hata:', error);
            throw new Error('Bildirimler okundu olarak işaretlenirken bir hata oluştu');
        }
    }
}
