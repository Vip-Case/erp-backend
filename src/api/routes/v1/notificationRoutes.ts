import { Elysia } from 'elysia';
import { NotificationController } from '../../controllers/notificationController';

export const NotificationRoutes = (app: Elysia) => {
    app.group("/notifications", (app) =>
        app.get("/check-stock-levels", NotificationController.checkStockLevels, { tags: ["Notifications"] })
            .get("/unread", NotificationController.getUnreadNotifications, { tags: ["Notifications"] })
            .get("/", NotificationController.getAllNotifications, { tags: ["Notifications"] })
            .delete("/", NotificationController.deleteNotifications, { tags: ["Notifications"] })
            .put("/mark-as-read", NotificationController.markNotificationsAsRead, { tags: ["Notifications"] })
    );
    return app;
};

export default NotificationRoutes;
