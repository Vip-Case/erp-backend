import { Decimal } from "@prisma/client/runtime/library";
import { TrendyolAdapter } from "../../adapters/trendyolAdapter";
import { PrismaClient, Prisma, MarketPlaceCategories, MarketPlaceProducts, StockUnits, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

interface TrendyolBrand {
  id: number | string;
  name: string;
}

interface TrendyolCategory {
  id: number | string;
  name: string;
  parentId?: number | string | null;
  subCategories?: TrendyolCategory[];
}

interface TrendyolProduct {
  barcode: string;
  title: string;
  stockCode: string;
  description?: string;
  listPrice?: number;
  salePrice?: number;
  brandId: number;
  pimCategoryId: number;
  productMainId: string;
  images?: Array<{ url: string }>;
  productType?: 'Basit' | 'Varyasyonlu' | 'Varyasyon';
  attributes?: Array<{
    attributeId: number;
    attributeValueId?: number;
    customAttributeValue?: string;
    attributeName?: string;
  }>;
  parentProductId?: string;
}

interface TrendyolAPIResponse<T = TrendyolProduct> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export class TrendyolService {
  private trendyol!: TrendyolAdapter;
  private readonly CONFIG = {
    MAX_CONCURRENT_REQUESTS: 15,
    MAX_RETRIES: 2,
    RETRY_BASE_DELAY: 500,
    BATCH_SIZE: 100,
    REQUEST_DELAY: 500
  };
  private isInitialized = false;
  private brandCache: Map<string, string> = new Map();
  private categoryCache: Map<string, string> = new Map();
  private rateLimitDelay = 500; // ms

  private async rateLimiter() {
    await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
  }

  constructor(private readonly storeId: string) { }

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      const store = await prisma.store.findUnique({
        where: { id: this.storeId },
        include: { marketPlace: true }
      });

      if (!store?.apiCredentials) {
        throw new Error(`Store veya kimlik bilgileri bulunamadı: ${this.storeId}`);
      }

      this.trendyol = new TrendyolAdapter(JSON.parse(store.apiCredentials));
      await this.loadCaches();
      this.isInitialized = true;
    } catch (error) {
      console.error("Başlatma hatası:", error);
      throw new Error("Trendyol servisi başlatılamadı");
    }
  }

  private async loadCaches(): Promise<void> {
    const [brands, categories] = await Promise.all([
      prisma.marketPlaceBrands.findMany({
        where: { marketPlaceBrandId: { not: null } }
      }),
      prisma.marketPlaceCategories.findMany({
        where: { marketPlaceCategoryId: { not: null } }
      })
    ]);

    this.brandCache.clear();
    this.categoryCache.clear();

    brands.forEach(brand => {
      if (brand.marketPlaceBrandId) {
        this.brandCache.set(brand.marketPlaceBrandId, brand.id);
      }
    });

    categories.forEach(category => {
      if (category.marketPlaceCategoryId) {
        this.categoryCache.set(category.marketPlaceCategoryId, category.id);
      }
    });

    console.log(`Cache yüklendi: ${brands.length} marka, ${categories.length} kategori`);
  }

  async syncBrands(): Promise<void> {
    await this.initialize();
    const batchSize = 100;
    let page = 0;

    while (true) {
      const response = await this.retryOperation(() =>
        this.trendyol.getBrands()
      );

      if (!response.brands?.length) break;

      const brandArray = response.brands;
      for (let i = 0; i < brandArray.length; i += batchSize) {
        const batch = brandArray.slice(i, i + batchSize);

        await prisma.$transaction(async (tx) => {
          for (const brand of batch) {
            let existingBrand = await tx.marketPlaceBrands.findFirst({
              where: { marketPlaceBrandId: brand.id.toString() }
            });

            if (!existingBrand) {
              existingBrand = await tx.marketPlaceBrands.create({
                data: {
                  marketPlaceBrandId: brand.id.toString(),
                  brandName: brand.name
                }
              });
            } else {
              await tx.marketPlaceBrands.update({
                where: { id: existingBrand.id },
                data: { brandName: brand.name }
              });
            }
          }
        }, { timeout: 20000 });

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (page >= response.totalPages - 1) break;
      page++;
    }

    await this.loadCaches();
  }

  async syncCategories(): Promise<void> {
    await this.initialize();
    const batchSize = 100;
    let page = 0;

    while (true) {
      const response = await this.retryOperation(() =>
        this.trendyol.getCategories(page, 1000)
      );

      if (!response.categories?.length) break;

      const categoryArray = response.categories;
      for (let i = 0; i < categoryArray.length; i += batchSize) {
        const batch = categoryArray.slice(i, i + batchSize);

        await prisma.$transaction(async (tx) => {
          for (const category of batch) {
            // Ana kategori kontrolü ve ilişkilendirme
            let parentCategoryId = null;
            if (category.parentId) {
              const parentCategory = await this.findOrCreateCategory(tx, category.parentId);
              if (parentCategory) {
                parentCategoryId = parentCategory.id;
              }
            }

            // Önce mevcut kategoriyi ara
            const existingCategory = await tx.marketPlaceCategories.findFirst({
              where: { marketPlaceCategoryId: category.id.toString() }
            });

            if (existingCategory) {
              // Varsa güncelle
              await tx.marketPlaceCategories.update({
                where: { id: existingCategory.id },
                data: {
                  categoryName: category.name,
                  parentCategory: parentCategoryId ? {
                    connect: { id: parentCategoryId }
                  } : undefined
                },
                include: {
                  parentCategory: true,
                  subCategories: true,
                  products: true
                }
              });
            } else {
              // Yoksa oluştur
              await tx.marketPlaceCategories.create({
                data: {
                  marketPlaceCategoryId: category.id.toString(),
                  categoryName: category.name,
                  parentCategory: parentCategoryId ? {
                    connect: {
                      id: parentCategoryId
                    }
                  } : undefined
                },
                include: {
                  parentCategory: true,
                  subCategories: true,
                  products: true
                }
              });
            }
          }
        }, { timeout: 20000 });

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (page >= response.totalPages - 1) break;
      page++;
    }

    await this.loadCaches();
  }

  private async findOrCreateCategory(tx: any, categoryId: number): Promise<any> {
    if (!categoryId) return null;
    const cached = this.categoryCache.get(categoryId.toString());
    if (cached) {
      return tx.marketPlaceCategories.findUnique({
        where: { id: cached },
        include: {
          parentCategory: true,
          subCategories: true,
          products: true
        }
      });
    }

    await this.rateLimiter();
    const trendyolCategory = await this.trendyol.getCategoryById(categoryId);


    if (!trendyolCategory) return null;

    // Mevcut kategoriyi kontrol et
    const existingCategory = await tx.marketPlaceCategories.findFirst({
      where: { marketPlaceCategoryId: categoryId.toString() }
    });

    if (existingCategory) {
      return tx.marketPlaceCategories.update({
        where: { id: existingCategory.id },
        data: {
          categoryName: trendyolCategory.name,
          parentCategory: trendyolCategory.parentId ? {
            connect: {
              marketPlaceCategoryId: trendyolCategory.parentId.toString()
            }
          } : undefined
        },
        include: {
          parentCategory: true,
          subCategories: true
        }
      });
    }

    return tx.marketPlaceCategories.create({
      data: {
        marketPlaceCategoryId: categoryId.toString(),
        categoryName: trendyolCategory.name,
        parentCategory: trendyolCategory.parentId ? {
          connect: {
            marketPlaceCategoryId: trendyolCategory.parentId.toString()
          }
        } : undefined
      },
      include: {
        parentCategory: true,
        subCategories: true,
        products: true
      }
    });
  }

  private async findOrCreateBrand(tx: any, brandId: number): Promise<any> {
    const cached = this.brandCache.get(brandId.toString());
    if (cached) {
      return tx.marketPlaceBrands.findUnique({ where: { id: cached } });
    }

    await this.rateLimiter();
    const trendyolBrand = await this.trendyol.getBrandById(brandId);

    // Önce mevcut markayı ara
    const existingBrand = await tx.marketPlaceBrands.findFirst({
      where: { marketPlaceBrandId: brandId.toString() }
    });

    if (existingBrand) {
      // Varsa güncelle
      return tx.marketPlaceBrands.update({
        where: { id: existingBrand.id },
        data: {
          brandName: trendyolBrand.name
        }
      });
    } else {
      // Yoksa oluştur
      return tx.marketPlaceBrands.create({
        data: {
          marketPlaceBrandId: brandId.toString(),
          brandName: trendyolBrand.name
        }
      });
    }
  }

  async syncProducts(): Promise<void> {
    await this.initialize();
    const store = await prisma.store.findUniqueOrThrow({
      where: { id: this.storeId }
    });

    let page = 0;
    let totalProcessedProducts = 0;

    try {
      while (true) {
        const response = await this.trendyol.getProducts(page, 200);
          if (!response.content.length) break;
          
        // Ürünleri productMainId'ye göre grupla
          const productGroups = new Map<string, TrendyolProduct[]>();
          for (const product of response.content) {
          if (!productGroups.has(product.productMainId)) {
            productGroups.set(product.productMainId, []);
          }
          productGroups.get(product.productMainId)!.push(product);
        }

        // Her grup için direkt işlem
        for (const products of productGroups.values()) {
                  if (products.length > 1) {
            // Ana ürünü kaydet
                    const mainProduct = products[0];
                    mainProduct.productType = 'Varyasyonlu';
            const savedMainProduct = await this.processProduct(mainProduct, store.id);
                    
            if (savedMainProduct && savedMainProduct.id) {
              // Varyantları ana ürüne bağla
                      for (const variant of products.slice(1)) {
                        variant.productType = 'Varyasyon';
                variant.parentProductId = savedMainProduct.id; // Ana ürünün DB id'si
                await this.processProduct(variant, store.id);
                      }
                    }
                  } else {
                    products[0].productType = 'Basit';
            await this.processProduct(products[0], store.id);
                  }
          totalProcessedProducts += products.length;
                }

        if (page >= response.totalPages - 1) break;
          page++;
        await this.delay(2000);
      }
    } catch (error) {
      console.error('Ürün senkronizasyonu hatası:', error);
      throw error;
    }
  }

  private async processProduct(product: TrendyolProduct, storeId: string): Promise<any> {
    if (!product.barcode || !product.title) return;

    let marketplaceProduct;

    await prisma.$transaction(async (tx) => {
      // Marka kontrolü ve oluşturma
      const [brand, category] = await Promise.all([
        this.findOrCreateBrand(prisma, product.brandId),
        this.findOrCreateCategory(prisma, product.pimCategoryId)
      ]);

      if (!brand?.id || !category?.id) {
        console.warn(`Brand/Category not found for product ${product.barcode}`);
        return;
      }

      let parentProductId = null;
      if (product.productType === 'Varyasyon' && product.productMainId) {
        const parent = await tx.marketPlaceProducts.findFirst({
          where: {
          productId: product.productMainId,
            productType: 'Varyasyonlu',
            storeId: storeId // Store kontrolü ekle
          },
          select: { id: true }
        });

        parentProductId = parent?.id || null;
      }

      // Ürün kaydı
      const existingProduct = await tx.marketPlaceProducts.findUnique({
        where: { barcode: product.barcode }
      });

      if (existingProduct) {
        marketplaceProduct = await tx.marketPlaceProducts.update({
          where: { id: existingProduct.id },
          data: {
          productName: product.title,
          description: product.description || '',
          listPrice: new Decimal(product.listPrice || 0),
          salePrice: new Decimal(product.salePrice || 0),
            productType: product.productType || 'Basit',
            parentProductId: parentProductId,
            MarketPlaceCategories: category?.id ? {
              connect: { id: category.id }
            } : undefined,
            MarketPlaceProductImages: {
              deleteMany: {},
              create: product.images?.map(img => ({ imageUrl: img.url })) || []
            },
            marketPlaceAttributes: {
              deleteMany: {},
              create: product.attributes?.map(attr => ({
                attributeMarketPlaceId: attr.attributeId.toString(),
                attributeName: attr.attributeName || null,
                valueMarketPlaceId: attr.attributeValueId?.toString(),
                valueName: attr.customAttributeValue || null
              })) || []
            }
          }
        });
      } else {
        marketplaceProduct = await tx.marketPlaceProducts.create({
          data: {
            barcode: product.barcode,
            productId: product.productMainId,
          productName: product.title,
            productSku: product.stockCode || '',
          description: product.description || '',
          listPrice: new Decimal(product.listPrice || 0),
          salePrice: new Decimal(product.salePrice || 0),
            productType: product.productType || 'Basit',
            parentProductId: parentProductId,
            storeId: storeId,
            marketPlaceBrandsId: brand.id,
            MarketPlaceProductImages: {
              create: product.images?.map(img => ({ imageUrl: img.url })) || []
            },
            marketPlaceAttributes: {
              create: product.attributes?.map(attr => ({
                attributeMarketPlaceId: attr.attributeId.toString(),
                attributeName: attr.attributeName || null,
                valueMarketPlaceId: attr.attributeValueId?.toString(),
                valueName: attr.customAttributeValue || null
              })) || []
            },
            MarketPlaceCategories: {
              connect: {
                id: category.id
              }
            }
          },
          include: {
            MarketPlaceCategories: true,
            marketPlaceAttributes: true,
            MarketPlaceProductImages: true,
            marketPlaceBrands: true,
            store: true

          }
        });
      }

    }, { timeout: 70000, maxWait: 30000 });

      return marketplaceProduct;
  }

  async syncAll(): Promise<void> {
    await this.initialize();

    console.log("Tam senkronizasyon başlıyor...");

    await this.syncBrands();
    await this.loadCaches();

    await this.syncCategories();
    await this.loadCaches();

    await this.syncProducts();

    console.log("Tam senkronizasyon tamamlandı");
  }

  // Kategori işlemleri için yardımcı fonksiyon
  private async processCategories(
    tx: Prisma.TransactionClient,
    marketPlaceProduct: MarketPlaceProducts,
    stockCardId: string
  ) {
    const marketplaceCategories = await tx.marketPlaceCategories.findMany({
      where: {
        products: {
          some: { id: marketPlaceProduct.id }
        }
      },
      include: {
        parentCategory: true
      }
    });

    for (const mpCategory of marketplaceCategories) {
      // Önce kategoriyi bul
      let stockCardCategory = await tx.stockCardCategory.findFirst({
        where: { 
          categoryName: mpCategory.categoryName || ''
        }
      });

      if (!stockCardCategory) {
        // Yoksa yeni oluştur
        stockCardCategory = await tx.stockCardCategory.create({
          data: {
            categoryName: `${mpCategory.categoryName || ''}_${mpCategory.marketPlaceCategoryId || ''}`,
            categoryCode: `CAT-${mpCategory.marketPlaceCategoryId || ''}`,
            parentCategoryId: mpCategory.parentCategory?.id
          }
        });
      }

      // StockCard-Category ilişkisini kontrol et
      const existingRelation = await tx.stockCardCategoryItem.findFirst({
        where: {
          stockCardId: stockCardId,
          categoryId: stockCardCategory.id
        }
      });

      // İlişki yoksa oluştur
      if (!existingRelation) {
        await tx.stockCardCategoryItem.create({
          data: {
            stockCardId: stockCardId,
            categoryId: stockCardCategory.id
          }
        });
      }
    }
  }

  private async processAttributes(
    tx: Prisma.TransactionClient,
    marketPlaceProduct: MarketPlaceProducts,
    stockCardId: string
  ) {
    // Önce marketPlaceAttributes'i alalım
    const marketPlaceAttributes = await tx.marketPlaceAttributes.findMany({
      where: {
        MarketPlaceProducts: {
          some: {
            id: marketPlaceProduct.id
          }
        }
      }
    });

    for (const attr of marketPlaceAttributes) {
      if (!attr.attributeName) continue;

      // Önce StockCardAttribute'de bu özellik var mı kontrol et
      let stockCardAttribute = await tx.stockCardAttribute.findFirst({
        where: {
          attributeName: attr.attributeName
        }
      });

      if (!stockCardAttribute) {
        // Yoksa yeni oluştur
        stockCardAttribute = await tx.stockCardAttribute.create({
          data: {
            attributeName: attr.attributeName,
            value: attr.valueName || ''
          }
        });
      }

      // StockCardAttributeItems oluştur
      await tx.stockCardAttributeItems.create({
        data: {
          attributeId: stockCardAttribute.id,
          stockCardId: stockCardId
        }
      });
    }
  }

  private async createOrUpdateProductMatch(
    tx: Prisma.TransactionClient,
    barcode: string,
    productCode: string
  ): Promise<void> {
    const existingMatch = await tx.productMatch.findUnique({
      where: { barcode: barcode }
    });

    if (existingMatch) {
      await tx.productMatch.update({
        where: { id: existingMatch.id },
        data: { productCode: productCode }
      });
    } else {
      await tx.productMatch.create({
        data: {
          barcode: barcode,
          productCode: productCode
        }
      });
    }
  }

  async matchAndCreateStockCard(marketPlaceProduct: MarketPlaceProducts): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Barkod kontrolü
        if (marketPlaceProduct.barcode) {
          const existingBarcodeCard = await tx.stockCardBarcode.findUnique({
            where: { barcode: marketPlaceProduct.barcode },
            include: { stockCard: true }
          });

          // Eğer barkod başka bir ürüne aitse, işlemi atla
          if (existingBarcodeCard) {
            console.log(`Barkod zaten mevcut, güncelleme yapılıyor: ${marketPlaceProduct.barcode}`);
            
            // Mevcut stockCard'ı güncelle
            await tx.stockCard.update({
              where: { id: existingBarcodeCard.stockCard.id },
              data: {
                modelCode: marketPlaceProduct.productId,
                description: marketPlaceProduct.description,
                stockStatus: true
              }
            });

            // ProductMatch güncelle
            await this.createOrUpdateProductMatch(tx, marketPlaceProduct.barcode, existingBarcodeCard.stockCard.productCode);
            
            return; // İşlemi burada sonlandır
          }
        }

        let stockCard;
        const productCode = marketPlaceProduct.productSku || this.generateUniqueCode();

        // StockCard kontrolü
        const existingStockCard = await tx.stockCard.findFirst({
          where: { productCode: productCode },
          include: { barcodes: true, brand: true }
        });

        // StockStatus kontrolü için await kullanımı
        const stockStatus = await this.trendyol.checkProductAvailability(marketPlaceProduct.barcode || '');
        const isAvailable = stockStatus?.isAvailable ?? true;

        if (!existingStockCard) {
          stockCard = await tx.stockCard.create({
            data: {
              productCode: productCode,
              modelCode: marketPlaceProduct.productId,
              productName: marketPlaceProduct.productName || '',
              unit: StockUnits.Adet,
              productType: marketPlaceProduct.productType === 'Varyasyonlu' ? ProductType.VaryasyonluUrun : ProductType.BasitUrun,
              description: marketPlaceProduct.description,
              stockStatus: isAvailable,
              barcodes: marketPlaceProduct.barcode ? {
                create: [{ barcode: marketPlaceProduct.barcode }]
              } : undefined,
              brandId: await this.matchBrand(tx, marketPlaceProduct.marketPlaceBrandsId),
              Store: {
                connect: { id: this.storeId }
              }
            }
          });

          await this.processCategories(tx, marketPlaceProduct, stockCard.id);
          await this.processAttributes(tx, marketPlaceProduct, stockCard.id);
        } else {
          stockCard = existingStockCard;
          await tx.stockCard.update({
            where: { id: stockCard.id },
            data: {
              modelCode: marketPlaceProduct.productId,
              description: marketPlaceProduct.description,
              stockStatus: isAvailable,
              Store: {
                connect: { id: this.storeId }
              }
            }
          });
        }

        if (marketPlaceProduct.barcode) {
          await this.createOrUpdateProductMatch(tx, marketPlaceProduct.barcode, stockCard.productCode);
          await this.addToStockCardWarehouse(stockCard, marketPlaceProduct.barcode);
        }
      });
    } catch (error) {
      console.error('StockCard eşleştirme hatası:', error);
    }
  }

  private async processVariationAsStockCard(
    tx: Prisma.TransactionClient,
    variation: any,
    parentProduct: MarketPlaceProducts,
    parentProductCode: string
  ) {
    if (!variation.barcode) return;

    const variationProductCode = variation.stockCode || this.generateUniqueCode();
    const stockStatus = await this.trendyol.checkProductAvailability(variation.barcode);

    const existingBarcodeCard = await tx.stockCardBarcode.findUnique({
      where: { barcode: variation.barcode },
      include: { stockCard: true }
    });

    if (existingBarcodeCard && existingBarcodeCard.stockCard.productCode !== variationProductCode) {
      throw new Error(`Bu barkod (${variation.barcode}) başka bir ürüne ait!`);
    }

    const existingStockCard = await tx.stockCard.findFirst({
      where: { productCode: variationProductCode },
      include: {
        barcodes: true,
        brand: true
      }
    });

    let stockCard;
    if (!existingStockCard) {
      stockCard = await tx.stockCard.create({
            data: {
          productCode: variationProductCode,
          modelCode: parentProduct.productId,
          productName: variation.productName || '',
          unit: StockUnits.Adet,
          productType: ProductType.VaryasyonUrun,
          description: variation.description || '',
          stockStatus: stockStatus?.isAvailable || true,
          brandId: await this.matchBrand(tx, parentProduct.marketPlaceBrandsId),
          barcodes: !existingBarcodeCard ? {
            create: [{ barcode: variation.barcode }]
          } : undefined,
          Store: {
            connect: { id: this.storeId }
          }
        },
        include: {
          barcodes: true,
          brand: true,
          stockCardCategoryItem: {
            include: {
              stockCardCategory: {
                include: { parentCategory: true }
              }
            }
          },
          Store: true,
          ProductMatch: true,
          variations: true
        }
      });

      await this.processCategories(tx, variation, stockCard.id);
      await this.processAttributes(tx, variation, stockCard.id);
    } else {
      stockCard = existingStockCard;

      await tx.stockCardCategoryItem.deleteMany({
        where: { stockCardId: stockCard.id }
      });
      await tx.stockCardAttributeItems.deleteMany({
        where: { stockCardId: stockCard.id }
      });

      await tx.stockCard.update({
        where: { id: stockCard.id },
                data: {
          modelCode: parentProduct.productId,
          description: variation.description || '',
          stockStatus: stockStatus?.isAvailable || true,
          Store: {
            connect: { id: this.storeId }
                  }
                }
              });

      await this.processCategories(tx, variation, stockCard.id);
      await this.processAttributes(tx, variation, stockCard.id);
    }

    if (variation.barcode) {
      await this.createOrUpdateProductMatch(tx, variation.barcode, stockCard.productCode);
      await this.addToStockCardWarehouse(stockCard, variation.barcode);
    }
  }

  private async matchBrand(tx: Prisma.TransactionClient, marketPlaceBrandId: string | null): Promise<string | null> {
    if (!marketPlaceBrandId) return null;

    const marketPlaceBrand = await tx.marketPlaceBrands.findUnique({
      where: { id: marketPlaceBrandId }
    });

    if (!marketPlaceBrand?.brandName) return null;

    // Mevcut brand'i bul veya oluştur
    const brand = await tx.brand.upsert({
      where: {
        brandName: marketPlaceBrand.brandName
      },
      create: {
        brandName: marketPlaceBrand.brandName,
        brandCode: this.generateUniqueBrandCode(marketPlaceBrand.brandName), // Yardımcı fonksiyon
      },
      update: {}
    });

    return brand.id;
  }

  // StockCardWarehouse'a eklemek için metod: addToStockCardWarehouse
  private async getProductQuantityFromTrendyol(barcode: string): Promise<number> {
    try {
      const quantity = await this.trendyol.getProductStock(barcode);

      // null kontrolü yap
      if (quantity === null) {
        console.warn(`Ürün bulunamadı veya stok bilgisi alınamadı - Barkod: ${barcode}`);
        throw new Error(`Ürün stok bilgisi bulunamadı: ${barcode}`);
      }

      // Gerçekten 0 ise log at
      if (quantity === 0) {
        console.warn(`Sıfır stok döndü (Gerçek 0 değeri) - Barkod: ${barcode}`);
      }

      return quantity;
    } catch (error) {
      console.error('Trendyol stok bilgisi alınamadı:', {
        barcode,
        error: (error as any).message
      });
      throw error;
    }
  }

  public async addToStockCardWarehouse(stockCard: any, barcode: string) {
    try {
      const store = await prisma.store.findUnique({
        where: { id: this.storeId },
        include: { warehouse: true }
      });

      if (!store) {
        throw new Error('Store bulunamadı');
      }

      if (!store.warehouse) {
        throw new Error('Store için warehouse tanımlanmamış');
      }

      let quantity = 0;

      try {
        // Stok bilgisini al ve hata yönetimi ekle
        const trendyolQuantity = await this.getProductQuantityFromTrendyol(barcode);
        quantity = trendyolQuantity;
        console.log(`Trendyol'dan stok alındı - Barkod: ${barcode}, Miktar: ${quantity}`);
      } catch (error) {
        console.error(`Stok bilgisi alınamadı, varsayılan 0 kullanılacak - Barkod: ${barcode}`, error);
        quantity = 0;
      }

      // Mevcut kayıt kontrolü
      const existingWarehouseStock = await prisma.stockCardWarehouse.findFirst({
        where: {
          stockCardId: stockCard.id,
          warehouseId: store.warehouse.id
        }
      });

      if (existingWarehouseStock) {
        // Varsa güncelle
        await prisma.stockCardWarehouse.update({
          where: { id: existingWarehouseStock.id },
          data: {
            quantity: new Prisma.Decimal(quantity)
          }
        });
        console.log(`StockCardWarehouse güncellendi - StockCard: ${stockCard.id}, Miktar: ${quantity}`);
      } else {
        // Yoksa yeni kayıt oluştur
        await prisma.stockCardWarehouse.create({
          data: {
            stockCardId: stockCard.id,
            warehouseId: store.warehouse.id,
            quantity: new Prisma.Decimal(quantity)
          }
        });
        console.log(`StockCardWarehouse oluşturuldu - StockCard: ${stockCard.id}, Miktar: ${quantity}`);
      }
    } catch (error) {
      console.error('StockCardWarehouse ekleme hatası:', error);
      throw error;
    }
  }

  public async updateTrendyolStock(stockCardWarehouseId: string): Promise<void> {
    try {
      const stockCardWarehouse = await prisma.stockCardWarehouse.findUnique({
        where: { id: stockCardWarehouseId },
        include: {
          stockCard: {
            include: {
              barcodes: true,
              ProductMatch: true
            }
          },
          warehouse: true
        }
      });

      if (!stockCardWarehouse) {
        throw new Error('StockCardWarehouse bulunamadı');
      }

      if (!stockCardWarehouse.stockCard?.barcodes?.length) {
        throw new Error('Ürün barkodu bulunamadı');
      }

      const productMatch = stockCardWarehouse.stockCard.ProductMatch?.[0];
      if (!productMatch) {
        throw new Error('ProductMatch bulunamadı');
      }

      const store = await prisma.store.findUnique({
        where: { id: this.storeId }
      });

      if (!store?.apiCredentials) {
        throw new Error('Store API kimlik bilgileri bulunamadı');
      }

      const barcode = stockCardWarehouse.stockCard.barcodes[0].barcode;

      // ProductMatch'den stok miktarı kontrolü
      const quantity = productMatch.isTempQuantity && productMatch.tempQuantity !== null
        ? new Prisma.Decimal(productMatch.tempQuantity)
        : stockCardWarehouse.quantity || new Prisma.Decimal(0);

      this.trendyol = new TrendyolAdapter(JSON.parse(store.apiCredentials));

      const MAX_RETRIES = 2;
      const RETRY_DELAYS = [1000, 3000];

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`Stok güncelleme denemesi ${attempt + 1}/${MAX_RETRIES}`);

          await this.trendyol.updateProductStock({
            items: [{
              barcode: barcode,
              quantity: Number(quantity)
            }]
          });

          console.log(`Stok başarıyla güncellendi: ${barcode}, Miktar: ${quantity}`);
          return;

        } catch (error: any) {
          console.error(`Stok güncelleme hatası (Deneme ${attempt + 1}):`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });

          if (attempt < MAX_RETRIES - 1) {
            const delay = RETRY_DELAYS[attempt];
            console.log(`${delay}ms bekleniyor...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw new Error(`Stok güncelleme işlemi başarısız: ${error.message}`);
          }
        }
      }

    } catch (error: any) {
      console.error('Trendyol stok güncelleme hatası:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = this.CONFIG.MAX_RETRIES
  ): Promise<T> {
    try {
      const result = await operation();
      if (!result) throw new Error('Boş yanıt');
      return result;
    } catch (error) {
      if (retries === 0) throw error;

      const delay = this.CONFIG.RETRY_BASE_DELAY * (this.CONFIG.MAX_RETRIES - retries + 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.retryOperation(operation, retries - 1);
    }
  }

  // Yardımcı fonksiyonlar
  private generateUniqueCode(): string {
    return `PRD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  private generateUniqueBrandCode(brandName: string): string {
    return `BRD${brandName.substring(0, 3).toUpperCase()}${Date.now()}`;
  }

}