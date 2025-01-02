import { OrderInvoiceService } from "../../services/concrete/orderInvoiceService";
import { Context } from "elysia";

export default class OrderInvoiceController {
    private static orderInvoiceService = new OrderInvoiceService();

    static async createInvoiceFromOrder(ctx: Context) {
        try {
            const { orderId } = ctx.params; // Route parametreleri burada bulunur

            if (!orderId) {
                return {
                    status: 400,
                    body: { message: "Order ID is required." },
                };
            }

            const result = await this.orderInvoiceService.createInvoiceFromOrder(orderId);

            return {
                status: 201,
                body: {
                    message: "Invoice created successfully.",
                    data: result,
                },
            };
        } catch (error: any) {
            console.error("Error creating invoice from order:", error.message);
            return {
                status: 500,
                body: { message: error.message },
            };
        }
    }

    // Çoklu sipariş için fatura oluşturma
    static async createInvoicesFromOrders(ctx: Context) {
        try {
            const body = await ctx.request.json(); // Body'yi JSON olarak parse et
            const { orderIds }: { orderIds: string[] } = body;

            if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
                return {
                    status: 400,
                    body: { message: "At least one Order ID is required." },
                };
            }

            const results = await this.orderInvoiceService.createInvoicesFromOrders(orderIds);

            return {
                status: 201,
                body: {
                    message: "Invoices created successfully.",
                    data: results,
                },
            };
        } catch (error: any) {
            console.error("Error creating invoices from orders:", error.message);
            return {
                status: 500,
                body: { message: error.message },
            };
        }
    }

    // Tüm `isInvoiceCreated: false` siparişler için fatura oluşturma
    static async createPendingInvoices(_: any) {
        try {
            const result = await this.orderInvoiceService.createInvoicesForPendingOrders();
            return {
                status: 200,
                body: result,
            };
        } catch (error: any) {
            console.error("Fatura oluşturma işlemi sırasında hata:", error.message);
            return {
                status: 500,
                body: { success: false, message: error.message },
            };
        }
    }

    // Fatura oluşturulmamış siparişlerin sayısını döndüren yeni metod
    static async getPendingInvoiceCount(_: any) {
        try {
            const result = await this.orderInvoiceService.getPendingInvoiceCount();
            return {
                status: 200,
                body: result,
            };
        } catch (error: any) {
            console.error("Pending invoice count kontrolü sırasında hata:", error.message);
            return {
                status: 500,
                body: { success: false, message: error.message },
            };
        }
    }

    static async toggleAutoInvoiceCreation(ctx: Context) {
        try {
            const { storeId } = ctx.params; // Route parametrelerinden storeId'yi al
    
            if (!storeId) {
                return {
                    status: 400,
                    body: { success: false, message: "Store ID is required." },
                };
            }
    
            const result = await this.orderInvoiceService.toggleAutoInvoiceCreation(storeId);
    
            return {
                status: 200,
                body: result,
            };
        } catch (error) {
            console.error("autoInvoiceCreation güncellenirken hata oluştu:", error);
            return {
                status: 500,
                body: { success: false, message: error instanceof Error ? error.message : "Bir hata oluştu." },
            };
        }
    }
    
    
}


