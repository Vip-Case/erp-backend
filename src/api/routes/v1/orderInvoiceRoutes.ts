import { Elysia } from "elysia";
import OrderInvoiceController from "../../controllers/orderInvoiceController"; // Controller import

const OrderInvoiceRoutes = (app: Elysia) => {
    // Sipariş ID'sine göre fatura oluşturma
    app.post("/orders/:orderId/invoice", async (ctx) => {
        // Controller metodu çağrılır
        const response = await OrderInvoiceController.createInvoiceFromOrder(ctx);

        // Controller'dan dönen yanıtı ilet
        ctx.set.status = response.status;
        return response.body;
    });

    // Çoklu sipariş ID'lerine göre fatura oluşturma
    app.post("/orders/invoices", async (ctx) => {
        try {
            const response = await OrderInvoiceController.createInvoicesFromOrders(ctx);
            ctx.set.status = response.status;
            return response.body;
        } catch (error) {
            console.error("Route Error:", error);
            return {
                status: 500,
                body: { message: "Internal server error." },
            };
        }
    });

    //Tüm 'isInvoiceCreated: false' siparişler için fatura oluşturma
    app.post("/order/pending/invoices", async (ctx) => {
        try {
            const response = await OrderInvoiceController.createPendingInvoices(null);
            ctx.set.status = response.status;
            return response.body;
        } catch (error) {
            console.error("Fatura oluşturma endpointinde hata:", error);
            ctx.set.status = 500;
            return {
                success: false,
                message: "Fatura oluşturma sırasında bir hata oluştu.",
            };
        }
    });

    app.get("/invoice/pending/count", async (ctx) => await OrderInvoiceController.getPendingInvoiceCount(ctx));

    app.patch("/store/:storeId/auto-invoice-toggle", async (ctx) => await OrderInvoiceController.toggleAutoInvoiceCreation(ctx));

    return app;
};

export default OrderInvoiceRoutes;
