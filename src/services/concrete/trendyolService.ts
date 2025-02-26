import { Decimal } from "@prisma/client/runtime/library";
import { TrendyolAdapter } from "../../adapters/trendyolAdapter";
import { PrismaClient, Prisma, MarketPlaceCategories, MarketPlaceProducts, StockUnits, ProductType } from "@prisma/client";
import { TrendyolOrder, TrendyolOrderLine } from "../../adapters/types";
import { TrendyolWebhookUpdateData } from '../../types/trendyolTypes';

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

    try {
        const response = await this.retryOperation(() =>
            this.trendyol.getCategories()
        );

        if (!response.categories?.length) {
            console.log('Kategori bulunamadı');
            return;
        }

        // Tüm kategorileri düzleştirip parent-child ilişkisini koru
        const flattenCategories = (
            categories: TrendyolCategory[],
            parentId: string | null = null
        ): { id: string; name: string; parentId: string | null }[] => {
            return categories.reduce((acc: any[], category) => {
                acc.push({
                    id: category.id.toString(),
                    name: category.name,
                    parentId: parentId
                });

                if (category.subCategories?.length) {
                    acc.push(...flattenCategories(category.subCategories, category.id.toString()));
                }

                return acc;
            }, []);
        };

        const allCategories = flattenCategories(response.categories);
        console.log(`${allCategories.length} kategori işlenecek`);

        // Kategorileri kaydet
        for (const category of allCategories) {
            // 1. MarketPlaceCategories için işlem
            const existingMPCategory = await prisma.marketPlaceCategories.findFirst({
                where: { marketPlaceCategoryId: category.id }
            });

            const parentMPCategory = category.parentId 
                ? await prisma.marketPlaceCategories.findFirst({
                    where: { marketPlaceCategoryId: category.parentId }
                  })
                : null;

            let mpCategory;
            if (existingMPCategory) {
                mpCategory = await prisma.marketPlaceCategories.update({
                    where: { id: existingMPCategory.id },
                    data: {
                        categoryName: category.name,
                        marketPlaceCategoryParentId: parentMPCategory?.id || null
                    }
                });
            } else {
                mpCategory = await prisma.marketPlaceCategories.create({
                    data: {
                        categoryName: category.name,
                        marketPlaceCategoryId: category.id,
                        marketPlaceCategoryParentId: parentMPCategory?.id || null
                    }
                });
            }

            // 2. StockCardCategory için işlem
            const categoryCode = `CAT-${category.id}`;
            const categoryName = `${category.name}_${category.id}`; // Benzersiz isim oluştur

            const existingStockCategory = await prisma.stockCardCategory.findFirst({
                where: { categoryCode }
            });

            const parentStockCategory = category.parentId 
                ? await prisma.stockCardCategory.findFirst({
                    where: { categoryCode: `CAT-${category.parentId}` }
                  })
                : null;

            if (existingStockCategory) {
                await prisma.stockCardCategory.update({
                    where: { id: existingStockCategory.id },
                    data: {
                        categoryName: categoryName,
                        parentCategoryId: parentStockCategory?.id || null
                    }
                });
            } else {
                await prisma.stockCardCategory.create({
                    data: {
                        categoryName: categoryName,
                        categoryCode: categoryCode,
                        parentCategoryId: parentStockCategory?.id || null
                    }
                });
            }

            // StockCardCategoryItem ilişkisini oluştur
            if (mpCategory) {
                const marketPlaceProducts = await prisma.marketPlaceProducts.findMany({
                    where: {
                        MarketPlaceCategories: {
                            some: { id: mpCategory.id }
                        }
                    },
                    select: { barcode: true }
                });

                const barcodes = marketPlaceProducts
                    .map(p => p.barcode)
                    .filter((barcode): barcode is string => barcode !== null);

                const stockCards = await prisma.stockCard.findMany({
                    where: {
                        ProductMatch: {
                            some: {
                                barcode: {
                                    in: barcodes
                                }
                            }
                        }
                    }
                });

                // StockCardCategoryItem oluştur
                for (const stockCard of stockCards) {
                    if (existingStockCategory) {
                        await prisma.stockCardCategoryItem.create({
                            data: {
                                stockCardId: stockCard.id,
                                categoryId: existingStockCategory.id
                            }
                        });
                    }
                }
            }
        }

        console.log('Kategoriler güncellendi');
        await this.loadCaches();

    } catch (error) {
        console.error('Kategori senkronizasyon hatası:', error);
        throw error;
    }
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

    // Önce kategoriyi bul
    const existingCategory = await tx.marketPlaceCategories.findFirst({
      where: { marketPlaceCategoryId: trendyolCategory.id }
    });

    if (existingCategory) {
      await tx.marketPlaceCategories.update({
        where: { id: existingCategory.id },
        data: {
          categoryName: trendyolCategory.name,
          marketPlaceCategoryParentId: trendyolCategory.parentId 
            ? (await tx.marketPlaceCategories.findFirst({
                where: { marketPlaceCategoryId: trendyolCategory.parentId }
              }))?.id 
            : null
        }
      });
    } else {
      await tx.marketPlaceCategories.create({
        data: {
          categoryName: trendyolCategory.name,
          marketPlaceCategoryId: trendyolCategory.id,
          marketPlaceCategoryParentId: trendyolCategory.parentId 
            ? (await tx.marketPlaceCategories.findFirst({
                where: { marketPlaceCategoryId: trendyolCategory.parentId }
              }))?.id 
            : null
        }
      });
    }

    return trendyolCategory;
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
                attributeName: attr.attributeName || null,
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
                attributeName: attr.attributeName || null,
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

  public async updateStock(barcode: string, quantity: number, isTempQuantity: boolean = false) {
    try {
        let stockCard = await prisma.stockCard.findFirst({
            where: {
                barcodes: {
                    some: { barcode: barcode }
                }
            }
        });

        if (!stockCard) {
            throw new Error(`StockCard bulunamadı: ${barcode}`);
        }

        const store = await prisma.store.findUnique({
            where: { id: this.storeId },
            include: { warehouse: true }
        });

        if (!store?.warehouse) {
            throw new Error('Store için warehouse tanımlanmamış');
        }

        // Warehouse kaydını güncelle
        const existingWarehouse = await prisma.stockCardWarehouse.findFirst({
            where: {
                stockCardId: stockCard.id,
                warehouseId: store.warehouse.id
            }
        });

        if (existingWarehouse) {
            await prisma.stockCardWarehouse.update({
                where: { id: existingWarehouse.id },
                data: { quantity: new Prisma.Decimal(isTempQuantity ? 0 : quantity) }
            });
        } else {
            await prisma.stockCardWarehouse.create({
                data: {
                    stockCardId: stockCard.id,
                    warehouseId: store.warehouse.id,
                    quantity: new Prisma.Decimal(isTempQuantity ? 0 : quantity)
                }
            });
        }

        // ProductMatch güncelle
        const productMatch = await prisma.productMatch.findFirst({
            where: { barcode: barcode }
        });

        if (productMatch && isTempQuantity) {
            await prisma.productMatch.update({
                where: { id: productMatch.id },
                data: {
                    isTempQuantity: true,
                    tempQuantity: quantity
                }
            });
        }

        console.log(`Stok güncellendi - Barkod: ${barcode}, Miktar: ${quantity}, Geçici: ${isTempQuantity}`);
    } catch (error) {
        console.error(`Stok güncelleme hatası - Barkod: ${barcode}:`, error);
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
                }
            }
        });

        if (!stockCardWarehouse?.stockCard?.barcodes?.length) {
            throw new Error('Ürün bilgileri bulunamadı');
        }

        const productMatch = stockCardWarehouse.stockCard.ProductMatch?.[0];
        const barcode = stockCardWarehouse.stockCard.barcodes[0].barcode;

        // Stok miktarı kontrolü
        const quantity = productMatch?.isTempQuantity && productMatch.tempQuantity !== null
            ? new Prisma.Decimal(productMatch.tempQuantity)
            : stockCardWarehouse.quantity || new Prisma.Decimal(0);

        await this.trendyol.updateProductStock({
            items: [{
                barcode: barcode,
                quantity: Number(quantity)
            }]
        });

        console.log(`Stok başarıyla güncellendi: ${barcode}, Miktar: ${quantity}`);
    } catch (error) {
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

  async createWebhook(data: {
    url: string;
    username: string; 
    password: string;
    authenticationType: "BASIC_AUTHENTICATION";
    subscribedStatuses?: string[];
  }) {
    await this.initialize();
    
    try {
      // Varsayılan durumları ekleyelim
      const subscribedStatuses = data.subscribedStatuses || [
        "CREATED", "PICKING", "INVOICED", "SHIPPED", "CANCELLED", 
        "DELIVERED", "UNDELIVERED", "RETURNED", "UNSUPPLIED", "UNPACKED", "AT_COLLECTION_POINT", "VERIFIED"
      ];
      
      console.log(`Webhook oluşturma isteği: ${data.url}`);
      
      // Retry mekanizması ekleyelim
      let retries = 3;
      let result;
      
      while (retries > 0) {
        try {
          result = await this.trendyol.createWebhook({
            url: data.url,
            username: data.username,
            password: data.password,
            authenticationType: data.authenticationType,
            subscribedStatuses
          });
          break; // Başarılı olursa döngüden çık
        } catch (error: any) {
          retries--;
          if (retries === 0) throw error;
          
          console.log(`Webhook oluşturma başarısız, tekrar deneniyor (${retries} deneme kaldı): ${error.message}`);
          await this.delay(2000); // 2 saniye bekle
        }
      }
      
      console.log('Webhook created:', result);
      return result;
    } catch (error) {
      console.error('Webhook oluşturma hatası:', error);
      throw error;
    }
  }

  async listWebhooks() {
    try {
      await this.initialize();
      const webhooks = await this.trendyol.getWebhooks();
      return webhooks;
    } catch (error) {
      console.error('Get webhooks error:', error);
      throw error;
    }
  }

  /**
   * Webhook'u günceller
   * @param webhookId Güncellenecek webhook ID'si
   * @param updateData Güncellenecek veriler
   * @returns Başarılı olup olmadığı bilgisi
   */
  async updateWebhook(webhookId: string, updateData: TrendyolWebhookUpdateData): Promise<boolean> {
    try {
      await this.initialize();
      return await this.trendyol.updateWebhook(webhookId, updateData);
    } catch (error) {
      console.error('Webhook güncelleme hatası:', error);
      return false;
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.initialize();
    
    try {
      // Zaman aşımı süresini artıralım
      const timeout = 30000; // 30 saniye
      
      // Retry mekanizması ekleyelim
      let retries = 3;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          await this.trendyol.deleteWebhook(webhookId, timeout);
          success = true;
          console.log(`Webhook silindi: ${webhookId}`);
        } catch (error: any) {
          retries--;
          if (retries === 0) throw error;
          
          console.log(`Webhook silme başarısız, tekrar deneniyor (${retries} deneme kaldı): ${error.message}`);
          await this.delay(2000); // 2 saniye bekle
        }
      }
    } catch (error) {
      console.error(`Webhook silme hatası (${webhookId}):`, error);
      throw error;
    }
  }

  async syncOrders(): Promise<void> {
    try {
      await this.initialize();
      
      const store = await prisma.store.findUniqueOrThrow({
        where: { id: this.storeId }
      });

      let totalProcessed = 0;
      let totalErrors = 0;

      // Tüm sipariş statülerini tanımlayalım
      const orderStatuses = [
        'Created',       // Gönderime hazır
        'Picking',       // Toplama/paketleme aşamasında
        'Invoiced',      // Faturası kesilmiş
        'Shipped',       // Kargoya verilmiş
        'AtCollectionPoint', // PUDO noktasında
        'Cancelled',     // İptal edilmiş
        'UnPacked',      // Paketi bölünmüş
        'Delivered',     // Teslim edilmiş
        'UnDelivered',   // Teslim edilememiş
        'UnDeliveredAndReturned', // İade edilmiş
        'Returned',      // İade
        'Repack',        // Yeniden paketleme
        'UnSupplied'     // Tedarik edilememiş
      ];

      const size = 20;

      for (const status of orderStatuses) {
        console.log(`\n${status} durumundaki siparişler alınıyor...`);
        
        let page = 0;
        let hasMore = true;

        while (hasMore) {
          const response = await this.trendyol.getOrders(
            status, 
            size, 
            page,
            'PackageLastModifiedDate',  // Son güncellemeye göre sırala
            'DESC'                      // Yeniden eskiye
          );

          if (!response.content || response.content.length === 0) {
            console.log(`${status} durumunda sipariş yok`);
            break;
          }

          console.log(`${response.content.length} sipariş bulundu (Sayfa ${page + 1}/${response.totalPages})`);

          for (const orderData of response.content) {
            try {
              await prisma.$transaction(async (tx) => {
                await this.processOrder(tx, orderData, store.id);
              });
              console.log(`Sipariş işlendi: ${orderData.orderNumber} (${status})`);
              totalProcessed++;
            } catch (err: any) {
              if (err.message?.includes('Merchant SKU eksik')) {
                console.warn(`Sipariş işlenirken uyarı (${orderData.orderNumber}): ${err.message}`);
                totalProcessed++;
              } else {
                console.error(`Sipariş işleme hatası (${orderData.orderNumber}):`, err);
                totalErrors++;
              }
            }
          }

          page++;
          hasMore = page < response.totalPages;

          // Rate limiting - Her sayfa sonrası bekle
          await this.delay(5000);
        }
      }

      console.log(`\nSipariş senkronizasyonu tamamlandı:
        Toplam İşlenen: ${totalProcessed}
        Başarısız: ${totalErrors}
      `);

    } catch (error) {
      console.error('Sipariş senkronizasyon hatası:', error);
      throw error;
    }
  }

  private async processOrder(
    tx: Prisma.TransactionClient,
    orderData: TrendyolOrder,
    storeId: string
  ): Promise<void> {
    try {
      // Mevcut siparişi kontrol et
      const existingOrder = await tx.order.findFirst({
        where: {
          platformOrderId: orderData.orderNumber,
          platform: 'Trendyol'
        },
        include: {
          items: true,
          cargos: true
        }
      });

      if (existingOrder) {
        // Durum değişmişse (örn: 'Picking' -> 'Shipped')
        if (existingOrder.status !== orderData.status) {
          await tx.order.update({
            where: { id: existingOrder.id },
            data: {
              status: orderData.status,
              updatedAt: new Date()
            }
          });
          console.log(`Sipariş durumu güncellendi: ${orderData.orderNumber} -> ${orderData.status}`);
        }

        // Kargo bilgisi değiştiyse güncelle
        if (orderData.cargoTrackingNumber) {
          const currentCargo = existingOrder.cargos[0];
          const newTrackingNumber = orderData.cargoTrackingNumber.toString();

          if (!currentCargo || currentCargo.trackingNumber !== newTrackingNumber) {
            // Eski kargo kaydını sil
            if (currentCargo) {
              await tx.orderCargo.delete({
                where: { id: currentCargo.id }
              });
            }

            // Yeni kargo kaydı ekle
            await tx.orderCargo.create({
              data: {
                orderId: existingOrder.id,
                name: orderData.cargoProviderName || 'Trendyol Kargo',
                shortName: orderData.cargoProviderName?.split(' ')[0] || 'TY',
                trackingNumber: newTrackingNumber,
                deliveredAt: orderData.status === 'Delivered' ? new Date() : null
              }
            });

            console.log(`Kargo bilgisi güncellendi: ${orderData.orderNumber}`);
          }
        }

        return; // Diğer bilgiler aynı kalır
      }

      // Önce siparişi oluştur
      const order = await tx.order.create({
        data: {
          platformOrderId: orderData.orderNumber,
          platform: 'Trendyol',
          customerId: orderData.customerId.toString(),
          status: orderData.status,
          currency: orderData.currencyCode || 'TRY',
          orderDate: new Date(orderData.orderDate),
          totalPrice: Number(orderData.totalPrice),
          deliveryType: orderData.deliveryAddressType,
          cargoCompany: orderData.cargoProviderName,
          storeId: storeId,
        }
      });

      // Fatura adresini oluştur
      const billingAddress = await tx.orderInvoiceAddress.create({
        data: {
          orderId: order.id,
          address: orderData.invoiceAddress.address1,
          city: orderData.invoiceAddress.city,
          district: orderData.invoiceAddress.district,
          postalCode: orderData.invoiceAddress.postalCode,
          country: orderData.invoiceAddress.countryCode,
          fullName: orderData.invoiceAddress.fullName,
          email: orderData.invoiceAddress.email || null,
          paymentMethod: 'Individual'
        }
      });

      // Teslimat adresi
      const shippingAddress = await tx.orderInvoiceAddress.create({
        data: {
          orderId: order.id,
          address: orderData.shipmentAddress.address1,
          city: orderData.shipmentAddress.city,
          district: orderData.shipmentAddress.district,
          postalCode: orderData.shipmentAddress.postalCode,
          country: orderData.shipmentAddress.countryCode,
          fullName: orderData.shipmentAddress.fullName,
          email: orderData.shipmentAddress.email || null,
          paymentMethod: 'Individual'
        }
      });

      // Sipariş adres ilişkilerini güncelle
      await tx.order.update({
        where: { id: order.id },
        data: {
          billingAddressId: billingAddress.id,
          shippingAddressId: shippingAddress.id
        }
      });

      // Sipariş kalemlerini oluştur
      for (const line of orderData.lines) {
        try {
          this.validateOrderLine(line);
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: line.quantity,
              unitPrice: new Prisma.Decimal(line.price),
              totalPrice: new Prisma.Decimal(line.price * line.quantity),
              stockCardId: null,
              productName: line.productName,
              productCode: BigInt(line.productCode),
              barcode: line.barcode || null,
              merchantSku: line.merchantSku || null,
              productSize: line.productSize || null,
              productColor: line.productColor || null,
              productOrigin: line.productOrigin || null,
              salesCampaignId: line.salesCampaignId ? BigInt(line.salesCampaignId) : null,
              merchantId: line.merchantId ? BigInt(line.merchantId) : null,
              amount: line.amount ? new Prisma.Decimal(line.amount) : null,
              discount: line.discount ? new Prisma.Decimal(line.discount) : null,
              tyDiscount: line.tyDiscount ? new Prisma.Decimal(line.tyDiscount) : null,
              vatBaseAmount: line.vatBaseAmount ? new Prisma.Decimal(line.vatBaseAmount) : null,
              currencyCode: line.currencyCode || 'TRY',
              sku: line.sku || null,
              orderLineId: line.id ? BigInt(line.id) : null,
              orderLineItemStatusName: line.orderLineItemStatusName || null,
              
              discountDetails: {
                create: line.discountDetails?.map(detail => ({
                  lineItemPrice: new Prisma.Decimal(detail.lineItemPrice),
                  lineItemDiscount: new Prisma.Decimal(detail.lineItemDiscount),
                  lineItemTyDiscount: new Prisma.Decimal(detail.lineItemTyDiscount)
                })) || []
              }
            }
          });

          console.log(`Ürün detayları kaydedildi: 
            Ürün Adı: ${line.productName}
            Ürün Kodu: ${line.productCode}
            Barkod: ${line.barcode || 'Yok'}
            Merchant SKU: ${line.merchantSku || 'Yok'}
            Durum: ${line.orderLineItemStatusName || 'Belirtilmemiş'}
          `);
        } catch (error: any) {
          console.error(`Ürün kaydı hatası:
            Ürün: ${line.productName}
            Hata: ${error.message}
          `);
          throw error;
        }
      }

      // Kargo bilgisi varsa ekle
      if (orderData.cargoTrackingNumber) {
        await tx.orderCargo.create({
          data: {
            orderId: order.id,
            name: orderData.cargoProviderName || 'Trendyol Kargo',
            shortName: orderData.cargoProviderName?.split(' ')[0] || 'TY',
            trackingNumber: orderData.cargoTrackingNumber.toString()
          }
        });
      }

      console.log(`Sipariş oluşturuldu: ${order.platformOrderId}`);

      console.log(`Sipariş detayları:
        Sipariş No: ${orderData.orderNumber}
        Müşteri: ${orderData.customerId}
        Durum: ${orderData.status}
        Toplam: ${orderData.totalPrice} ${orderData.currencyCode}
        Kargo: ${orderData.cargoProviderName || 'Belirtilmemiş'}
        Takip No: ${orderData.cargoTrackingNumber || 'Yok'}
        Ürün Sayısı: ${orderData.lines.length}
      `);
    } catch (error) {
      console.error(`Sipariş işleme hatası (${orderData.orderNumber}):`, error);
      throw error;
    }
  }

  private validateOrderLine(line: TrendyolOrderLine): void {
    if (!line.productCode) {
      throw new Error(`Ürün kodu eksik: ${line.productName}`);
    }

    if (!line.price || line.price <= 0) {
      throw new Error(`Geçersiz fiyat: ${line.productName}`);
    }
  }

  async syncOrderById(orderNumber: string, webhookData?: any): Promise<void> {
    await this.initialize();
    
    try {
      // Önce API'den sipariş detaylarını almayı dene
      let orderDetails = await this.trendyol.getOrderById(orderNumber);
      
      // API'den veri alınamazsa ve webhook verileri varsa, onları kullan
      if (!orderDetails && webhookData) {
        console.log(`API'den sipariş detayları alınamadı, webhook verilerini kullanıyoruz: ${orderNumber}`);
        orderDetails = webhookData;
      }
      
      if (!orderDetails) {
        throw new Error(`Sipariş bulunamadı: ${orderNumber}`);
      }
      
      // Önce siparişin zaten var olup olmadığını kontrol et
      const existingOrder = await prisma.order.findFirst({
        where: {
          platformOrderId: orderNumber,
          platform: 'Trendyol'
        }
      });
      
      if (existingOrder) {
        // Sipariş zaten varsa, sadece durumunu güncelle
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            status: (orderDetails as any).status || (orderDetails as any).shipmentPackageStatus || existingOrder.status,
            updatedAt: new Date()
          }
        });
        
        console.log(`Sipariş güncellendi: ${orderNumber}, Durum: ${(orderDetails as any).status || (orderDetails as any).shipmentPackageStatus}`);
      } else {
        // Sipariş yoksa, yeni sipariş oluştur
        await prisma.$transaction(async (tx) => {
          // Mevcut processOrderInTransaction metodunu kullan
          await this.processOrderInTransaction(tx, orderDetails, this.storeId);
        });
        
        console.log(`Yeni sipariş oluşturuldu: ${orderNumber}`);
      }
    } catch (error) {
      console.error(`Sipariş senkronizasyon hatası (${orderNumber}):`, error);
      throw error;
    }
  }

  async updateOrderStatus(orderNumber: string, webhookData?: any): Promise<void> {
    await this.initialize();
    
    try {
      // Önce API'den sipariş detaylarını almayı dene
      let orderDetails = await this.trendyol.getOrderById(orderNumber);
      
      // API'den veri alınamazsa ve webhook verileri varsa, onları kullan
      if (!orderDetails && webhookData) {
        console.log(`API'den sipariş detayları alınamadı, webhook verilerini kullanıyoruz: ${orderNumber}`);
        orderDetails = webhookData;
      }
      
      if (!orderDetails) {
        throw new Error(`Sipariş bulunamadı: ${orderNumber}`);
      }
      
      // Siparişi bul
      const order = await prisma.order.findFirst({
        where: {
          platformOrderId: orderNumber,
          platform: 'Trendyol'
        }
      });
      
      if (!order) {
        throw new Error(`Sipariş bulunamadı: ${orderNumber}`);
      }
      
      // Sipariş durumunu güncelle
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: (orderDetails as any).status || (orderDetails as any).shipmentPackageStatus || order.status,
          updatedAt: new Date()
        }
      });
      
      // Kargo bilgilerini güncelle
      if (orderDetails.cargoTrackingNumber) {
        const existingCargo = await prisma.orderCargo.findFirst({
          where: { orderId: order.id }
        });
        
        if (existingCargo) {
          await prisma.orderCargo.update({
            where: { id: existingCargo.id },
            data: {
              trackingNumber: orderDetails.cargoTrackingNumber.toString(),
              name: orderDetails.cargoProviderName || existingCargo.name
            }
          });
        } else {
          await prisma.orderCargo.create({
            data: {
              orderId: order.id,
              name: orderDetails.cargoProviderName || 'Trendyol Kargo',
              shortName: orderDetails.cargoProviderName?.split(' ')[0] || 'TY',
              trackingNumber: orderDetails.cargoTrackingNumber.toString()
            }
          });
        }
      }
      
      console.log(`Sipariş durumu güncellendi: ${orderNumber} - ${(orderDetails as any).status || (orderDetails as any).shipmentPackageStatus}`);
    } catch (error) {
      console.error(`Sipariş durumu güncelleme hatası (${orderNumber}):`, error);
      throw error;
    }
  }

  private async processOrderInTransaction(tx: any, orderData: any, storeId: string): Promise<void> {
    try {
      // Sipariş tarihini doğru formata çevir
      const orderDate = new Date(parseInt(orderData.orderDate));
      
      // Sipariş oluştur
      const order = await tx.order.create({
        data: {
          platformOrderId: orderData.orderNumber,
          platform: 'Trendyol',
          customerId: orderData.customerId?.toString() || '0',
          status: orderData.status || orderData.shipmentPackageStatus || 'Created',
          currency: orderData.currencyCode || 'TRY',
          orderDate: isNaN(orderDate.getTime()) ? new Date() : orderDate,
          totalPrice: orderData.totalPrice || 0,
          deliveryType: orderData.deliveryType || null,
          cargoCompany: orderData.cargoProviderName || null,
          storeId: storeId
        }
      });
      
      // Sipariş kalemleri oluştur
      if (orderData.lines && Array.isArray(orderData.lines)) {
        for (const line of orderData.lines) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              quantity: line.quantity || 1,
              unitPrice: new Prisma.Decimal(line.price || 0),
              totalPrice: new Prisma.Decimal((line.price || 0) * (line.quantity || 1)),
              productName: line.productName || 'Ürün',
              productCode: BigInt(line.productCode?.toString() || '0'),
              barcode: line.barcode || null,
              merchantSku: line.merchantSku || null,
              productSize: line.productSize || null,
              productColor: line.productColor || null,
              productOrigin: line.productOrigin || null,
              salesCampaignId: line.salesCampaignId ? BigInt(line.salesCampaignId.toString()) : null,
              merchantId: line.merchantId ? BigInt(line.merchantId.toString()) : null,
              amount: line.amount ? new Prisma.Decimal(line.amount) : null,
              discount: line.discount ? new Prisma.Decimal(line.discount) : null,
              tyDiscount: line.tyDiscount ? new Prisma.Decimal(line.tyDiscount) : null,
              vatBaseAmount: line.vatBaseAmount ? new Prisma.Decimal(line.vatBaseAmount) : null,
              currencyCode: line.currencyCode || 'TRY',
              sku: line.sku || null,
              orderLineId: line.id ? BigInt(line.id.toString()) : null,
              orderLineItemStatusName: line.orderLineItemStatusName || null
            }
          });
        }
      }
      
      // Adres bilgilerini oluştur
      if (orderData.shipmentAddress) {
        const shippingAddress = await tx.orderInvoiceAddress.create({
          data: {
            orderId: order.id,
            address: orderData.shipmentAddress.address1 || '',
            city: orderData.shipmentAddress.city || '',
            district: orderData.shipmentAddress.district || '',
            postalCode: orderData.shipmentAddress.postalCode || '',
            country: orderData.shipmentAddress.countryCode || 'TR',
            fullName: orderData.shipmentAddress.fullName || '',
            email: orderData.customerEmail || '',
            paymentMethod: 'Individual'
          }
        });
        
        // Sipariş adres ilişkisini güncelle
        await tx.order.update({
          where: { id: order.id },
          data: {
            shippingAddressId: shippingAddress.id
          }
        });
      }
      
      if (orderData.invoiceAddress) {
        const billingAddress = await tx.orderInvoiceAddress.create({
          data: {
            orderId: order.id,
            address: orderData.invoiceAddress.address1 || '',
            city: orderData.invoiceAddress.city || '',
            district: orderData.invoiceAddress.district || '',
            postalCode: orderData.invoiceAddress.postalCode || '',
            country: orderData.invoiceAddress.countryCode || 'TR',
            fullName: orderData.invoiceAddress.fullName || '',
            email: orderData.customerEmail || '',
            paymentMethod: 'Individual'
          }
        });
        
        // Sipariş adres ilişkisini güncelle
        await tx.order.update({
          where: { id: order.id },
          data: {
            billingAddressId: billingAddress.id
          }
        });
      }
      
      // Kargo bilgisi varsa ekle
      if (orderData.cargoTrackingNumber) {
        await tx.orderCargo.create({
          data: {
            orderId: order.id,
            name: orderData.cargoProviderName || 'Trendyol Kargo',
            shortName: orderData.cargoProviderName?.split(' ')[0] || 'TY',
            trackingNumber: orderData.cargoTrackingNumber.toString()
          }
        });
      }
    } catch (error) {
      console.error('Sipariş işleme hatası:', error);
      throw error;
    }
  }

  async updateRecentOrders(hours: number = 24): Promise<void> {
    try {
      const recentOrders = await prisma.order.findMany({
        where: {
          platform: 'Trendyol',
          createdAt: {
            gte: new Date(Date.now() - hours * 60 * 60 * 1000)
          },
          status: {
            notIn: ['Delivered', 'Cancelled', 'UnDelivered'] // Son duruma gelmiş siparişleri atlayalım
          }
        },
        select: {
          platformOrderId: true
        }
      });

      console.log(`${recentOrders.length} sipariş güncellenecek`);

      for (const order of recentOrders) {
        try {
          await this.updateOrderStatus(order.platformOrderId);
          // Rate limit aşımını engellemek için bekle
          await this.delay(300);
        } catch (error) {
          console.error(`Sipariş güncelleme hatası (${order.platformOrderId}):`, error);
        }
      }

    } catch (error) {
      console.error('Toplu sipariş güncelleme hatası:', error);
      throw error;
    }
  }

  /**
   * Webhook'u aktifleştirir
   * @param webhookId Aktifleştirilecek webhook ID'si
   * @returns Başarılı olup olmadığı bilgisi
   */
  async activateWebhook(webhookId: string): Promise<boolean> {
    try {
      await this.initialize();
      return await this.trendyol.activateWebhook(webhookId);
    } catch (error) {
      console.error('Webhook aktivasyon hatası:', error);
      return false;
    }
  }

  /**
   * Webhook'u pasifleştirir
   * @param webhookId Pasifleştirilecek webhook ID'si
   * @returns Başarılı olup olmadığı bilgisi
   */
  async deactivateWebhook(webhookId: string): Promise<boolean> {
    try {
      await this.initialize();
      return await this.trendyol.deactivateWebhook(webhookId);
    } catch (error) {
      console.error('Webhook deaktivasyon hatası:', error);
      return false;
    }
  }

}