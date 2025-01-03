import { PrismaClient, Prisma } from "@prisma/client";
import { OrderInvoiceService } from "./orderInvoiceService";

const prisma = new PrismaClient();
export enum InstitutionType {
  Sirket = "Sirket",
  Sahis = "Sahis",
}

export enum CurrentType {
  AliciSatici = "AliciSatici",
  Alici = "Alici",
  Satici = "Satici",
  Kurum = "Kurum",
  Personel = "Personel",
  SanalPazar = "SanalPazar",
  AnaGrupSirketi = "AnaGrupSirketi",
  Ithalat = "Ithalat",
  Ihracat = "Ihracat",
  IthalatIhracat = "IthalatIhracat",
  Musteri = "Musteri",
  Tedarikci = "Tedarikci",
  Diger = "Diger",
}

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

    const metaStore = webhookData.meta_data?.find((m: any) => m.key === "store_id");
    // Eğer meta_store bulunmazsa, fallback bir store ID verebilirsiniz
    const storeId = metaStore?.value;
    const finalStoreId = storeId || process.env.DEFAULT_STORE_ID;

    // Ürünleri dönüştürme
    const items = webhookData.line_items?.map((item: any) => {
      const stockCardId = item.sku?.trim() || item.product_id?.toString();

      if (!stockCardId || item.quantity <= 0) {
        throw new Error(`Ürün bilgisi eksik veya hatalı: ${JSON.stringify(item)}`);
      }

      return {
        stockCardId,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.total),
      };
    });

    if (!items || items.length === 0) {
      throw new Error("Siparişin ürün bilgisi eksik (line_items).");
    }

    // Fatura adresi dönüştürme
    const billingAddress = webhookData.billing
      ? {
        address: webhookData.billing.address_1 || "unknown-address",
        city: webhookData.billing.city || "unknown-city",
        district: webhookData.billing.state || "unknown-district",
        postalCode: webhookData.billing.postcode || "00000",
        country: webhookData.billing.country || "unknown-country",
        fullName: `${webhookData.billing.first_name || ""} ${webhookData.billing.last_name || ""}`.trim(),
        email: webhookData.billing.email || null,
        paymentMethod: webhookData.payment_method || null,
        transactionId: webhookData.transaction_id || null,
      }
      : null;

    // Kargo adresi dönüştürme
    const shippingAddress = webhookData.shipping
      ? {
        address: webhookData.shipping.address_1 || billingAddress?.address || "unknown-address",
        city: webhookData.shipping.city || billingAddress?.city || "unknown-city",
        district: webhookData.shipping.state || billingAddress?.district || "unknown-district",
        postalCode: webhookData.shipping.postcode || billingAddress?.postalCode || "00000",
        country: webhookData.shipping.country || billingAddress?.country || "unknown-country",
        fullName: `${webhookData.shipping.first_name || ""} ${webhookData.shipping.last_name || ""}`.trim(),
      }
      : billingAddress;

    return {
      storeId: finalStoreId,
      platformOrderId,
      platform: "woocommerce",
      customerId: webhookData.customer_id?.toString() || null,
      status: webhookData.status || "pending",
      currency: webhookData.currency || "USD",
      orderDate: webhookData.date_created ? new Date(webhookData.date_created) : new Date(),
      shippingAddress,
      billingAddress,
      items,
      cargos: [],
      totalPrice: parseFloat(webhookData.total) || 0,
    };
  },

  /**
   * Adresleri kontrol eder veya oluşturur.
   * @param addressData Adres bilgileri
   * @returns Mevcut veya yeni oluşturulmuş adres
   */
  findOrCreateAddress: async (addressData: any) => {
    const existingAddress = await prisma.orderInvoiceAddress.findFirst({
      where: {
        address: addressData.address.trim(),
        city: addressData.city,
        district: addressData.district,
        postalCode: addressData.postalCode,
        country: addressData.country,
      },
    });

    if (existingAddress) {
      return existingAddress;
    }

    return await prisma.orderInvoiceAddress.create({
      data: {
        fullName: addressData.fullName.trim(),
        address: addressData.address.trim(),
        city: addressData.city,
        district: addressData.district,
        postalCode: addressData.postalCode,
        country: addressData.country,
        email: addressData.email || null,
        paymentMethod: addressData.paymentMethod || null,
        transactionId: addressData.transactionId || null,
      },
    });
  },

  /**
   * Sipariş oluşturma servisi
   * @param orderData Prisma modeline uygun dönüştürülmüş veri
   * @returns Oluşturulan sipariş
   */
  createOrder: async (orderData: any) => {
    try {
      if (!orderData || typeof orderData !== "object") {
        throw new Error("Eksik veri: 'orderData' nesnesi bulunamadı.");
      }

      // 1. Store doğrulama veya belirleme
      let storeId = orderData.storeId;

      // Eğer storeId verilmediyse storeUrl üzerinden bulmaya çalış
      if (!storeId && orderData.storeUrl) {
        const store = await prisma.store.findFirst({
          where: { storeUrl: orderData.storeUrl },
        });

        if (!store) {
          throw new Error(`Store bulunamadı: storeUrl -> ${orderData.storeUrl}`);
        }

        storeId = store.id; // Bulunan Store ID
      }

      if (!storeId) {
        throw new Error("Sipariş oluşturmak için geçerli bir Store ID gerekli.");
      }

      // 2. Adresleri kontrol et veya oluştur
      const billingAddress = await OrderService.findOrCreateAddress(orderData.billingAddress);
      const shippingAddress = await OrderService.findOrCreateAddress(orderData.shippingAddress);

      // Current eşleşmesini kontrol et veya oluştur
      let current = await prisma.current.findFirst({
        where: {
          OR: [
            { identityNo: orderData.identityNo },
            { taxNumber: orderData.taxNumber },
            { currentName: billingAddress.fullName?.trim() },
          ],
        },
      });

      if (!current) {
        current = await prisma.current.create({
          data: {
            currentCode: `C-${new Date().getTime()}`,
            currentName: billingAddress.fullName || "Unknown Customer",
            identityNo: orderData.identityNo || null,
            taxNumber: orderData.taxNumber || "000000000",
            taxOffice: orderData.taxOffice || "Unknown Tax Office",
            name: billingAddress.fullName?.split(" ")[0] || "Unknown",
            surname: billingAddress.fullName?.split(" ")[1] || "Unknown",
            priceListId: "cm56mf2dv00079omghohkjeee", // Aktif fiyat listesini buraya yerleştirin
            currentType: CurrentType.AliciSatici,
            institution: orderData.isCorporate ? InstitutionType.Sirket : InstitutionType.Sahis,
          },
        });
      }

      // 3. Ürünlerin doğrulanması ve eşleştirilmesi
      const stockCardIds = orderData.items.map((item: any) => item.stockCardId?.trim());
      const validStockCards = await prisma.stockCard.findMany({
        where: {
          OR: [{ id: { in: stockCardIds } }, { productCode: { in: stockCardIds } }],
        },
      });

      const validStockCardMap = validStockCards.reduce((acc: Record<string, string>, stockCard) => {
        acc[stockCard.productCode || stockCard.id] = stockCard.id; // Hem productCode hem de id ile eşleşme
        return acc;
      }, {});

      const processedItems = orderData.items.map((item: any) => {
        const stockCardId = validStockCardMap[item.stockCardId?.trim() || ""] || null;

        if (!stockCardId) {
          console.warn(`StockCard bulunamadı: ${item.stockCardId}`);
        }

        return {
          stockCardId,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          totalPrice: parseFloat(item.totalPrice.toString()),
        };
      });
      console.log("Processed Items:", processedItems);

      // 4. Sipariş oluşturma
      const order = await prisma.order.create({
        data: {
          storeId, // Burada doğrulanmış storeId kullanılıyor
          platformOrderId: orderData.platformOrderId,
          platform: orderData.platform,
          customerId: current.id,
          status: orderData.status,
          currency: orderData.currency,
          orderDate: new Date(orderData.orderDate),
          totalPrice: orderData.totalPrice,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          items: { create: processedItems }
        },
        include: {
          items: true,
          store: true,
        },
      });

      // 5. Stok güncellemesi
      await prisma.$transaction(async (prisma) => {
        for (const item of processedItems) {
          
          const stockCardWarehouse = await prisma.stockCardWarehouse.findFirst({
            where: { stockCardId: item.stockCardId },
          });

          if (!stockCardWarehouse) {
            throw new Error(
              `Stok bulunamadı: StockCardId ${item.stockCardId}`
            );
          }
          const newQuantity = stockCardWarehouse.quantity.toNumber() - item.quantity;
      
          if (newQuantity < 0) {
            throw new Error(
              `Stok yetersiz: StockCardId ${item.stockCardId}, Mevcut Stok: ${stockCardWarehouse.quantity.toNumber()}, Azaltılacak Miktar: ${item.quantity}`
            );
          }
      
          await prisma.stockCardWarehouse.update({
            where: { id: stockCardWarehouse.id },
            data: {
              quantity: new Prisma.Decimal(newQuantity),
            },
          });
      
          console.log(
            `Stok güncellendi: StockCardId ${item.stockCardId}, Yeni Stok: ${newQuantity}`
          );
        }
      });
      

      // 6. Fatura oluşturma (eğer otomatik etkinse)
      if (order.store.autoInvoiceCreation) {
        const orderInvoiceService = new OrderInvoiceService();
        await orderInvoiceService.createInvoiceFromOrder(order.id);
      }

      console.log("Sipariş başarıyla oluşturuldu:", order.id);
      return order;
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error || error);
      throw new Error("Sipariş oluşturulamadı.");
    }
  },

  updateOrder: async (orderId: string, updateData: any) => {
    try {
      console.log("Update Webhook Verisi:", updateData);
  
      const existingOrder = await prisma.order.findFirst({
        where: { platformOrderId: orderId.toString() },
        include: {
          shippingAddress: true,
          billingAddress: true,
        },
      });
  
      if (!existingOrder) {
        throw new Error(`Sipariş bulunamadı. Order ID: ${orderId}`);
      }
  
      const updatedOrder = await prisma.order.update({
        where: { id: existingOrder.id }, // ID ile güncelleme yapılabilir
        data: {
          status: updateData.status || existingOrder.status,
          currency: updateData.currency || existingOrder.currency,
          orderDate: updateData.orderDate || existingOrder.orderDate,
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
