import { Context } from 'elysia';
import { NotificationService } from '../../services/concrete/NotificationService';

// Service Initialization
const notificationService = new NotificationService();

export const NotificationController = {
    // Stok seviyesi kontrolü ve bildirim oluşturma
    checkStockLevels: async (ctx: Context) => {
        try {
            // Stok seviyelerini kontrol et ve bildirim oluştur
            await notificationService.checkStockLevels();

            ctx.set.status = 200;
            return { message: "Stok seviyeleri kontrol edildi ve bildirimler oluşturuldu" };
        } catch (error: any) {
            ctx.set.status = 500;
            return { error: "Stok seviyesi kontrolü sırasında hata", details: error.message };
        }
    },

    // Okunmamış bildirimleri getir
    getUnreadNotifications: async (ctx: Context) => {
        try {
            const notifications = await notificationService.getUnreadNotifications();
            ctx.set.status = 200;
            return notifications;
        } catch (error: any) {
            ctx.set.status = error.message.includes('token') ? 401 : 500;
            return { error: "Okunmamış bildirimler getirilirken hata", details: error.message };
        }
    },

    // Tüm bildirimleri getir
    getAllNotifications: async (ctx: Context) => {
        try {
            const notifications = await notificationService.getAllNotifications();
            ctx.set.status = 200;
            return notifications;
        } catch (error: any) {
            ctx.set.status = error.message.includes('token') ? 401 : 500;
            return { error: "Bildirimler getirilirken hata", details: error.message };
        }
    },

    // Bildirimleri sil
    deleteNotifications: async (ctx: Context) => {
        try {

            const { ids } = ctx.body as { ids: string | string[] };
            if (!ids) {
                return ctx.error(400, "Notification IDs are required");
            }

            await notificationService.deleteNotifications(ids);
            ctx.set.status = 200;
            return { message: "Bildirimler başarıyla silindi" };
        } catch (error: any) {
            ctx.set.status = error.message.includes('token') ? 401 : 500;
            return { error: "Bildirimler silinirken hata", details: error.message };
        }
    },

    // Bildirimleri okundu olarak işaretle
    markNotificationsAsRead: async (ctx: Context) => {
        try {
            const authHeader = ctx.request.headers.get("Authorization");
            if (!authHeader) {
                return ctx.error(401, "Authorization header is missing");
            }

            const { ids } = ctx.body as { ids: string | string[] };
            if (!ids) {
                return ctx.error(400, "Notification IDs are required");
            }

            await notificationService.markNotificationsAsRead(authHeader, ids);
            ctx.set.status = 200;
            return { message: "Bildirimler okundu olarak işaretlendi" };
        } catch (error: any) {
            ctx.set.status = error.message.includes('token') ? 401 : 500;
            return { error: "Bildirimler okundu olarak işaretlenirken hata", details: error.message };
        }
    }
};

export default NotificationController;
