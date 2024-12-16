import { PrismaClient, MarketPlaceCategories, StockCard, StockUnits, ProductType, Warehouse, StockCardWarehouse } from "@prisma/client";
import { WooCommerceAdapter } from "../../adapters/wooCommerceAdapter";

const prisma = new PrismaClient();

interface WooCategory {
  id: number | string;
  name: string;
  parent?: number | string | null;
  children?: WooCategory[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  short_description: string;
  regular_price: string | null;
  sale_price: string | null;
  barcode: string | null;
  categories: WooCategory[];
  price?: string | null; // WooCommerce'den gelen fiyat değeri
  brand?: {
    id: number | string;
    name: string;
  };
  attributes?: {
    id: number | string;
    name: string;
    options: string[];
  }[];
  images?: {
    src: string;
  }[];
  marketPlaceProductIds?: string[];
  type?: string; // "variable"
  parentProductId?: string | null;
}

export class WooCommerceService {
  private wooCommerce: WooCommerceAdapter;

  constructor() {
    const baseUrl = process.env.WC_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!baseUrl || !consumerKey || !consumerSecret) {
      throw new Error("WooCommerce bağlantı bilgileri eksik! Lütfen .env dosyasını kontrol edin.");
    }

    this.wooCommerce = new WooCommerceAdapter(baseUrl, consumerKey, consumerSecret);
  }

  // WooCommerce'den tüm ürünleri çekmek için yeni bir yardımcı metot
  private async fetchAllProducts(): Promise<Product[]> {
    const allProducts: Product[] = [];
    let page = 1;

    while (true) {
      const products = await this.wooCommerce.getProducts({ page, per_page: 100 });
      if (!products.length) break;
      allProducts.push(...products);
      page++;
    }

    return allProducts;
  }

  async getAllProductAttributes() {
    try {
      const products = await prisma.marketPlaceProducts.findMany({
        include: {
          marketPlaceAttributes: true, // Her ürünün ilişkili attribute'larını getirir
        },
      });

      if (!products.length) {
        console.log("No products found");
        return [];
      }

      const formattedProducts = products.map((product) => {
        const attributeMap: { [key: string]: string[] } = {};

        if (Array.isArray(product.marketPlaceAttributes)) {
          product.marketPlaceAttributes.forEach((attribute) => {
            if (attribute.attributeName && attribute.valueName) {
              const values = attribute.valueName.split(",").map((v) => v.trim());

              if (attributeMap[attribute.attributeName]) {
                attributeMap[attribute.attributeName].push(...values);
              } else {
                attributeMap[attribute.attributeName] = values;
              }
            }
          });
        }

        const attributes = Object.entries(attributeMap).map(([attributeName, valueNames]) => ({
          attributeName,
          valueNames: [...new Set(valueNames)], // Duplicate değerleri kaldır
        }));

        return {
          productId: product.id,
          productName: product.productName,
          attributes,
        };
      });

      console.log("Formatted Products with Attributes:", JSON.stringify(formattedProducts, null, 2));
      return formattedProducts;
    } catch (error) {
      console.error("Error fetching formatted products with attributes:", error);
      throw new Error("Error fetching formatted products with attributes");
    }
  }

  private async findOrCreateCategoryWithParents(categoryData: { id: number | string; name: string; parentId?: number | string | null }): Promise<MarketPlaceCategories> {
    let existingCategory = await prisma.marketPlaceCategories.findFirst({
      where: { marketPlaceCategoryId: categoryData.id.toString() },
    });

    if (!existingCategory) {
      let parentCategoryId: string | null = null;
      if (categoryData.parentId && categoryData.parentId !== 0 && categoryData.parentId !== "0") {
        const parentCategory = await this.findOrCreateCategoryWithParents({
          id: categoryData.parentId,
          name: "Parent Kategori",
        });
        parentCategoryId = parentCategory.id;
      }

      existingCategory = await prisma.marketPlaceCategories.create({
        data: {
          marketPlaceCategoryId: categoryData.id.toString(),
          categoryName: categoryData.name,
          marketPlaceCategoryParentId: parentCategoryId,
        },
      });
    }

    return existingCategory;
  }

  private async getAllCategoryConnections(category: WooCategory): Promise<{ id: string }[]> {
    const finalCategory = await this.findOrCreateCategoryWithParents({
      id: category.id,
      name: category.name,
      parentId: category.parent || null,
    });

    let connections = [{ id: finalCategory.id }];

    if (category.children && Array.isArray(category.children)) {
      for (const childCat of category.children) {
        const childConnections = await this.getAllCategoryConnections(childCat);
        connections.push(...childConnections);
      }
    }

    return connections;
  }

  private async getProductVariations(productId: string | number): Promise<Product[]> {
    // WooCommerce varyasyon endpoint'i: `/wp-json/wc/v3/products/{id}/variations`
    const variations = await this.wooCommerce.getProductVariations(productId);

    // Ana ürünün kategorilerini al
    const parentProduct = await prisma.marketPlaceProducts.findFirst({
      where: { productId: productId.toString() },
      include: { MarketPlaceCategories: true },
    });

    return variations.map((variation: any): Product => ({
      id: variation.id.toString(),
      name: variation.name,
      sku: variation.sku,
      description: variation.description || "",
      short_description: variation.short_description || "",
      regular_price: variation.regular_price || null,
      sale_price: variation.sale_price || null,
      barcode: variation.barcode || null,
      categories: parentProduct
        ? parentProduct.MarketPlaceCategories.map((cat) => ({
          id: cat.id.toString(),
          name: cat.categoryName || "Unknown Category", // Burada değişiklik yapıldı
          parent: null, // Eğer parent bilgisi varsa ekleyin
          children: [], // Eğer varsa
        }))
        : [],
      price: variation.price || null,
      brand: undefined, // Varyasyonlar genellikle marka bilgisine sahip olmaz
      attributes: variation.attributes
        ? variation.attributes.map((attr: any) => ({
          id: attr.id ? attr.id.toString() : undefined,
          name: attr.name,
          options: [attr.option],
        }))
        : [],
      images: variation.images
        ? variation.images.map((img: any) => ({ src: img.src }))
        : [],
      marketPlaceProductIds: [],
      type: "variation",
      parentProductId: null, // Sync sırasında ayarlanacak
    }));
  }

  private async processProduct(product: Product, store: any): Promise<any> {
    if (!product.sku || product.sku.trim() === "") {
      console.warn(`Hatalı ürün: ${product.name}. productSku eksik.`);
      return; // Ürünü işleme devam etme
    }

    const price = product.price ? parseFloat(product.price) : null;
    const productTypeValue = product.type || "simple";
    const parentIdValue = product.type === "variation" ? product.parentProductId || null : null;

    const existingProduct = await prisma.marketPlaceProducts.findFirst({
      where: { productSku: product.sku },
    });

    const marketplaceProduct = existingProduct
      ? await prisma.marketPlaceProducts.update({
        where: { id: existingProduct.id },
        data: {
          productId: product.id?.toString() || null,
          productName: product.name,
          productSku: product.sku,
          description: product.description || "",
          shortDescription: product.short_description || "",
          listPrice: price,
          salePrice: price,
          barcode: product.barcode || null,
          storeId: store?.id || null,
          productType: productTypeValue,
          parentProductId: parentIdValue,
        },
      })
      : await prisma.marketPlaceProducts.create({
        data: {
          productId: product.id?.toString() || null,
          productName: product.name,
          productSku: product.sku,
          description: product.description,
          shortDescription: product.short_description,
          listPrice: price,
          salePrice: price,
          barcode: product.barcode || null,
          storeId: store?.id || null,
          productType: productTypeValue,
          parentProductId: parentIdValue,
        },
      });

    if (product.categories?.length) {
      const allConnections = (await Promise.all(
        product.categories.map((cat) => this.getAllCategoryConnections(cat))
      )).flat();

      const uniqueCategoryIds = Array.from(new Set(allConnections.map((c) => c.id)));

      await prisma.marketPlaceProducts.update({
        where: { id: marketplaceProduct.id },
        data: {
          MarketPlaceCategories: {
            connect: uniqueCategoryIds.map((id) => ({ id })),
          },
        },
      });
    }

    if (product.brand) {
      let existingBrand = await prisma.marketPlaceBrands.findFirst({
        where: { marketPlaceBrandId: product.brand.id.toString() },
      });

      if (!existingBrand) {
        existingBrand = await prisma.marketPlaceBrands.create({
          data: {
            marketPlaceBrandId: product.brand.id.toString(),
            brandName: product.brand.name,
          },
        });
      }

      await prisma.marketPlaceProducts.update({
        where: { id: marketplaceProduct.id },
        data: { marketPlaceBrandsId: existingBrand.id },
      });
    }

    if (product.attributes?.length) {
      for (const attribute of product.attributes) {
        const valueString = Array.from(new Set(attribute.options.map((v) => v.trim()))).join(", ");

        let existingAttribute = await prisma.marketPlaceAttributes.findFirst({
          where: { attributeName: attribute.name, valueName: valueString },
        });

        if (!existingAttribute) {
          existingAttribute = await prisma.marketPlaceAttributes.create({
            data: {
              attributeMarketPlaceId: attribute.id?.toString() || null,
              attributeName: attribute.name,
              valueName: valueString,
            },
          });
        }

        await prisma.marketPlaceProducts.update({
          where: { id: marketplaceProduct.id },
          data: {
            marketPlaceAttributes: { connect: { id: existingAttribute.id } },
          },
        });
      }
    }

    if (product.images?.length) {
      const existingImageUrls = (
        await prisma.marketPlaceProductImages.findMany({
          where: { marketPlaceProductId: marketplaceProduct.id },
          select: { imageUrl: true },
        })
      ).map((img) => img.imageUrl);

      const newImages = product.images
        .filter((img) => !existingImageUrls.includes(img.src))
        .map((img) => ({
          imageUrl: img.src,
          marketPlaceProductId: marketplaceProduct.id,
        }));

      if (newImages.length > 0) {
        await prisma.marketPlaceProductImages.createMany({ data: newImages, skipDuplicates: true });
      }
    }

    if (product.type === "variable") {
      const variations = await this.getProductVariations(product.id);

      for (const variation of variations) {
        variation.parentProductId = marketplaceProduct.id;
        await this.processProduct(variation, store);
      }
    }

    return marketplaceProduct;
  }

  async syncProducts(storeId: string | null): Promise<void> {
    try {
      const store = storeId
        ? await prisma.store.findFirst({ where: { id: storeId } })
        : null;

      const products = await this.fetchAllProducts();

      for (const product of products) {
        await this.processProduct(product, store);
      }

      console.log("All products synchronized.");
    } catch (error) {
      console.error("Error syncing products:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }


  async addToStockCard(productIds: string[] = [], branchCode?: string): Promise<void> {
    try {
      // Seçilen ürünleri veritabanından al
      const selectedProducts = await prisma.marketPlaceProducts.findMany({
        where: {
          id: { in: productIds },
        },
        include: {
          marketPlaceBrands: true,
          store: {
            include: {
              marketPlace: {
                include: {
                  company: true, // MarketPlace ile ilişkili company bilgisi alınır
                },
              },
            },
          },
          marketPlaceAttributes: true,
        },
      });

      if (!selectedProducts.length) {
        console.log("Seçilen ürünler bulunamadı.");
        return;
      }

      // StockCard oluşturma veya güncelleme döngüsü
      for (const product of selectedProducts) {
        if (!product.productSku || !product.productName) {
          const errorMessage = `Hatalı ürün: ${product.productName}. productSku eksik.`;
          console.error(errorMessage);
          continue;

        }

        // Branch doğrulama
        if (branchCode) {
          const branchExists = await prisma.branch.findUnique({
            where: { branchCode },
          });

          if (!branchExists) {
            console.error(`Branch bulunamadı: ${branchCode}`);
            continue;
          }
        }

        // Store ile ilişkili MarketPlace bilgisi üzerinden company bilgisi kontrol edilir
        const store = product.store;
        let companyCode: string | null = null;

        if (store?.marketPlace?.company) {
          companyCode = store.marketPlace.company.companyCode; // MarketPlace ile ilişkili companyCode alınır
        } else {
          console.error(`MarketPlace ilişkili company bulunamadı: ${store?.marketPlace?.id}`);
          continue;
        }

        // StockCard kontrol et
        const existingStockCard = await prisma.stockCard.findUnique({
          where: { productCode: product.productSku },
        });

        let stockCard;
        if (!existingStockCard) {
          // StockCard oluştur
          stockCard = await prisma.stockCard.create({
            data: {
              productCode: product.productSku,
              productName: product.productName,
              unit: StockUnits.Adet,
              shortDescription: product.shortDescription || "",
              description: product.description || "",
              brandId: product.marketPlaceBrands?.id || null,
              productType: mapProductType(product.productType),
              companyCode: companyCode, // Company Code ekleniyor
              branchCode: branchCode,
              Store: store
                ? {
                  connect: {
                    id: store.id,
                  },
                }
                : undefined,
            },
          });
          console.log(`StockCard oluşturuldu: ${product.productName} (SKU: ${product.productSku})`);
        } else {
          // StockCard güncelle
          stockCard = await prisma.stockCard.update({
            where: { productCode: product.productSku },
            data: {
              productName: product.productName,
              unit: StockUnits.Adet,
              shortDescription: product.shortDescription || "",
              description: product.description || "",
              brandId: product.marketPlaceBrands?.id || null,
              productType: mapProductType(product.productType),
              companyCode: companyCode, // Company Code ekleniyor
              branchCode: branchCode,
              Store: store
                ? {
                  connect: {
                    id: store.id,
                  },
                }
                : undefined,
            },
          });
          console.log(`StockCard güncellendi: ${product.productName} (SKU: ${product.productSku})`);
        }

        // MarketPlaceAttributes ile StockCardAttribute ve StockCardAttributeItems oluştur
        if (product.marketPlaceAttributes && product.marketPlaceAttributes.length > 0) {
          for (const attr of product.marketPlaceAttributes) {
            if (!attr.attributeName || !attr.valueName) {
              console.error(`Hatalı attribute: ${attr.attributeName}. valueName eksik.`);
              continue;
            }

            // StockCardAttribute kontrol et
            let stockCardAttribute = await prisma.stockCardAttribute.findFirst({
              where: {
                attributeName: attr.attributeName,
                value: attr.valueName,
              },
            });

            if (!stockCardAttribute) {
              // StockCardAttribute oluştur
              stockCardAttribute = await prisma.stockCardAttribute.create({
                data: {
                  attributeName: attr.attributeName,
                  value: attr.valueName,
                },
              });
            }

            // StockCardAttributeItem kontrol et
            const existingAttributeItem = await prisma.stockCardAttributeItems.findFirst({
              where: {
                attributeId: stockCardAttribute.id,
                stockCardId: stockCard.id,
              },
            });

            if (!existingAttributeItem) {
              // StockCardAttributeItem oluştur
              await prisma.stockCardAttributeItems.create({
                data: {
                  attributeId: stockCardAttribute.id,
                  stockCardId: stockCard.id,
                },
              });
            }
          }
        }
      }

    } catch (error) {
      console.error("StockCard ekleme sırasında bir hata oluştu:", error);
      throw new Error("StockCard ekleme işlemi başarısız oldu.");
    }

    function mapProductType(productType: string | null): ProductType {
      switch (productType) {
        case "variable":
          return "VaryasyonluUrun";
        case "variation":
          return "VaryasyonUrun";
        case "simple":
          return "BasitUrun";
        default:
          return "BasitUrun";
      }
    }
  }

  async addStockCardToStockCardWarehouse() {
    try {
      const stockCards = await prisma.stockCard.findMany({
        include: {
          stockCardWarehouse: true, // StockCardWarehouse ilişkisini dahil et
        },
      });

      // Varsayılan Warehouse ID'sini alıyoruz (örneğin, ID'si 'cm4jx3uh2003u12scm0pm229r')
      const defaultWarehouseId = 'cm4jx3uh2003u12scm0pm229r'; // Burada istediğiniz Warehouse ID'sini kullanabilirsiniz.

      for (const stockCard of stockCards) {
        // Eğer StockCardWarehouse kaydında yoksa, yeni bir kayıt oluştur
        const existingWarehouseRecord = await prisma.stockCardWarehouse.findUnique({
          where: {
            stockCardId_warehouseId: {
              stockCardId: stockCard.id,
              warehouseId: defaultWarehouseId, // Varsayılan Warehouse ID'sini kullanıyoruz
            },
          },
        });

        if (!existingWarehouseRecord) {
          // Yeni StockCardWarehouse kaydını oluşturuyoruz
          await prisma.stockCardWarehouse.create({
            data: {
              stockCardId: stockCard.id,
              warehouseId: defaultWarehouseId, // Geçerli warehouseId'yi kullanıyoruz
              quantity: 100, // Varsayılan miktar
            },
          });
          console.log(`Product with ID ${stockCard.id} added to StockCardWarehouse at Warehouse ${defaultWarehouseId}.`);
        } else {
          console.log(`Product with ID ${stockCard.id} already exists in StockCardWarehouse for Warehouse ${defaultWarehouseId}.`);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // WooCommerce ürünlerini StockCard ile senkronize et
  async syncStockCardWithWooCommerce(): Promise<void> {
    try {
      // Tüm StockCard'ları veritabanından çekiyoruz
      const stockCards = await prisma.stockCard.findMany({
        include: {
          stockCardWarehouse: true,
          stockCardPriceLists: { include: { priceList: true } },
          stockCardAttributeItems: true,
          Store: true,
        },
      });

      // WooCommerce ürünlerini çekiyoruz
      const wooCommerceProducts = [];
      let page = 1;
      let response;

      do {
        response = await this.wooCommerce.getProducts({ per_page: 100, page });
        wooCommerceProducts.push(...response);
        page++;
      } while (response.length > 0);

      console.log(`WooCommerce'den toplam ${wooCommerceProducts.length} ürün çekildi.`);

      // Varyasyonlar için önbellek oluşturuluyor
      const variationsCache: Record<string, Product[]> = {};
      for (const product of wooCommerceProducts) {
        if (product.type === "variable") {
          const variations = await this.wooCommerce.getProductVariations(product.id);
          variationsCache[product.id] = variations;
        }
      }

      console.log("Tüm varyasyonlar hafızada saklandı.");

      // Normalizasyon fonksiyonu
      const normalize = (text: string) =>
        text?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || '';

      // Senkronizasyon işlemi
      for (const stockCard of stockCards) {
        const stockCardNormalizedCode = normalize(stockCard.productCode);

        // WooCommerce ürünlerini SKU'ya göre eşleştir
        let wooProduct = wooCommerceProducts.find(
          (product) => normalize(product.sku) === stockCardNormalizedCode
        );

        // Eğer ana ürünle eşleşme yoksa varyasyonlarda ara
        if (!wooProduct) {
          for (const product of wooCommerceProducts) {
            if (product.type === "variable" && variationsCache[product.id]) {
              wooProduct = variationsCache[product.id].find(
                (variation) => normalize(variation.sku) === stockCardNormalizedCode
              );
              if (wooProduct) break;
            }
          }
        }

        // Eşleşme yoksa logla ve devam et
        if (!wooProduct) {
          console.warn(
            `Eşleşmeyen ürün: StockCard -> ${stockCard.productName} (${stockCard.productCode}), WooCommerce SKU'larla eşleşmiyor.`
          );
          continue;
        }

        // PriceList kontrolü
        const wooCommercePriceList = stockCard.stockCardPriceLists.find(
          (item) => item.priceList.priceListName === "Woocommerce"
        );

        if (!wooCommercePriceList) {
          console.warn(`PriceList ilişkisi bulunmayan ürün: ${stockCard.productName}`);
          continue;
        }

        // Fiyat ve miktar hesaplama
        const price = parseFloat(wooCommercePriceList.price.toString() || "0.00").toFixed(2);
        const totalQuantity = stockCard.stockCardWarehouse.reduce(
          (sum, warehouse) => sum + (warehouse.quantity?.toNumber() || 0),
          0
        );

        // WooCommerce ürününü güncelle
        try {
          if (wooProduct.type === "simple") {
            await this.wooCommerce.updateProduct(wooProduct.id, {
              stock_quantity: totalQuantity,
              manage_stock: true,
              regular_price: price,
              sale_price: price,
            });
            console.log(
              `Ürün güncellendi: ${wooProduct.name} (${wooProduct.sku}, Price: ${price})`
            );
          } else if (wooProduct.type === "variable") {
            // Variable ürünlerin kendisi için stok bilgisi olmaz, sadece alt varyasyonları güncellenir.
            console.log(`Variable ürün: ${wooProduct.name} (${wooProduct.sku}), sadece varyasyonlar güncellenir.`);
          } else if (wooProduct.type === "variation") {
            await this.wooCommerce.updateProductVariation(
              wooProduct.parent_id,
              wooProduct.id,
              {
                stock_quantity: totalQuantity,
                manage_stock: true,
                regular_price: price,
                sale_price: price,
              }
            );
            console.log(
              `Varyasyon güncellendi: ${wooProduct.name} (${wooProduct.sku}, Price: ${price})`
            );
          }
        } catch (error) {
          console.error(
            `WooCommerce güncelleme hatası: ${wooProduct.sku} (${wooProduct.name})`,
            error
          );
        }
      }

      console.log("StockCard ve WooCommerce senkronizasyonu tamamlandı.");
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyon hatası:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }

}
