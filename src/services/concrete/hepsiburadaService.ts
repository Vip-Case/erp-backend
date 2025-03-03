import { PrismaClient } from "@prisma/client";
import { HepsiburadaAdapter } from "../../adapters/hepsiburadaAdapter";
import { HepsiburadaCredentials } from "../../types/hepsiburadaTypes";

const prisma = new PrismaClient();

export class HepsiburadaService {
  private hepsiburada!: HepsiburadaAdapter;
  private isInitialized = false;

  constructor(private readonly storeId: string) {}

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      const store = await prisma.store.findUnique({
        where: { id: this.storeId }
      });

      if (!store) {
        throw new Error(`Store bulunamadı: ${this.storeId}`);
      }

      // Store'dan API kimlik bilgilerini al
      let credentials: HepsiburadaCredentials;
      
      if (store.apiCredentials) {
        try {
          credentials = JSON.parse(store.apiCredentials);
        } catch (e) {
          console.error("API kimlik bilgileri JSON formatında değil:", e);
          throw new Error("API kimlik bilgileri geçersiz format");
        }
      } else {
        // Varsayılan kimlik bilgileri (test için)
        credentials = {
          merchantId: "d8ee7b73-89af-47de-bc17-b3b33f9af604",
          secretKey: "PwHbXfwjN5aB",
          userAgent: "vipcase_dev",
          baseUrl: "https://marketplace-api-sit.hepsiburada.com"
        };
      }

      this.hepsiburada = new HepsiburadaAdapter(credentials);
      this.isInitialized = true;
      
      console.log(`Hepsiburada servisi başlatıldı. Store ID: ${this.storeId}`);
    } catch (error) {
      console.error("Başlatma hatası:", error);
      throw new Error("Hepsiburada servisi başlatılamadı");
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.initialize();
      return await this.hepsiburada.testConnection();
    } catch (error) {
      console.error("Bağlantı testi hatası:", error);
      return false;
    }
  }

  // Tüm kategorileri çekme
  async getCategories(page: number = 0, size: number = 1000): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getCategories(page, size);
    } catch (error) {
      console.error('Kategoriler alınamadı:', error);
      throw error;
    }
  }

  // Kategori özelliklerini çekme
  async getCategoryAttributes(categoryId: number): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getCategoryAttributes(categoryId);
    } catch (error) {
      console.error(`Kategori özellikleri alınamadı (categoryId: ${categoryId}):`, error);
      throw error;
    }
  }

  // Özellik değerlerini çekme
  async getAttributeValues(categoryId: number, attributeId: string, page: number = 0, limit: number = 1000): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getAttributeValues(categoryId, attributeId, page, limit);
    } catch (error) {
      console.error(`Özellik değerleri alınamadı (categoryId: ${categoryId}, attributeId: ${attributeId}):`, error);
      throw error;
    }
  }

  // Kategorileri çekip veritabanına kaydetme
  async syncCategories(): Promise<any> {
    try {
      await this.initialize();
      
      // MarketPlace ID'sini al
      const marketPlace = await prisma.marketPlace.findFirst({
        where: { name: "Hepsiburada" }
      });
      
      if (!marketPlace) {
        throw new Error("Hepsiburada marketplace bulunamadı");
      }
      
      // Tüm kategorileri çek
      let page = 0;
      const size = 1000;
      let hasMore = true;
      let totalSaved = 0;
      
      while (hasMore) {
        const response = await this.hepsiburada.getCategories(page, size);
        
        if (!response.data || response.data.length === 0) {
          hasMore = false;
          continue;
        }
        
        // Kategorileri veritabanına kaydet
        for (const category of response.data) {
          // Önce parent kategoriyi bul veya oluştur
          let parentCategoryId = null;
          if (category.parentCategoryId) {
            const parentCategory = await prisma.marketPlaceCategories.findFirst({
              where: {
                marketPlaceCategoryId: category.parentCategoryId.toString()
              }
            });
            
            if (parentCategory) {
              parentCategoryId = parentCategory.id;
            } else {
              // Parent kategori yoksa oluştur
              const newParentCategory = await prisma.marketPlaceCategories.create({
                data: {
                  categoryName: "Parent Category", // API'den parent ismi alınamıyorsa
                  marketPlaceCategoryId: category.parentCategoryId.toString()
                }
              });
              parentCategoryId = newParentCategory.id;
            }
          }
          
          // Kategoriyi oluştur veya güncelle
          await prisma.marketPlaceCategories.upsert({
            where: {
              id: await this.getCategoryIdByExternalId(category.categoryId.toString())
            },
            update: {
              categoryName: category.name,
              marketPlaceCategoryParentId: parentCategoryId
            },
            create: {
              categoryName: category.name,
              marketPlaceCategoryId: category.categoryId.toString(),
              marketPlaceCategoryParentId: parentCategoryId
            }
          });
          
          totalSaved++;
        }
        
        // Sonraki sayfa
        page++;
        hasMore = !response.last;
      }
      
      return { success: true, totalSaved };
    } catch (error) {
      console.error('Kategoriler senkronize edilemedi:', error);
      throw error;
    }
  }

  // Kategori özelliklerini çekip veritabanına kaydetme
  async syncCategoryAttributes(categoryId: string): Promise<any> {
    try {
      await this.initialize();
      
      // Kategoriyi bul
      const category = await prisma.marketPlaceCategories.findUnique({
        where: { id: categoryId }
      });
      
      if (!category) {
        throw new Error(`Kategori bulunamadı: ${categoryId}`);
      }
      
      // MarketPlace ID'sini al
      const marketPlace = await prisma.marketPlace.findFirst({
        where: { name: "Hepsiburada" }
      });
      
      if (!marketPlace) {
        throw new Error("Hepsiburada marketplace bulunamadı");
      }
      
      // Kategori özelliklerini çek
      const response = await this.hepsiburada.getCategoryAttributes(parseInt(category.marketPlaceCategoryId || "0"));
      
      console.log("API Yanıtı:", JSON.stringify(response, null, 2));
      
      if (!response.data) {
        return { success: true, totalSaved: 0 };
      }
      
      let totalSaved = 0;
      
      // Tüm özellik gruplarını birleştir
      const allAttributes = [
        ...(response.data.baseAttributes || []),
        ...(response.data.attributes || []),
        ...(response.data.variantAttributes || [])
      ];
      
      console.log(`Toplam ${allAttributes.length} özellik işlenecek`);
      
      // Özellikleri veritabanına kaydet
      for (const attribute of allAttributes) {
        if (!attribute || !attribute.id || !attribute.name) {
          console.log("Geçersiz özellik verisi:", attribute);
          continue;
        }
        
        await prisma.marketPlaceAttributes.upsert({
          where: {
            id: await this.getAttributeIdByExternalId(attribute.id)
          },
          update: {
            attributeName: attribute.name,
            required: attribute.mandatory || false,
            allowCustom: attribute.multiValue || false
          },
          create: {
            marketPlaceId: marketPlace.id,
            MarketPlaceCategoriesId: category.id,
            attributeName: attribute.name,
            attributeMarketPlaceId: attribute.id,
            required: attribute.mandatory || false,
            allowCustom: attribute.multiValue || false
          }
        });
        
        totalSaved++;
        
        // Eğer özellik enum tipindeyse, değerlerini de çek ve kaydet
        if (attribute.type === 'enum') {
          try {
            await this.syncAttributeValues(
              category.marketPlaceCategoryId || "0", 
              attribute.id, 
              await this.getAttributeIdByExternalId(attribute.id)
            );
          } catch (error: any) {
            // 404 hatası normal kabul edilebilir
            if (error.message && error.message.includes('404')) {
              console.log(`Özellik değerleri bulunamadı (attributeId: ${attribute.id}), bu normal olabilir.`);
            } else {
              console.error(`Özellik değerleri senkronize edilemedi (attributeId: ${attribute.id}):`, error);
            }
            // Devam et, diğer özellikleri işlemeye devam et
          }
        }
      }
      
      return { success: true, totalSaved };
    } catch (error) {
      console.error(`Kategori özellikleri senkronize edilemedi (categoryId: ${categoryId}):`, error);
      throw error;
    }
  }

  // Özellik değerlerini çekip veritabanına kaydetme
  async syncAttributeValues(categoryExternalId: string, attributeExternalId: string, marketPlaceAttributeId: string): Promise<any> {
    try {
      await this.initialize();
      
      console.log(`Özellik değerleri çekiliyor: categoryId=${categoryExternalId}, attributeId=${attributeExternalId}`);
      
      // Özellik değerlerini çek
      let page = 0;
      const limit = 1000;
      let hasMore = true;
      let totalSaved = 0;
      
      while (hasMore) {
        try {
          const response = await this.hepsiburada.getAttributeValues(
            parseInt(categoryExternalId),
            attributeExternalId,
            page,
            limit
          );
          
          console.log(`Özellik değerleri yanıtı:`, JSON.stringify(response, null, 2));
          
          if (!response.data || response.data.length === 0) {
            hasMore = false;
            continue;
          }
          
          // Değerleri veritabanına kaydet
          for (const value of response.data) {
            if (!value || !value.id || !value.value) {
              console.log("Geçersiz değer verisi:", value);
              continue;
            }
            
            await prisma.marketPlaceAttributes.update({
              where: { id: marketPlaceAttributeId },
              data: {
                valueName: value.value,
                valueMarketPlaceId: value.id
              }
            });
            
            totalSaved++;
          }
          
          // Sonraki sayfa
          page++;
          hasMore = response.data.length === limit;
        } catch (error) {
          console.error(`Sayfa ${page} için özellik değerleri alınamadı:`, error);
          hasMore = false;
        }
      }
      
      return { success: true, totalSaved };
    } catch (error) {
      console.error(`Özellik değerleri senkronize edilemedi (categoryExternalId: ${categoryExternalId}, attributeExternalId: ${attributeExternalId}):`, error);
      throw error;
    }
  }

  // Yardımcı metod: CategoryId'ye göre kategori ID'sini bul
  private async getCategoryIdByExternalId(externalId: string): Promise<string> {
    const category = await prisma.marketPlaceCategories.findFirst({
      where: {
        marketPlaceCategoryId: externalId
      }
    });
    
    return category?.id || "0";
  }

  // Yardımcı metod: AttributeId'ye göre özellik ID'sini bul
  private async getAttributeIdByExternalId(externalId: string): Promise<string> {
    const attribute = await prisma.marketPlaceAttributes.findFirst({
      where: {
        attributeMarketPlaceId: externalId
      }
    });
    
    return attribute?.id || "0";
  }

  // Yardımcı metod: ExternalId'ye göre ürün ID'sini bul
  private async getProductIdByExternalId(externalId: string): Promise<string> {
    const product = await prisma.marketPlaceProducts.findFirst({
      where: {
        OR: [
          { productId: externalId },
          { productSku: externalId }
        ]
      }
    });
    
    return product?.id || "0";
  }

  // Listing'leri senkronize etme
  async syncListings(): Promise<any> {
    try {
      await this.initialize();
      
      // MarketPlace ID'sini al
      const marketPlace = await prisma.marketPlace.findFirst({
        where: { name: "Hepsiburada" }
      });
      
      if (!marketPlace) {
        throw new Error("Hepsiburada marketplace bulunamadı");
      }
      
      // Tüm listingleri çek
      let page = 0;
      const size = 100;
      let hasMore = true;
      let totalSaved = 0;
      
      while (hasMore) {
        const response = await this.hepsiburada.getListings(page, size);
        
        // API yanıtını kontrol et
        if (page === 0) {
          console.log("API yanıt yapısı:", Object.keys(response));
        }
        
        // Doğru veri yapısını belirle
        const listings = response.listings || [];
        
        if (!Array.isArray(listings)) {
          console.error("Listings bir dizi değil:", listings);
          return { success: false, error: "Listings bir dizi değil", totalSaved };
        }
        
        console.log(`Sayfa ${page}: ${listings.length} adet listing bulundu.`);
        
        if (listings.length === 0) {
          hasMore = false;
          continue;
        }
        
        // Veritabanına kaydet
        for (const listing of listings) {
          try {
            // Listing detaylarını çek
            let listingDetail;
            try {
              listingDetail = await this.hepsiburada.getListing(listing.hepsiburadaSku, listing.merchantSku);
            } catch (detailError) {
              console.warn(`Listing detayları alınamadı: ${listing.hepsiburadaSku}`, detailError);
              // Detay alınamazsa listing verisiyle devam et
              listingDetail = { data: listing };
            }
            
            const detail = listingDetail.data || listing;
            
            // Kategori bilgisini bul veya oluştur
            let categoryId = null;
            if (detail.categoryId) {
              const category = await prisma.marketPlaceCategories.findFirst({
                where: {
                  marketPlaceCategoryId: detail.categoryId.toString()
                }
              });
              
              if (category) {
                categoryId = category.id;
              } else if (detail.categoryName) {
                // Kategori yoksa oluştur
                const newCategory = await prisma.marketPlaceCategories.create({
                  data: {
                    categoryName: detail.categoryName,
                    marketPlaceCategoryId: detail.categoryId.toString()
                  }
                });
                categoryId = newCategory.id;
              }
            }
            
            // Marka bilgisini bul veya oluştur
            let brandId = null;
            if (detail.brand) {
              const brand = await prisma.marketPlaceBrands.findFirst({
                where: {
                  brandName: detail.brand
                }
              });
              
              if (brand) {
                brandId = brand.id;
              } else {
                // Marka yoksa oluştur
                const newBrand = await prisma.marketPlaceBrands.create({
                  data: {
                    brandName: detail.brand,
                    marketPlaceBrandId: detail.brandId?.toString() || null
                  }
                });
                brandId = newBrand.id;
              }
            }
            
            // Önce ürünü bul
            const existingProduct = await prisma.marketPlaceProducts.findFirst({
              where: {
                productSku: listing.hepsiburadaSku
              },
              include: {
                marketPlaceAttributes: true,
                MarketPlaceProductImages: true,
                MarketPlaceCategories: true
              }
            });
            
            // Ürün verilerini hazırla
            const productData: any = {
              productName: detail.productName || listing.hepsiburadaSku,
              productSku: listing.hepsiburadaSku,
              description: detail.description || "",
              shortDescription: detail.shortDescription || "",
              listPrice: listing.price || 0,
              salePrice: listing.price || 0,
              storeId: this.storeId,
              productId: listing.merchantSku,
              productType: "Listing"
            };
            
            // Opsiyonel alanları ekle
            if (detail.barcode) {
              productData.barcode = detail.barcode;
            }
            
            if (brandId) {
              productData.marketPlaceBrandsId = brandId;
            }
            
            if (categoryId) {
              productData.marketPlaceCategoriesId = categoryId;
            }
            
            let savedProduct;
            
            if (existingProduct) {
              // Ürün varsa güncelle
              savedProduct = await prisma.marketPlaceProducts.update({
                where: {
                  id: existingProduct.id
                },
                data: productData
              });
            } else {
              // Ürün yoksa oluştur
              savedProduct = await prisma.marketPlaceProducts.create({
                data: productData
              });
            }
            
            // Ürün resimlerini kaydet
            if (detail.images && Array.isArray(detail.images) && detail.images.length > 0) {
              // Önce mevcut resimleri temizle
              if (existingProduct) {
                await prisma.marketPlaceProductImages.deleteMany({
                  where: { marketPlaceProductId: savedProduct.id }
                });
              }
              
              // Yeni resimleri ekle
              for (const image of detail.images) {
                const imageUrl = typeof image === 'string' ? image : image.url || '';
                if (imageUrl) {
                  await prisma.marketPlaceProductImages.create({
                    data: {
                      imageUrl,
                      marketPlaceProductId: savedProduct.id
                    }
                  });
                }
              }
            }
            
            // Ürün özelliklerini kaydet
            if (detail.attributes && typeof detail.attributes === 'object') {
              try {
                // Önce mevcut özellikleri temizle
                if (existingProduct && existingProduct.marketPlaceAttributes && existingProduct.marketPlaceAttributes.length > 0) {
                  // Her bir özelliği ayrı ayrı ayır
                  for (const attr of existingProduct.marketPlaceAttributes) {
                    await prisma.marketPlaceProducts.update({
                      where: { id: savedProduct.id },
                      data: {
                        marketPlaceAttributes: {
                          disconnect: { id: attr.id }
                        }
                      }
                    });
                  }
                }
                
                // Yeni özellikleri ekle
                for (const [key, value] of Object.entries(detail.attributes)) {
                  if (value === null || value === undefined) continue;
                  
                  // Özelliği bul veya oluştur
                  let attribute = await prisma.marketPlaceAttributes.findFirst({
                    where: {
                      attributeName: key,
                      marketPlaceId: marketPlace.id
                    }
                  });
                  
                  if (!attribute) {
                    attribute = await prisma.marketPlaceAttributes.create({
                      data: {
                        attributeName: key,
                        valueName: String(value),
                        marketPlaceId: marketPlace.id,
                        MarketPlaceCategoriesId: categoryId
                      }
                    });
                  }
                  
                  // Ürün ile özelliği ilişkilendir
                  await prisma.marketPlaceProducts.update({
                    where: { id: savedProduct.id },
                    data: {
                      marketPlaceAttributes: {
                        connect: { id: attribute.id }
                      }
                    }
                  });
                }
              } catch (attrError) {
                console.error(`Özellikler kaydedilirken hata: ${listing.hepsiburadaSku}`, attrError);
              }
            }
            
            // Kategori ile ürünü ilişkilendir
            if (categoryId && (!existingProduct || !existingProduct.MarketPlaceCategories.some(cat => cat.id === categoryId))) {
              try {
                await prisma.marketPlaceProducts.update({
                  where: { id: savedProduct.id },
                  data: {
                    MarketPlaceCategories: {
                      connect: { id: categoryId }
                    }
                  }
                });
              } catch (catError) {
                console.error(`Kategori ilişkilendirme hatası: ${listing.hepsiburadaSku}`, catError);
              }
            }
            
            totalSaved++;
            console.log(`Listing kaydedildi: ${listing.hepsiburadaSku}`);
          } catch (error) {
            console.error(`Listing kaydedilirken hata: ${listing.hepsiburadaSku}`, error);
          }
        }
        
        // Sonraki sayfa
        page++;
        hasMore = listings.length === size;
        
        // API rate limit'i aşmamak için kısa bir bekleme
        await this.delay(500);
      }
      
      console.log(`Toplam ${totalSaved} adet listing başarıyla kaydedildi.`);
      
      return { 
        success: true, 
        message: `${totalSaved} listing başarıyla senkronize edildi`, 
        totalSaved 
      };
    } catch (error) {
      console.error("Listing senkronizasyonu hatası:", error);
      return { success: false, error, totalSaved: 0 };
    }
  }

  // Ürün bilgilerini çekme
  async getProducts(page: number = 0, size: number = 100): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getProducts(page, size);
    } catch (error) {
      console.error('Ürün bilgileri alınamadı:', error);
      throw error;
    }
  }

  // Ürün detayını çekme
  async getProductDetail(productId: string): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getProductDetail(productId);
    } catch (error) {
      console.error('Ürün detayı alınamadı:', error);
      throw error;
    }
  }

  // Ürün oluşturma
  async createProduct(productData: any): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.createProduct(productData);
    } catch (error) {
      console.error('Ürün oluşturulamadı:', error);
      throw error;
    }
  }

  // Ürünleri çekip veritabanına kaydetme
  async syncProducts(): Promise<any> {
    try {
      await this.initialize();
      
      // MarketPlace ID'sini al
      const marketPlace = await prisma.marketPlace.findFirst({
        where: { name: "Hepsiburada" }
      });
      
      if (!marketPlace) {
        throw new Error("Hepsiburada marketplace bulunamadı");
      }
      
      const store = await prisma.store.findUniqueOrThrow({
        where: { id: this.storeId }
      });
      
      // Tüm ürünleri çek
      let page = 0;
      const size = 100;
      let hasMore = true;
      let totalSaved = 0;
      const startTime = Date.now();
      
      while (hasMore) {
        try {
          const response = await this.hepsiburada.getProducts(page, size);
          
          if (!response.data || response.data.length === 0) {
            hasMore = false;
            continue;
          }
          
          // Ürünleri varyant gruplarına göre grupla
          const productGroups = new Map<string, any[]>();
          for (const product of response.data) {
            // Ürün detayını çek
            const productDetail = await this.hepsiburada.getProductDetail(product.id);
            if (!productDetail.data) continue;
            
            // Varyant grup ID'sini al
            const variantGroupId = productDetail.data.attributes?.VaryantGroupID?.value || null;
            
            if (variantGroupId) {
              if (!productGroups.has(variantGroupId)) {
                productGroups.set(variantGroupId, []);
              }
              productGroups.get(variantGroupId)!.push({ product, detail: productDetail.data });
            } else {
              // Varyant olmayan ürünler için tekil grup oluştur
              productGroups.set(product.id, [{ product, detail: productDetail.data }]);
            }
          }
          
          // Her grup için işlem yap
          for (const products of productGroups.values()) {
            try {
              if (products.length > 1) {
                // Ana ürünü kaydet
                const mainProduct = products[0];
                const savedMainProduct = await this.processProduct(
                  mainProduct.product, 
                  mainProduct.detail, 
                  "VaryasyonluUrun", 
                  null, 
                  marketPlace.id,
                  store.id
                );
                
                if (savedMainProduct && savedMainProduct.id) {
                  // Varyantları ana ürüne bağla
                  for (const variant of products.slice(1)) {
                    try {
                      await this.processProduct(
                        variant.product, 
                        variant.detail, 
                        "Varyasyon", 
                        savedMainProduct.id, 
                        marketPlace.id,
                        store.id
                      );
                      await this.delay(100); // Her varyant işlemi arasında kısa bekle
                    } catch (variantError) {
                      console.error(`Varyant işleme hatası (${variant.product.id}):`, variantError);
                    }
                  }
                }
              } else {
                // Tekil ürünü kaydet
                await this.processProduct(
                  products[0].product, 
                  products[0].detail, 
                  "BasitUrun", 
                  null, 
                  marketPlace.id,
                  store.id
                );
              }
              
              totalSaved += products.length;
            } catch (groupError) {
              console.error(`Ürün grubu işleme hatası:`, groupError);
            }
            
            await this.delay(100); // Her grup işleminden sonra kısa bekle
          }
          
          // Sonraki sayfa
          page++;
          hasMore = response.data.length === size;
          await this.delay(1000); // Sayfa arası bekle
        } catch (pageError) {
          console.error(`Sayfa işleme hatası (Sayfa ${page}):`, pageError);
          page++;
          await this.delay(3000); // Hata durumunda daha uzun bekle
        }
      }
      
      console.log("=".repeat(50));
      console.log(`Ürün senkronizasyonu tamamlandı. Toplam ${totalSaved} ürün işlendi.`);
      console.log(`İşlem süresi: ${((Date.now() - startTime) / 1000).toFixed(2)} saniye`);
      console.log("=".repeat(50));
      
      return { success: true, totalSaved };
    } catch (error) {
      console.error('Ürünler senkronize edilemedi:', error);
      throw error;
    }
  }

  // Ürün işleme metodu
  private async processProduct(
    product: any, 
    productDetail: any, 
    productType: string, 
    parentProductId: string | null,
    marketPlaceId: string,
    storeId: string
  ): Promise<any> {
    try {
      // Marka bilgisini bul veya oluştur
      let marketPlaceBrandsId = null;
      if (productDetail.attributes && productDetail.attributes.Marka) {
        const brandName = productDetail.attributes.Marka.value;
        
        // Önce markayı bul
        const brand = await prisma.marketPlaceBrands.findFirst({
          where: {
            brandName: brandName
          }
        });
        
        if (brand) {
          // Marka bulundu, ID'sini kullan
          marketPlaceBrandsId = brand.id;
        } else {
          // Marka bulunamadı, yeni oluştur
          const newBrand = await prisma.marketPlaceBrands.create({
            data: {
              brandName: brandName,
              marketPlaceBrandId: productDetail.attributes.Marka.value
            }
          });
          marketPlaceBrandsId = newBrand.id;
        }
      }
      
      // Kategori bilgisini bul
      let marketPlaceCategoriesId = null;
      if (product.productType && product.productType.categoryId) {
        const category = await prisma.marketPlaceCategories.findFirst({
          where: {
            marketPlaceCategoryId: product.productType.categoryId.toString()
          }
        });
        
        if (category) {
          marketPlaceCategoriesId = category.id;
        }
      }
      
      // Barkod bilgisini al
      let barcode = null;
      if (productDetail.attributes && productDetail.attributes.Barcode) {
        barcode = productDetail.attributes.Barcode.value;
      }
      
      // Ürün adını al
      let productName = product.name;
      if (productDetail.attributes && productDetail.attributes.UrunAdi) {
        productName = productDetail.attributes.UrunAdi.value;
      }
      
      // Ürünü veritabanına kaydet
      const savedProduct = await prisma.marketPlaceProducts.upsert({
        where: {
          id: await this.getProductIdByExternalId(product.id)
        },
        update: {
          productName: productName,
          description: productDetail.description || "",
          shortDescription: productDetail.shortDescription || "",
          productId: product.merchantSku,
          productSku: product.id,
          barcode: barcode,
          marketPlaceBrandsId: marketPlaceBrandsId,
          marketPlaceCategoriesId: marketPlaceCategoriesId,
          productType: productType,
          parentProductId: parentProductId,
          storeId: storeId
        },
        create: {
          productName: productName,
          description: productDetail.description || "",
          shortDescription: productDetail.shortDescription || "",
          productId: product.merchantSku,
          productSku: product.id,
          barcode: barcode,
          marketPlaceBrandsId: marketPlaceBrandsId,
          marketPlaceCategoriesId: marketPlaceCategoriesId,
          productType: productType,
          parentProductId: parentProductId,
          storeId: storeId
        }
      });
      
      // Ürün resimlerini kaydet
      if (productDetail.images && productDetail.images.length > 0) {
        // Önce mevcut resimleri temizle
        await prisma.marketPlaceProductImages.deleteMany({
          where: { marketPlaceProductId: savedProduct.id }
        });
        
        // Yeni resimleri ekle
        for (const image of productDetail.images) {
          await prisma.marketPlaceProductImages.create({
            data: {
              imageUrl: image.url,
              marketPlaceProductId: savedProduct.id
            }
          });
        }
      }
      
      return savedProduct;
    } catch (error) {
      console.error(`Ürün işleme hatası (${product.id}):`, error);
      throw error;
    }
  }

  // Yardımcı metod: Gecikme
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Listing bilgilerini çekme
  async getListings(page: number = 0, size: number = 100): Promise<any> {
    try {
      await this.initialize();
      return await this.hepsiburada.getListings(page, size);
    } catch (error) {
      console.error('Listing bilgileri alınamadı:', error);
      throw error;
    }
  }

  // Update listing
  async updateListing(listingData: any): Promise<any> {
    await this.initialize();
    return await this.hepsiburada.updateListing(listingData);
  }

  // Delete listing
  async deleteListing(listingId: string): Promise<any> {
    await this.initialize();
    return await this.hepsiburada.deleteListing(listingId);
  }

  // Toggle listing status
  async toggleListingStatus(hepsiburadaSku: string, isSalable: boolean): Promise<any> {
    await this.initialize();
    return await this.hepsiburada.toggleListingStatus(hepsiburadaSku, isSalable);
  }
} 