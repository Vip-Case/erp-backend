import { Decimal } from "@prisma/client/runtime/library";
import { TrendyolAdapter } from "../../adapters/trendyolAdapter";
import { PrismaClient, Prisma, MarketPlaceCategories, MarketPlaceProducts } from "@prisma/client";

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
            const parentCategoryId = category.parentId
              ? await this.findOrCreateCategory(tx, category.parentId)
              : null;

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
                  marketPlaceCategoryParentId: parentCategoryId
                }
              });
            } else {
              // Yoksa oluştur
              await tx.marketPlaceCategories.create({
                data: {
                  marketPlaceCategoryId: category.id.toString(),
                  categoryName: category.name,
                  marketPlaceCategoryParentId: parentCategoryId
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
      return tx.marketPlaceCategories.findUnique({ where: { id: cached } });
    }

    await this.rateLimiter();
    const trendyolCategory = await this.trendyol.getCategoryById(categoryId);

    if (!trendyolCategory) {
      // Önce kategoriyi ara
      const existingCategory = await tx.marketPlaceCategories.findFirst({
        where: { marketPlaceCategoryId: categoryId.toString() }
      });

      if (existingCategory) {
        return existingCategory;
      }

      // Yoksa oluştur
      return tx.marketPlaceCategories.create({
        data: {
          marketPlaceCategoryId: categoryId.toString(),
          categoryName: `Kategori ${categoryId}`
        }
      });
    }

    // Mevcut kategoriyi kontrol et
    const existingCategory = await tx.marketPlaceCategories.findFirst({
      where: { marketPlaceCategoryId: categoryId.toString() }
    });

    if (existingCategory) {
      return tx.marketPlaceCategories.update({
        where: { id: existingCategory.id },
        data: {
          categoryName: trendyolCategory.name,
          marketPlaceCategoryParentId: trendyolCategory.parentId?.toString() || null
        }
      });
    }

    return tx.marketPlaceCategories.create({
      data: {
        marketPlaceCategoryId: categoryId.toString(),
        categoryName: trendyolCategory.name,
        marketPlaceCategoryParentId: trendyolCategory.parentId?.toString() || null
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
            MarketPlaceCategories: category?.id ? {
              connect: { id: category.id }
            } : undefined,
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
            }
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

  // Kategori işlemleri için yardımcı fonksiyon
  private async processCategories(
    tx: Prisma.TransactionClient, 
    marketPlaceProduct: MarketPlaceProducts, 
    stockCardId: string
  ) {
    // id null olabilir kontrolü ekleyelim
    if (!marketPlaceProduct.marketPlaceCategoriesId) return;
  
    // MarketPlaceCategories'den kategoriyi al
    const marketplaceCategory = await tx.marketPlaceCategories.findFirst({
      where: { 
        id: marketPlaceProduct.marketPlaceCategoriesId
      }
    });
  
    if (marketplaceCategory && marketplaceCategory.marketPlaceCategoryId) {
      // StockCardCategory'de bu kategori var mı kontrol et
      let stockCardCategory = await tx.stockCardCategory.findFirst({
        where: {
          categoryCode: marketplaceCategory.marketPlaceCategoryId
        }
      });
  
      if (!stockCardCategory) {
        // Yoksa yeni oluştur
        stockCardCategory = await tx.stockCardCategory.create({
          data: {
            categoryName: marketplaceCategory.categoryName || '',
            categoryCode: marketplaceCategory.marketPlaceCategoryId
          }
        });
      } else {
        // Varsa güncelle
        stockCardCategory = await tx.stockCardCategory.update({
          where: { id: stockCardCategory.id },
          data: {
            categoryName: marketplaceCategory.categoryName || ''
          }
        });
      }
  
      // StockCardCategoryItem oluştur
      await tx.stockCardCategoryItem.create({
        data: {
          categoryId: stockCardCategory.id,
          stockCardId: stockCardId
        }
      });
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
      const productDetails = await this.trendyol.getProductDetails(marketPlaceProduct.barcode || '');
      const stockStatus = await this.trendyol.checkProductAvailability(marketPlaceProduct.barcode || '');

      await prisma.$transaction(async (tx) => {
        let stockCard;

        // StockCard'da eşleşen ürün var mı kontrol et
        const productCode = marketPlaceProduct.productSku || this.generateUniqueCode();
        // Önce barkod kontrolü
        let existingBarcodeCard = null;
        if (marketPlaceProduct.barcode) {
          existingBarcodeCard = await tx.stockCardBarcode.findUnique({
            where: { barcode: marketPlaceProduct.barcode },
            include: { stockCard: true }
          });

          // Eğer barkod varsa ama başka bir ürüne aitse, hata fırlat
          if (existingBarcodeCard) {
            const existingStockCard = await tx.stockCard.findUnique({
              where: { id: existingBarcodeCard.stockCardId },
              include: { barcodes: true }
            });

            if (existingStockCard && existingStockCard.productCode !== productCode) {
              throw new Error(`Bu barkod (${marketPlaceProduct.barcode}) başka bir ürüne ait!`);
            }
          }
        }

        const existingStockCard = await tx.stockCard.findFirst({
          where: {
            productCode: productCode,
          },
          include: {
            barcodes: true,
            brand: true
          }
        });

        if (!existingStockCard) {
          // Yeni StockCard oluştur
          stockCard = await tx.stockCard.create({
            data: {
              productCode: productCode, // SKU için
              modelCode: marketPlaceProduct.productId, // Ürün grubu için
              productName: marketPlaceProduct.productName || '',
              unit: 'Adet',
              productType: marketPlaceProduct.productType === 'Varyasyonlu' ? 'VaryasyonluUrun' : 'BasitUrun',
              description: marketPlaceProduct.description,
              stockStatus: stockStatus.isAvailable || true, // Stok durumu
              barcodes: marketPlaceProduct.barcode && !existingBarcodeCard ? {
                create: [{ barcode: marketPlaceProduct.barcode }]
              } : undefined,
              brandId: await this.matchBrand(tx, marketPlaceProduct.marketPlaceBrandsId),
              Store: {
                connect: {
                  id: this.storeId
                }
              },
            }

          });

          // Kategori ve Attribute işlemlerini yap
          await this.processCategories(tx, marketPlaceProduct, stockCard.id);
          await this.processAttributes(tx, marketPlaceProduct, stockCard.id);
        } else {
          stockCard = existingStockCard;

          // Önce mevcut ilişkileri temizle
          await tx.stockCardCategoryItem.deleteMany({
            where: { stockCardId: stockCard.id }
          });
          await tx.stockCardAttributeItems.deleteMany({
            where: { stockCardId: stockCard.id }
          });

          // Yeni kategori ve attribute ilişkilerini oluştur
          await this.processCategories(tx, marketPlaceProduct, stockCard.id);
          await this.processAttributes(tx, marketPlaceProduct, stockCard.id);

          // Mevcut StockCard'ı güncelle
          await tx.stockCard.update({
            where: { id: stockCard.id },
            data: {
              modelCode: marketPlaceProduct.productId, // Güncelleme sırasında da modelCode'u ekle
              description: marketPlaceProduct.description,
              stockStatus: stockStatus.isAvailable || true,
              barcodes: !existingBarcodeCard && marketPlaceProduct.barcode ? {
                create: [{ barcode: marketPlaceProduct.barcode }]
              } : undefined,
              Store: {
                connect: {
                  id: this.storeId
                }
              }
            }
          });
        }

        // ProductMatch kaydı oluştur
        if (marketPlaceProduct.barcode) {
          await this.createOrUpdateProductMatch(tx, marketPlaceProduct.barcode, stockCard.productCode);
        }

        // Varyant işlemleri
        if (marketPlaceProduct.productType === 'Varyasyonlu') {

          const modelProducts = await this.trendyol.getProductsByModelCode(marketPlaceProduct.productId || '');

          // Eğer model kodu bazlı varyant varsa onları kullan, yoksa mevcut varyantları kullan
          const variations = modelProducts.length > 0
            ? modelProducts.filter(p => p.barcode !== marketPlaceProduct.barcode)
            : await tx.marketPlaceProducts.findMany({
              where: { parentProductId: marketPlaceProduct.id },
              include: { marketPlaceAttributes: true }
            });

          await this.processVariations(tx, marketPlaceProduct, stockCard.productCode, stockCard.id, variations);
        }
      });
    } catch (error) {
      console.error('StockCard eşleştirme hatası:', error);
      throw error;
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
 
  private async processVariations(
    tx: Prisma.TransactionClient,
    marketPlaceProduct: MarketPlaceProducts,
    parentProductCode: string,  
    stockCardId: string,
    variations: any[]
  ): Promise<void> {

    for (const variation of variations) {
      const variationAttributes = variation.marketPlaceAttributes;

      if (Array.isArray(variationAttributes) && variationAttributes.length > 0) {
        const variationName = variationAttributes[0].attributeName || 'Varsayılan';
        const variationValue = variationAttributes[0].valueName || 'Varsayılan';
        const variationCode = this.generateUniqueVariationCode(variationName);

        // Önce mevcut varyasyonu kontrol et
        const existingVariation = await tx.stockCardVariation.findFirst({
          where: {
            stockCardId: stockCardId,
            variationCode: variationCode
          }
        });

        if (!existingVariation) {
          // Önce varyasyonu oluştur
          const createdVariation = await tx.stockCardVariation.create({
            data: {
              stockCardId: stockCardId,
              variationName: variationName,
              variationCode: variationCode,
              variationValue: variationValue
            }
          });

          // Sonra barkodu kontrol et ve ekle
          if (variation?.barcode) {
            const existingBarcode = await tx.stockCardBarcode.findUnique({
              where: { barcode: variation.barcode }
            });

            if (!existingBarcode) {
              await tx.stockCardBarcode.create({
                data: {
                  barcode: variation.barcode,
                  stockCard: {
                    connect: { id: stockCardId }
                  }
                }
              });
            }
          }

          // ProductMatch kaydı oluştur
          await this.createOrUpdateProductMatch(tx, variation.barcode, parentProductCode);
        }
      }
    }
  }

  // Yardımcı fonksiyonlar
  private generateUniqueCode(): string {
    return `PRD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  private generateUniqueBrandCode(brandName: string): string {
    return `BRD${brandName.substring(0, 3).toUpperCase()}${Date.now()}`;
  }

  private generateUniqueVariationCode(variationName: string): string {
    return `VAR${variationName.substring(0, 3).toUpperCase()}${Date.now()}`;
  }
}