import { PrismaClient } from "@prisma/client";
import { WooCommerceAdapter } from "../adapters/wooCommerceAdapter";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {

  // StockCard modelinde bir update işlemi gerçekleştiğinde
  if (params.model === "StockCard" && params.action === "update") {
    const updatedData = params.args.data;

    const stockCard = await prisma.stockCard.findUnique({
      where: { id: params.args.where.id },
      include: {
        stockCardWarehouse: true,   // Stok miktarını almak için ilişkiyi dahil ediyoruz
        stockCardPriceLists: true,  // Fiyat listesini almak için ilişkiyi dahil ediyoruz
      },
    });

    if (stockCard) {
      // Stok miktarını StockCardWarehouse'dan alıyoruz
      const warehouseStock = stockCard.stockCardWarehouse.length > 0
        ? stockCard.stockCardWarehouse[0].quantity // Stok miktarını buradan alıyoruz
        : 0;

      // Fiyatı StockCardPriceLists'ten alıyoruz (ilk fiyat listesi örneği)
      const priceListItem = stockCard.stockCardPriceLists[0]; // Örnek: ilk fiyat listesi
      const price = priceListItem ? priceListItem.price : 0; // Fiyat bulunmazsa 0

      // WooCommerce ile senkronizasyon
      const wooAdapter = new WooCommerceAdapter(
        "https://your-store-url.com",
        "consumer-key",
        "consumer-secret"
      );

      try {
        // WooCommerce ürününü güncelle
        await wooAdapter.updateProduct(stockCard.productCode, {
          name: updatedData.productName || stockCard.productName,
          price: updatedData.price || price,  // Fiyatı güncelliyoruz
          stock_quantity: updatedData.stockQuantity || warehouseStock,  // Stok miktarını güncelliyoruz
          stock_status: updatedData.stockStatus ? "instock" : "outofstock", // Stok durumu
        });
        console.log(`WooCommerce ürünü güncellendi: ${stockCard.productCode}`);
      } catch (error) {
        console.error("WooCommerce ürün güncellenirken hata:", error);
      }
    }
  }

  // Varsayılan olarak işlem devam eder
  return next(params);
});
