import prisma from "../../config/prisma";
import { InvoicesService } from "../concrete/invoicesService";
import { InvoiceInfo } from "../concrete/invoiceService";

export class OrderInvoiceService {
    private invoiceService: InvoicesService;

    constructor() {
        this.invoiceService = new InvoicesService();
    }

    async createInvoiceFromOrder(orderId: string): Promise<any> {
        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    items: {
                        include: {
                            stockCard: {
                                include: {
                                    branch: true,
                                    stockCardPriceLists: {
                                        include: { priceList: true },
                                    },
                                    stockCardCategoryItem: {
                                        include: { stockCardCategory: true },
                                    },
                                    stockCardAttributeItems: {
                                        include: { attribute: true },
                                    },
                                    stockCardManufacturer: {
                                        include: { brand: true },
                                    },
                                },
                            },
                        },
                    },
                    shippingAddress: true,
                    billingAddress: true,
                },
            });

            if (!order) {
                throw new Error(`Order with ID '${orderId}' not found.`);
            }

            const validItems = order.items.filter((item) => item.stockCard);
            if (validItems.length === 0) {
                throw new Error(`No valid StockCard items found for Order ID '${orderId}'.`);
            }

            const firstItemStockCard = validItems[0].stockCard;

            const branchCode = firstItemStockCard?.branch?.branchCode || "DEFAULT_BRANCH";

            const warehouse = await prisma.stockCardWarehouse.findFirst({
                where: { stockCardId: firstItemStockCard?.id },
                include: { warehouse: true },
            });

            const warehouseId = warehouse?.warehouse?.id;
            const warehouseCode = warehouse?.warehouse?.warehouseCode;
            if (warehouse) {
                console.log(
                    `Invoice işlemi sırasında erişilen StockCardWarehouse: StockCardId: ${firstItemStockCard?.id}, Mevcut Miktar: ${warehouse.quantity}`
                );
            }
            
            if (!warehouseId || !warehouseCode) {
                throw new Error("Warehouse ID or Code not found for the provided stock card.");
            }

            let priceListId;

            const dynamicPriceList = await prisma.stockCardPriceList.findFirst({
                where: { isActive: true, priceListName: "Woocommerce" }
            });

            if (dynamicPriceList) {
                priceListId = dynamicPriceList.id;
            } else {
                console.warn("Dinamik PriceList bulunamadı, manuel PriceListId kullanılacak.");
                priceListId = "cm56mf2dv00079omghohkjeee"; // Manuel olarak belirttiğiniz ID
            }

            const current = await prisma.current.findFirst({
                where: {
                    OR: [
                        {
                            currentAddress: {
                                some: {
                                    address: order.billingAddress?.address?.trim(),
                                },
                            },
                        },
                        { currentName: order.billingAddress?.fullName?.trim() },
                        { taxNumber: order.billingAddress?.transactionId },
                    ],
                },
            });

            if (!current) {
                throw new Error(
                    `No matching Current record found for billing address: ${order.billingAddress?.address}`
                );
            }

            const customerCode = current.currentCode;

            const invoiceData: InvoiceInfo = {
                invoiceNo: `INV-${order.platform}-${order.platformOrderId}`,
                gibInvoiceNo: null,
                invoiceDate: order.orderDate,
                paymentDate: new Date(),
                paymentDay: 30,
                branchCode,
                warehouseId,
                description: `Order from ${order.platform} (${order.platformOrderId})`,
                currentCode: customerCode,
                priceListId,
                totalAmount: validItems.reduce((sum, item) => {
                    const price = item.stockCard?.stockCardPriceLists?.[0]?.price?.toNumber() || 0;
                    return sum + price;
                }, 0),
                totalVat: validItems.reduce((sum, item) => {
                    const price = item.stockCard?.stockCardPriceLists?.[0]?.price?.toNumber() || 0;
                    return sum + price * 0.18;
                }, 0),
                totalPaid: 0,
                totalDebt: validItems.reduce((sum, item) => {
                    const price = item.stockCard?.stockCardPriceLists?.[0]?.price?.toNumber() || 0;
                    return sum + price;
                }, 0),
                items: validItems.map((item) => {

                    if (!item.stockCard) {
                        throw new Error(`StockCard not found for item ID '${item.id}'. Ensure all items have valid StockCards.`);
                    }

                    const price = item.stockCard.stockCardPriceLists?.[0]?.price?.toNumber() || 0;

                    return {
                        stockCardId: item.stockCard.id,
                        quantity: item.quantity,
                        unitPrice: price,
                        vatRate: 18,
                        vatAmount: parseFloat((price * 0.18).toFixed(2)),
                        totalAmount: price,
                        priceListId: item.stockCard.stockCardPriceLists?.[0]?.priceListId || priceListId,
                        currency: item.stockCard.stockCardPriceLists?.[0]?.priceList?.currency || "TRY",
                    };
                }),
                payments: [
                    {
                        method: order.billingAddress?.paymentMethod || "cash",
                        accountId: order.billingAddress?.transactionId || "DEFAULT_ACCOUNT",
                        amount: validItems.reduce((sum, item) => {
                            const price = item.stockCard?.stockCardPriceLists?.[0]?.price?.toNumber() || 0;
                            return sum + price;
                        }, 0),
                        currency: order.currency || "TRY",
                        description: `Payment for Order ID: ${order.id}`,
                    },
                ],
            };

            // Fatura oluşturulduktan sonra isInvoiceCreated alanını true olarak güncelle
            await prisma.order.update({
                where: { id: orderId },
                data: { isInvoiceCreated: true },
            });
            console.log(`Processing Order ID: ${orderId}`);

            return await this.invoiceService.createInvoiceWithRelations(invoiceData);
        } catch (error) {
            console.error("Error creating invoice from order:", error);
            throw new Error(error instanceof Error ? error.message : "Fatura oluşturulamadı.");
        }
    }

    // Yeni metod
    async createInvoicesFromOrders(orderIds: string[]): Promise<any[]> {
        const results: any[] = [];
        for (const orderId of orderIds) {
            try {
                const result = await this.createInvoiceFromOrder(orderId);
                results.push({ orderId, result, status: "success" });
            } catch (error) {
                console.error(`Error processing Order ID '${orderId}':`, error);
                results.push({ orderId, error: error, status: "failed" });
            }
        }
        return results;
    }

    async createInvoicesForPendingOrders(): Promise<{ success: boolean; message: string; data?: any[] }> {
        try {
            // 1. isInvoiceCreated alanı false olan siparişleri getir
            const pendingOrders = await prisma.order.findMany({
                where: { isInvoiceCreated: false },
                select: { id: true }, // Sadece sipariş ID'lerini al
            });
    
            if (!pendingOrders.length) {
                return {
                    success: false,
                    message: "Fatura oluşturulmamış sipariş bulunamadı.",
                    data: [],
                };
            }
    
            console.log(`Toplam ${pendingOrders.length} sipariş için fatura oluşturulacak.`);
    
            // 2. Her sipariş için createInvoiceFromOrder metodunu çalıştır
            const orderIds = pendingOrders.map((order) => order.id);
            const results = await this.createInvoicesFromOrders(orderIds); // Mevcut createInvoicesFromOrders metodunu kullanıyoruz
    
            return {
                success: true,
                message: `${results.length} sipariş için fatura başarıyla oluşturuldu.`,
                data: results,
            };
        } catch (error) {
            console.error("Fatura oluşturma işlemi sırasında hata oluştu:", error);
            throw new Error("Fatura oluşturma işlemi başarısız oldu.");
        }
    }

    async getPendingInvoiceCount(): Promise<{ success: boolean; message: string; count: number }> {
        try {
            // isInvoiceCreated: false olan siparişlerin sayısını al
            const count = await prisma.order.count({
                where: { isInvoiceCreated: false },
            });
    
            if (count === 0) {
                return {
                    success: false,
                    message: "Fatura oluşturulmamış sipariş bulunamadı.",
                    count: 0,
                };
            }
    
            return {
                success: true,
                message: `Fatura oluşturulmamış toplam ${count} sipariş bulundu.`,
                count,
            };
        } catch (error) {
            console.error("Pending invoice count kontrolü sırasında hata oluştu:", error);
            throw new Error("Pending invoice count kontrolü başarısız oldu.");
        }
    }
    
    async toggleAutoInvoiceCreation(storeId: string): Promise<{ success: boolean; message: string; updatedValue: boolean }> {
        try {
            // Mevcut store'u kontrol et
            const store = await prisma.store.findUnique({
                where: { id: storeId },
                select: { autoInvoiceCreation: true },
            });
    
            if (!store) {
                throw new Error(`Store with ID '${storeId}' not found.`);
            }
    
            // Mevcut değeri tersine çevir
            const newValue = !store.autoInvoiceCreation;
    
            // Güncelle
            const updatedStore = await prisma.store.update({
                where: { id: storeId },
                data: { autoInvoiceCreation: newValue },
            });
    
            return {
                success: true,
                message: `Store ID ${storeId} için autoInvoiceCreation değeri güncellendi.`,
                updatedValue: updatedStore.autoInvoiceCreation,
            };
        } catch (error) {
            console.error("autoInvoiceCreation güncellenirken hata oluştu:", error);
            throw new Error("autoInvoiceCreation güncellenirken bir hata oluştu.");
        }
    }    
    
}
