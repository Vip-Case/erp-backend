import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OrderService = {
  /**
   * WooCommerce'den gelen veriyi dönüştürür.
   * @param webhookData WooCommerce webhook verisi
   * @returns Prisma modeline uygun veri
   */
  transformWooCommerceOrder: (webhookData: any) => {
    if (!webhookData || (!webhookData.id && typeof webhookData.id !== "number")) {
      throw new Error("Webhook verisi eksik veya geçersiz ID.");
  }

  const platformOrderId = webhookData.id.toString();
    // Dönüştürülmüş item verisi
    const items = webhookData.line_items?.map((item: any) => {
      if (!item.sku || item.quantity <= 0) {
        throw new Error(`Ürün bilgisi eksik veya hatalı: ${JSON.stringify(item)}`);
      }

      return {
        stockCardId: item.sku,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.total),
      };
    });

    if (!items || items.length === 0) {
      throw new Error("Siparişin ürün bilgisi eksik (line_items).");
    }

    // Billing Address Dönüştürme
    const billingAddress = webhookData.billing
      ? {
          address: webhookData.billing.address_1 || "unknown-address",
          city: webhookData.billing.city || "unknown-city",
          district: webhookData.billing.state || "unknown-district",
          postalCode: webhookData.billing.postcode || "00000",
          country: webhookData.billing.country || "unknown-country",
          fullName: `${webhookData.billing.first_name || ""} ${
            webhookData.billing.last_name || ""
          }`.trim(),
          email: webhookData.billing.email || "unknown@example.com",
          paymentMethod: webhookData.payment_method || "unknown-payment-method",
          transactionId: webhookData.transaction_id || "unknown-transaction-id",
        }
      : null;

    // Shipping Address Dönüştürme
    const shippingAddress = webhookData.shipping
      ? {
          address: webhookData.shipping.address_1 || billingAddress?.address || "unknown-address",
          city: webhookData.shipping.city || billingAddress?.city || "unknown-city",
          district: webhookData.shipping.state || billingAddress?.district || "unknown-district",
          postalCode: webhookData.shipping.postcode || billingAddress?.postalCode || "00000",
          country: webhookData.shipping.country || billingAddress?.country || "unknown-country",
          fullName: `${webhookData.shipping.first_name || ""} ${
            webhookData.shipping.last_name || ""
          }`.trim(),
        }
      : billingAddress;

    return {
      platformOrderId,
      platform: "woocommerce",
      customerId: webhookData.customer_id?.toString() || "unknown-customer-id",
      status: webhookData.status || "pending",
      currency: webhookData.currency || "USD",
      orderDate: webhookData.date_created
        ? new Date(webhookData.date_created)
        : new Date(),
      shippingAddress,
      billingAddress,
      items,
      cargos: [], // WooCommerce'den kargo bilgisi gelmiyorsa boş bırakılır
      totalPrice: parseFloat(webhookData.total) || 0,
    };
  }, 

  /**
   * Sipariş oluşturma servisi
   * @param orderData Prisma modeline uygun dönüştürülmüş veri
   * @returns Oluşturulan sipariş
   */
  createOrder: async (orderData: any) => {
    try {
      const existingStockCards = await prisma.stockCard.findMany({
        where: {
          id: { in: orderData.items.map((item: any) => item.stockCardId) },
        },
      });

      const existingStockCardIds = existingStockCards.map((card) => card.id);

      // Eksik StockCard'ları oluştur
      const missingStockCards = orderData.items
        .filter((item: any) => !existingStockCardIds.includes(item.stockCardId))
        .map((item: any) => ({
          id: item.stockCardId,
          productCode: item.stockCardId,
          productName: item.stockCardId,
        }));

      if (missingStockCards.length > 0) {
        await prisma.stockCard.createMany({ data: missingStockCards });
      }

      let shippingAddressId: string | null = null;
      let billingAddressId: string | null = null;

      // Shipping Address ekle
      if (orderData.shippingAddress) {
        const shippingAddress = await prisma.orderInvoiceAddress.create({
          data: {
            address: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            district: orderData.shippingAddress.district,
            postalCode: orderData.shippingAddress.postalCode,
            country: orderData.shippingAddress.country,
            fullName: orderData.shippingAddress.fullName,
            email: null,
            paymentMethod: null,
            transactionId: null,
          },
        });
        shippingAddressId = shippingAddress.id;
      }

      // Billing Address ekle
      if (orderData.billingAddress) {
        const isSameAsShipping =
          JSON.stringify(orderData.billingAddress) ===
          JSON.stringify({
            address: orderData.shippingAddress?.address,
            city: orderData.shippingAddress?.city,
            district: orderData.shippingAddress?.district,
            postalCode: orderData.shippingAddress?.postalCode,
            country: orderData.shippingAddress?.country,
            fullName: orderData.shippingAddress?.fullName,
          });

        if (isSameAsShipping && shippingAddressId) {
          billingAddressId = shippingAddressId; // Aynıysa Shipping ID kullanılır
        } else {
          const billingAddress = await prisma.orderInvoiceAddress.create({
            data: {
              address: orderData.billingAddress.address,
              city: orderData.billingAddress.city,
              district: orderData.billingAddress.district,
              postalCode: orderData.billingAddress.postalCode,
              country: orderData.billingAddress.country,
              fullName: orderData.billingAddress.fullName,
              email: orderData.billingAddress.email || "unknown@example.com",
              paymentMethod: orderData.billingAddress.paymentMethod || null,
              transactionId: orderData.billingAddress.transactionId || null,
            },
          });
          billingAddressId = billingAddress.id;
        }
      } else {
        billingAddressId = shippingAddressId; // Billing Address verilmediyse Shipping ID kullanılır
      }

      // Siparişi oluştur
      const order = await prisma.order.create({
        data: {
          platformOrderId: orderData.platformOrderId,
          platform: orderData.platform,
          customerId: orderData.customerId,
          status: orderData.status,
          currency: orderData.currency,
          orderDate: orderData.orderDate,
          shippingAddressId: shippingAddressId || null,
          billingAddressId: billingAddressId || null,
          items: { create: orderData.items },
          cargos: { create: orderData.cargos },
          totalPrice: orderData.totalPrice,
        },
        include: {
          shippingAddress: true,
          billingAddress: true,
          items: true,
          cargos: true,
        },
      });

      return order;
    } catch (error) {
      console.error("Order creation error:", error);
      throw new Error("Sipariş oluşturulamadı.");
    }
  },

  updateOrder: async (orderId: string, updateData: any) => {
    try {
        // Siparişi bul
        const existingOrder = await prisma.order.findFirst({
            where: { platformOrderId: orderId },
            include: {
                shippingAddress: true,
                billingAddress: true,
                items: true,
            },
        });

        if (!existingOrder) {
            throw new Error("Sipariş bulunamadı.");
        }

        let shippingAddressId = existingOrder.shippingAddressId;
        let billingAddressId = existingOrder.billingAddressId;

        // Shipping Address işlemleri
        if (updateData.shippingAddress) {
            if (shippingAddressId) {
                await prisma.orderInvoiceAddress.update({
                    where: { id: shippingAddressId },
                    data: updateData.shippingAddress,
                });
            } else {
                const newShippingAddress = await prisma.orderInvoiceAddress.create({
                    data: updateData.shippingAddress,
                });
                shippingAddressId = newShippingAddress.id;
            }
        }

        // Billing Address işlemleri
        if (updateData.billingAddress) {
            const isSameAsShipping =
                JSON.stringify(updateData.billingAddress) ===
                JSON.stringify(updateData.shippingAddress);

            if (isSameAsShipping && shippingAddressId) {
                billingAddressId = shippingAddressId;
            } else if (billingAddressId) {
                await prisma.orderInvoiceAddress.update({
                    where: { id: billingAddressId },
                    data: updateData.billingAddress,
                });
            } else {
                const newBillingAddress = await prisma.orderInvoiceAddress.create({
                    data: updateData.billingAddress,
                });
                billingAddressId = newBillingAddress.id;
            }
        }

        // Items işlemleri
        if (updateData.items) {
          // Aynı stockCardId değerlerini birleştir
          const uniqueItems = updateData.items.reduce((acc: any[], item: { stockCardId: string; quantity: number; totalPrice: number }) => {
              const existing = acc.find((i) => i.stockCardId === item.stockCardId);
              if (existing) {
                  existing.quantity += item.quantity;
                  existing.totalPrice += item.totalPrice;
              } else {
                  acc.push(item);
              }
              return acc;
          }, [] as { stockCardId: string; quantity: number; totalPrice: number }[]);
      
          await prisma.orderItem.deleteMany({ where: { orderId: existingOrder.id } });
      
          await prisma.orderItem.createMany({
              data: uniqueItems.map((item: { stockCardId: string; quantity: number; totalPrice: number }) => ({
                  ...item,
                  orderId: existingOrder.id,
              })),
          });
      }
      
      // Siparişi güncelle
      const updatedOrder = await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
              status: updateData.status || existingOrder.status,
              currency: updateData.currency || existingOrder.currency,
              orderDate: updateData.orderDate || existingOrder.orderDate,
              shippingAddressId,
              billingAddressId,
              totalPrice: updateData.totalPrice || existingOrder.totalPrice,
          },
          include: {
              shippingAddress: true,
              billingAddress: true,
              items: true,
              cargos: true,
          },
      });

      console.log("Sipariş Güncellendi:", updatedOrder);
      return updatedOrder;
    } catch (error) {
        console.error("Order update error:", error);
        throw new Error("Sipariş güncellenemedi.");
    }
  },


  /**
   * Tüm siparişleri getirir.
   * @returns Siparişler listesi
   */
  getAllOrders: async () => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc", // Son eklenen ilk sırada
        },

      });

      return orders;
    } catch (error) {
      console.error("Get all orders error:", error);
      throw new Error("Siparişler alınamadı.");
    }
  },

  getAllOrdersWithDetails: async () => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc", // Son eklenen ilk sırada
        },
        
        include: {
          items: true,
        },

      });

      return orders;
    } catch (error) {
      console.error("Get all orders error:", error);
      throw new Error("Siparişler alınamadı.");
    }
  },

  getAllOrdersWithInfos: async () => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc", // Son eklenen ilk sırada
        },
        
        include: {
          shippingAddress: true,
          billingAddress: true,
          items: true,
          cargos: true,
        },

      });

      return orders;
    } catch (error) {
      console.error("Get all orders error:", error);
      throw new Error("Siparişler alınamadı.");
    }
  },

};



export default OrderService;
