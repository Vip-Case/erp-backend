import { PrismaClient, MarketPlaceCategories, StockCard, StockUnits, ProductType, Warehouse, StockCardWarehouse } from "@prisma/client";
import { WooCommerceAdapter } from "../../adapters/wooCommerceAdapter";
import { InvoiceDetailResponse } from "./invoiceService";

const prisma = new PrismaClient();

interface WooCategory {
  id: number | string;
  name: string;
  parent?: number | string | null;
  children?: WooCategory[];
}
interface WooCommerceMeta {
  id: number;
  key: string;
  value: string;
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
  private static instance: WooCommerceService;
  private wooCommerce!: WooCommerceAdapter;

  constructor(private storeId: string) { }

  public static async getInstance(storeId: string): Promise<WooCommerceService> {
    const service = new WooCommerceService(storeId);
    await service.initializeWooCommerce();
    return service;
  }

  public async initializeWooCommerce(): Promise<void> {
    try {
      console.log("Initializing WooCommerce connection...");

      const store = await prisma.store.findUnique({
        where: { id: this.storeId },
      });

      // Hata mesajlarını güncelleyerek daha fazla bilgi sağlayın
      if (!store) {
        throw new Error(`Store bulunamadı. Sağlanan Store ID: ${this.storeId}`);
      }

      if (!store.apiCredentials) {
        throw new Error(
          `Store (${store.id}) için apiCredentials eksik! Lütfen bağlantı bilgilerini kontrol edin.`
        );
      }

      let apiCredentials;
      try {
        apiCredentials = JSON.parse(store.apiCredentials);
      } catch (error) {
        throw new Error(
          `Store (${store.id}) için apiCredentials JSON formatında değil: ${store.apiCredentials}`
        );
      }

      const { baseUrl, consumerKey, consumerSecret } = apiCredentials;

      if (!baseUrl || !consumerKey || !consumerSecret) {
        throw new Error(
          `Store (${store.id}) için eksik bağlantı bilgileri: baseUrl: ${baseUrl}, consumerKey: ${consumerKey}, consumerSecret: ${consumerSecret}`
        );
      }

      this.wooCommerce = new WooCommerceAdapter(baseUrl, consumerKey, consumerSecret);
      console.log("WooCommerce bağlantısı başarıyla başlatıldı.");
    } catch (error) {
      console.error("WooCommerce bağlantısı başlatılamadı:", error);
      throw new Error("WooCommerce servisi başlatılamadı.");
    }
  }


  // WooCommerce'den tüm ürünleri çekmek için yeni bir yardımcı metot
  private async fetchAllProducts(): Promise<Product[]> {
    const allProducts: Product[] = [];
    let page = 1;

    while (true) {
      const products = await this.wooCommerce.getProducts({ page, per_page: 50 });
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

    if (existingProduct) {
      console.log(`Ürün güncellendi: ${product.name} (SKU: ${product.sku}, ID: ${existingProduct.id})`);
    } else {
      console.log(`Yeni ürün eklendi: ${product.name} (SKU: ${product.sku})`);
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

  async syncProducts(input: { storeId: string }): Promise<void> {
    try {
      // Gerekli parametreleri doğrula
      if (!input.storeId) {
        throw new Error("storeId eksik. Lütfen geçerli bir storeId sağlayın.");
      }

      // WooCommerce bağlantısını başlat
      await this.initializeWooCommerce();

      // WooCommerce ürünlerini çek
      const products = await this.fetchAllProducts();

      // Store bilgilerini al
      const store = await prisma.store.findUnique({
        where: { id: input.storeId },
      });

      if (!store) {
        throw new Error("Store bulunamadı. Lütfen geçerli bir storeId sağlayın.");
      }

      for (const product of products) {
        try {
          await this.processProduct(product, store);
          console.log(`Ürün işleme tamamlandı: ${product.name} (SKU: ${product.sku})`);
        } catch (productError) {
          console.error(`Ürün işlenirken hata oluştu: ${product.name} (SKU: ${product.sku})`, productError);
        }
      }

      console.log(`Store (${store.name}) ürün senkronizasyonu tamamlandı.`);
    } catch (error) {
      console.error("Ürün senkronizasyon hatası:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }

  async addToStockCard(productIds: string[] = [], branchCode?: string,
    warehouseId?: string,
    useWooCommercePrice: boolean = true,
    useWooCommerceQuantity: boolean = true,
    includeAll: boolean = false): Promise<void> {
    try {
      // WooCommerce istemcisi kontrolü
      if (!this.wooCommerce) {
        throw new Error("WooCommerce istemcisi başlatılmamış.");
      }

      // Seçilen ürünleri veritabanından al
      const selectedProducts = includeAll
        ? await prisma.marketPlaceProducts.findMany({
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
        })
        : await prisma.marketPlaceProducts.findMany({
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

      console.log("Seçilen ürünler:", selectedProducts);

      if (!selectedProducts.length) {
        console.log("Seçilen ürünler bulunamadı.");
        return;
      }

      // Warehouse doğrulama
      if (warehouseId) {
        const warehouseExists = await prisma.warehouse.findUnique({
          where: { id: warehouseId },
        });

        if (!warehouseExists) {
          throw new Error(`Warehouse bulunamadı: ${warehouseId}`);
        }
      }

      // WooCommerce PriceList kontrolü
      const wooCommercePriceList = await prisma.stockCardPriceList.findFirst({
        where: { priceListName: "Woocommerce" },
      });

      if (!wooCommercePriceList) {
        throw new Error("WooCommerce PriceList bulunamadı. Lütfen WooCommerce isimli bir fiyat listesi oluşturun.");
      }

      // WooCommerce'den miktar ve fiyat bilgilerini al
      const wooCommerceData = (useWooCommercePrice || useWooCommerceQuantity)
        ? await this.fetchWooCommerceQuantitiesAndPrices()
        : {};

      // StockCard oluşturma veya güncelleme döngüsü
      for (const product of selectedProducts) {
        try {
          console.log("İşlenen ürün:", product.productName);
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
            console.log("StockCard oluşturuluyor:", {
              productCode: product.productSku,
              productName: product.productName
            });

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
            console.log("StockCard güncelleniyor:", {
              productCode: product.productSku,
              productName: product.productName,
            });
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

          // PriceListItem kontrol ve oluşturma
          const wooData = wooCommerceData[product.productSku] || {};
          const price = useWooCommercePrice ? wooData.price || 0 : 0; // WooCommerce'den veya varsayılan değer
          const quantity = useWooCommerceQuantity ? wooData.quantity || 0 : 0;

          // PriceListItem kontrol ve oluşturma
          const priceListItem = await prisma.stockCardPriceListItems.findFirst({
            where: {
              stockCardId: stockCard.id,
              priceListId: wooCommercePriceList.id,
            },
          });

          if (!priceListItem) {
            await prisma.stockCardPriceListItems.create({
              data: {
                stockCardId: stockCard.id,
                priceListId: wooCommercePriceList.id,
                price: price, // Varsayılan fiyat
                vatRate: 18, // Varsayılan KDV
              },
            });
            console.log(`PriceListItem oluşturuldu: ${product.productName} (PriceList: WooCommerce)`);
          } else {
            // Fiyatı güncelle
            await prisma.stockCardPriceListItems.update({
              where: { id: priceListItem.id },
              data: { price },
            });
            console.log(`PriceListItem güncellendi: ${product.productName} - Price: ${price}`);
          }

          // StockCardWarehouse kontrol ve oluşturma
          const warehouseRecord = await prisma.stockCardWarehouse.findFirst({
            where: {
              stockCardId: stockCard.id,
              warehouseId: warehouseId || "",
            },
          });

          if (!warehouseRecord) {
            await prisma.stockCardWarehouse.create({
              data: {
                stockCardId: stockCard.id,
                warehouseId: warehouseId || "",
                quantity: quantity,
              },
            });
            console.log(`StockCardWarehouse oluşturuldu: ${product.productName} (Warehouse ID: ${warehouseId})`);
          } else {
            // Miktarı güncelle
            await prisma.stockCardWarehouse.update({
              where: { id: warehouseRecord.id },
              data: { quantity },
            });
            console.log(`StockCardWarehouse güncellendi: ${product.productName} - Quantity: ${quantity}`);
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

        } catch (error) {
          console.error(`Ürün işlenirken hata oluştu: ${product.productName}. Hata:`, error);
          continue; // Sıradaki ürüne geç
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

  // WooCommerce'den ürün miktarlarını almak için yardımcı metot
  async fetchWooCommerceQuantitiesAndPrices(): Promise<{ [sku: string]: { price: number; quantity: number } }> {
    const data: { [sku: string]: { price: number; quantity: number } } = {};
    try {
      let page = 1;
      let products;

      do {
        products = await this.wooCommerce.getProducts({ per_page: 100, page });
        console.log(`WooCommerce sayfa ${page} verileri:`, products);

        for (const product of products) {
          if (product.sku) {
            data[product.sku] = {
              price: product.price || 0,
              quantity: product.stock_quantity || 0,
            };
            console.log(`Ürün eklendi: SKU: ${product.sku}, Price: ${product.price}, Quantity: ${product.stock_quantity}`);

            if (product.type === "variable" && product.id) {
              const variations = await this.wooCommerce.getProductVariations(product.id);
              for (const variation of variations) {
                if (variation.sku) {
                  data[variation.sku] = {
                    price: variation.price || 0,
                    quantity: variation.stock_quantity || 0,
                  };
                  console.log(`Varyasyon eklendi: SKU: ${variation.sku}, Price: ${variation.price}, Quantity: ${variation.stock_quantity}`);
                }
              }
            }
          }
        }

        page++;
      } while (products.length > 0);

      console.log("WooCommerce verileri başarıyla çekildi:", data);
    } catch (error) {
      console.error("WooCommerce verileri alınırken hata oluştu:", error);
    }
    return data;
  }

  // WooCommerce ürünlerini StockCard ile senkronize et
  async syncStockCardWithWooCommerce(
    storeId: string,
    updatePrice: boolean = true,
    updateQuantity: boolean = true,
    specificStockCardIds: string[] = []
  ): Promise<void> {
    try {
      console.log("Başlatılan Body:", { storeId, updatePrice, updateQuantity, specificStockCardIds });

      // WooCommerce bağlantısını başlat
      if (!this.wooCommerce) {
        await this.initializeWooCommerce();
      }

      if (!this.wooCommerce) {
        throw new Error("WooCommerce servisi başlatılmadı. Lütfen initializeWooCommerce'i çağırın.");
      }

      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        throw new Error(`Store bulunamadı. Sağlanan Store ID: ${storeId}`);
      }
      console.log(`Store bulundu: ${store.name} (ID: ${store.id})`);

      if (!specificStockCardIds || specificStockCardIds.length === 0) {
        console.log("specificStockCardIds parametresi gönderilmedi. Tüm StockCard'lar güncellenecek.");
      }

      // StockCard'ları çek
      const stockCards = await prisma.stockCard.findMany({
        where: specificStockCardIds.length > 0
          ? { id: { in: specificStockCardIds } }
          : undefined,
        include: {
          stockCardWarehouse: true,
          stockCardPriceLists: { include: { priceList: true } },
          stockCardAttributeItems: true,
          Store: true,
        },
      });

      if (!stockCards.length) {
        console.log("Hiçbir StockCard bulunamadı.");
        return;
      }

      console.log(`Veritabanından ${stockCards.length} StockCard çekildi.`);

      // WooCommerce ürünlerini çek
      const wooCommerceProducts = await this.fetchAllProducts();
      console.log(`WooCommerce'den toplam ${wooCommerceProducts.length} ürün çekildi.`);

      // Varyasyonları paralel olarak çekmek için limitli bir yapı kullanılıyor
      const variationsCache: Record<string, Product[]> = {};
      await this.fetchWithConcurrency(
        wooCommerceProducts.filter((product) => product.type === "variable"),
        async (product) => {
          try {
            const variations = await this.wooCommerce.getProductVariations(product.id);
            variationsCache[product.id] = variations;
          } catch (error) {
            console.error(`Varyasyonları alırken hata oluştu (Product ID: ${product.id}):`, error);
          }
        },
        10 // Aynı anda maksimum 10 istek
      );

      console.log("Tüm varyasyonlar hafızada saklandı.");

      let updatedCount = 0;
      let skippedCount = 0;

      // StockCard senkronizasyon işlemi
      for (const stockCard of stockCards) {
        let wooProduct = wooCommerceProducts.find(
          (product) =>
            product.sku === stockCard.productCode ||
            product.name.toLowerCase() === stockCard.productName.toLowerCase()
        );

        if (!wooProduct) {
          // Eğer ana ürünle eşleşme yoksa varyasyonlarda ara
          for (const product of wooCommerceProducts.filter((p) => p.type === "variable")) {
            const variations = variationsCache[product.id];
            if (variations) {
              wooProduct = variations.find(
                (variation) =>
                  variation.sku === stockCard.productCode ||
                  variation.name.toLowerCase() === stockCard.productName.toLowerCase()
              );
              if (wooProduct) break;
            }
          }
        }

        if (!wooProduct) {
          console.warn(`Eşleşmeyen ürün: ${stockCard.productName} (${stockCard.productCode})`);
          skippedCount++;
          continue;
        }

        const wooCommercePriceList = stockCard.stockCardPriceLists.find(
          (item) => item.priceList.priceListName === "Woocommerce"
        );

        if (!wooCommercePriceList) {
          console.warn(`PriceList ilişkisi bulunmayan ürün: ${stockCard.productName}`);
          skippedCount++;
          continue;
        }

        const price = parseFloat(wooCommercePriceList.price.toString() || "0.00").toFixed(2);
        const totalQuantity = stockCard.stockCardWarehouse.reduce(
          (sum, warehouse) => sum + (warehouse.quantity?.toNumber() || 0),
          0
        );

        const updateData: any = {};
        if (updatePrice) {
          updateData.regular_price = price;
          updateData.sale_price = price;
        }
        if (updateQuantity) {
          updateData.stock_quantity = totalQuantity;
          updateData.manage_stock = true;
        }

        try {
          if (wooProduct.type === "simple") {
            await this.wooCommerce.updateProduct(wooProduct.id, updateData);
          } else if (wooProduct.type === "variation") {
            const parentId = (wooProduct as any).parent_id;
            await this.wooCommerce.updateProductVariation(parentId, wooProduct.id, updateData);
          }
          updatedCount++;
        } catch (error) {
          console.error(`Ürün güncellenirken hata oluştu: ${wooProduct.sku}`, error);
          skippedCount++;
        }
      }

      console.log(
        `StockCard ve WooCommerce senkronizasyonu tamamlandı. Güncellenen ürünler: ${updatedCount}, Atlanan ürünler: ${skippedCount}`
      );
    } catch (error) {
      console.error("StockCard ve WooCommerce senkronizasyon hatası:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }


  // Paralel işlem sınırını belirleyen yardımcı fonksiyon
  private async fetchWithConcurrency<T>(
    items: T[],
    handler: (item: T) => Promise<void>,
    concurrencyLimit: number = 10
  ): Promise<void> {
    const queue = [...items];
    const activePromises: Promise<void>[] = [];

    const runNext = async () => {
      if (queue.length === 0) return;

      const item = queue.shift();
      if (item) {
        const promise = handler(item).finally(() => {
          activePromises.splice(activePromises.indexOf(promise), 1);
        });
        activePromises.push(promise);

        await promise;
        await runNext();
      }
    };

    await Promise.all(Array.from({ length: concurrencyLimit }, runNext));
  }

  public async createOrder(invoiceDetails: InvoiceDetailResponse): Promise<void> {
    try {
      // WooCommerce'de aynı ERP faturasına ait sipariş olup olmadığını kontrol et
      const existingOrders = await this.wooCommerce.getOrders({
        meta_key: "ERP_Invoice_ID",
        meta_value: invoiceDetails.id,
      });

      if (existingOrders && existingOrders.length > 0) {
        //console.log("Existing Orders:", JSON.stringify(existingOrders, null, 2));

        const orderMatch = existingOrders.find(order =>
          order.meta_data.some((meta: WooCommerceMeta) => meta.key === "ERP_Invoice_ID" && meta.value === invoiceDetails.id)
        );

        if (orderMatch) {
          console.log(`WooCommerce'de bu faturaya ait bir sipariş zaten mevcut: ${orderMatch.id}`);
          return; // Sipariş oluşturmayı atla
        }
      }

      // WooCommerce ürünlerini eşleştir
      const wooProducts = await this.fetchAllProducts();

      console.log("ERP'den gelen ürünler:", invoiceDetails.items.map(i => i.stockCode));
      console.log("WooCommerce'den çekilen SKU'lar:", wooProducts.map(p => p.sku));

      // WooCommerce ürünlerini eşleştir
      const lineItems = await Promise.all(
        invoiceDetails.items.map(async (item) => {
          const normalizedStockCode = item.stockCode?.trim().toLowerCase();
          console.log("Normalize edilmiş ERP SKU:", normalizedStockCode);

          // varyasyonları kontrol et
          for (const product of wooProducts) {
            const variations = await this.wooCommerce.getProductVariations(product.id);
            // Varyasyonları getir
            const variation = variations.find((v) => {
              const variationSkuNormalized = v.sku?.trim().toLowerCase();
              return variationSkuNormalized === normalizedStockCode;
            });

            if (variation) {
              // Varyasyon eşleşti
              console.log(`Varyasyon eşleşti: ${variation.sku}`);
              return {
                product_id: product.id,
                variation_id: variation.id,
                quantity: item.quantity,
                price: item.unitPrice.toFixed(2),
                total: item.totalAmount.toFixed(2),
                subtotal: (item.totalAmount - item.vatAmount).toFixed(2),
              };
            }
          }

          // Ana ürün eşleştirmesi
          const wooProduct = wooProducts.find((p) => {
            const wooSkuNormalized = p.sku?.trim().toLowerCase(); // WooCommerce SKU'yu normalize et
            return (
              wooSkuNormalized === normalizedStockCode || // Tam eşleşme
              (normalizedStockCode && normalizedStockCode.startsWith(wooSkuNormalized)) || // ERP SKU, WooCommerce SKU ile başlıyorsa
              (wooSkuNormalized && wooSkuNormalized.startsWith(normalizedStockCode || "")) // WooCommerce SKU, ERP SKU ile başlıyorsa
            );
          });

          if (wooProduct) {
            // Ana ürün eşleşti
            return {
              product_id: wooProduct.id,
              quantity: item.quantity,
              price: item.unitPrice.toFixed(2),
              total: item.totalAmount.toFixed(2),
              subtotal: (item.totalAmount - item.vatAmount).toFixed(2),
            };
          }

          // Ürün veya varyasyon bulunamazsa hata fırlat
          console.error(
            `Eşleşmeyen ürün: ${item.stockName} (${item.stockCode}) - WooCommerce SKU'lar:`,
            wooProducts.map((p) => p.sku)
          );
          throw new Error(`WooCommerce'de eşleşmeyen ürün: ${item.stockName} (${item.stockCode})`);
        })
      );

      const current = await prisma.current.findUnique({
        where: { currentCode: invoiceDetails.current.currentCode },
        include: { currentAddress: true },
      });

      if (!current) {
        throw new Error(`Current bulunamadı: ${invoiceDetails.current.currentCode}`);
      }

      // Fatura adresini seç
      const billingAddressData = current.currentAddress?.[0] || null; // İlk adresi fatura adresi olarak al
      const shippingAddressData = current.currentAddress?.[1] || billingAddressData; // İkinci adres yoksa fatura adresini kullan

      const paymentMethods = invoiceDetails.payments.map((payment) => ({
        method_title: this.mapPaymentMethod(payment.method),
        total: payment.amount.toFixed(2),
      }));

      const orderData = {
        payment_method: paymentMethods.length > 0 ? paymentMethods[0].method_title : "N/A",
        payment_method_title: paymentMethods.length > 0 ? paymentMethods[0].method_title : "N/A",
        set_paid: invoiceDetails.payments.length > 0,
        status: "processing",
        billing: {
          first_name: invoiceDetails.current?.currentName || "Unknown",
          last_name: "-",
          address_1: billingAddressData?.address || "No Address",
          city: billingAddressData?.city || "No City",
          postcode: billingAddressData?.postalCode || "00000",
          country: billingAddressData?.countryCode || "TR",
          email: billingAddressData?.email || "no-email@example.com",
          phone: invoiceDetails.current?.phone || "0000000000",
        },
        shipping: {
          first_name: invoiceDetails.current?.currentName || "Unknown",
          last_name: "-",
          address_1: shippingAddressData?.address || "No Address",
          city: shippingAddressData?.city || "No City",
          postcode: shippingAddressData?.postalCode || "00000",
          country: shippingAddressData?.countryCode || "TR",
          email: shippingAddressData?.email || "no-email@example.com",
          phone: invoiceDetails.current?.phone || "0000000000",
        },
        line_items: lineItems.map((item) => ({
          product_id: item.product_id,
          variation_id: item.variation_id || undefined, // Varyasyon ID'si varsa ekle
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          subtotal: item.subtotal,
        })),
        meta_data: [
          { key: "ERP_Invoice_ID", value: invoiceDetails.id },
          { key: "ERP_Invoice_No", value: invoiceDetails.invoiceNo },
        ],
        customer_note: "ERP üzerinden oluşturulan sipariş",
      };

      // WooCommerce'de sipariş oluştur
      const createdOrder = await this.wooCommerce.createOrder(orderData);

      console.log("WooCommerce siparişi başarıyla oluşturuldu:", createdOrder);

      // WooCommerce Order ID'yi ERP'ye kaydet
      await prisma.invoice.update({
        where: { id: invoiceDetails.id },
        data: {
          description: `WooCommerce Order ID: ${createdOrder.id}`, // Sipariş ID açıklama alanında saklanıyor
        },
      });

      const wooBillingAddress = createdOrder.billing;
      const wooShippingAddress = createdOrder.shipping;

      // Adres verilerini OrderInvoiceAddress'e ekle
      const billingAddress = await prisma.orderInvoiceAddress.create({
        data: {
          address: wooBillingAddress?.address || "No Address",
          city: wooBillingAddress?.city || "No City",
          district: wooBillingAddress?.district || "No District",
          postalCode: wooBillingAddress?.postcode || "00000",
          country: wooBillingAddress?.country || "TR",
          fullName: `${wooBillingAddress?.first_name || ""} ${wooBillingAddress?.last_name || ""}`.trim(),
          email: wooBillingAddress?.email || "no-email@example.com",
          order: {
            connect: {
              id: createdOrder.id
            }
          }
        },
      });

      const shippingAddress = await prisma.orderInvoiceAddress.create({
        data: {
          address: wooShippingAddress?.address_1 || "No Address",
          city: wooShippingAddress?.city || "No City",
          district: wooShippingAddress?.state || "No District",
          postalCode: wooShippingAddress?.postcode || "00000",
          country: wooShippingAddress?.country || "Unknown",
          fullName: `${wooShippingAddress?.first_name || ""} ${wooShippingAddress?.last_name || ""}`.trim(),
          email: wooShippingAddress?.email || "no-email@example.com",
          order: {
            connect: {
              id: createdOrder.id
            }
          }
        },
      });

      // Order tablosuna sipariş ekle
      const createdOrderInDB = await prisma.order.create({
        data: {
          platformOrderId: createdOrder.id.toString(),
          platform: "WooCommerce",
          customerId: "ERP-Generated", // Eğer müşteri ID'si varsa buraya eklenmeli
          status: createdOrder.status,
          currency: createdOrder.currency,
          orderDate: new Date(createdOrder.date_created_gmt),
          deliveryType: "Standard", // Teslimat tipi belirlenebilir
          totalPrice: parseFloat(createdOrder.total),
          storeId: this.storeId,
          billingAddressId: billingAddress.id,
          shippingAddressId: shippingAddress.id,
          isInvoiceCreated: false,
        },
      });

      // OrderItem için doğrulama ve oluşturma
      await Promise.all(
        invoiceDetails.items.map(async (item) => {
          try {
            // InvoiceDetail'deki productCode üzerinden StockCard'ı eşle
            const stockCard = await prisma.stockCard.findFirst({
              where: {
                productCode: item.stockCode || "", // null ise boş string kullan
              },
              select: {
                id: true, // Sadece id'yi al
              },
            });

            if (!stockCard) {
              console.error(
                `StockCard bulunamadı: ProductCode - ${item.stockCode}`
              );
              throw new Error(
                `StockCard bulunamadı: ProductCode - ${item.stockCode}`
              );
            }

            // OrderItem oluştur
            await prisma.orderItem.create({
              data: {
                orderId: createdOrderInDB.id, // Mevcut Order ID
                stockCardId: stockCard.id, // Bulunan StockCard ID
                quantity: item.quantity,
                unitPrice: parseFloat(item.unitPrice.toString()),
                totalPrice: parseFloat(item.totalAmount.toString()),
                productName: item.stockName || "Unknown Product",
                productCode: parseInt(item.stockCode || "0") || 0  // String'i number'a çevir, null ise "0" kullan
              },
            });
          } catch (error) {
            console.error(
              `OrderItem oluşturulurken hata: ProductCode - ${item.stockCode}`,
              error
            );
            throw new Error(
              `OrderItem oluşturulamadı: ProductCode - ${item.stockCode}`
            );
          }
        })
      );

    } catch (error) {
      console.error("WooCommerce siparişi oluşturulurken hata oluştu:", error);
      throw new Error("WooCommerce siparişi oluşturulamadı.");
    }
  }

  private mapPaymentMethod(method: string): string {
    switch (method) {
      case "cash":
        return "Cash on Delivery";
      case "bank":
        return "Bank Transfer";
      case "card":
        return "Credit Card";
      case "openAccount":
        return "Open Account";
      default:
        return "Unknown";
    }
  }

}
