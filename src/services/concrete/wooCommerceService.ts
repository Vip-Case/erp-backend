import { PrismaClient } from "@prisma/client";
import { WooCommerceAdapter } from "../../adapters/wooCommerceAdapter";

const prisma = new PrismaClient();

interface Category {
  id: number | string;
  name: string;
  slug: string;
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
  categories: Category[];
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
}

export class WooCommerceService {
  private wooCommerce: WooCommerceAdapter;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(baseUrl: string, consumerKey: string, consumerSecret: string) {
    this.wooCommerce = new WooCommerceAdapter(baseUrl, consumerKey, consumerSecret);
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
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

  async syncProducts(storeId: string | null): Promise<void> {
    try {
      let store = null;

      if (storeId) {
        store = await prisma.store.findFirst({ where: { id: storeId } });

        if (!store) {
          let marketPlace = await prisma.marketPlace.findFirst({
            where: { id: "default-marketplace-id" },
          });

          if (!marketPlace) {
            marketPlace = await prisma.marketPlace.create({
              data: {
                id: "default-marketplace-id",
                name: "Default MarketPlace",
                apiBaseUrl: "https://api.default.com",
                logoUrl: "https://logo.default.com",
              },
            });
          }

          store = await prisma.store.create({
            data: {
              id: storeId,
              name: "Default Store Name",
              marketPlaceId: marketPlace.id,
              apiCredentials: JSON.stringify({
                consumerKey: this.consumerKey,
                consumerSecret: this.consumerSecret,
              }),
            },
          });
        }
      }

      const products: Product[] = await this.fetchAllProducts();

      for (const product of products) {
        const price = product.price ? parseFloat(product.price) : null;

        // Ürün Ekleme veya Güncelleme
        const existingProduct = await prisma.marketPlaceProducts.findFirst({
          where: { productSku: product.sku },
        });

        let marketplaceProduct;
        if (existingProduct) {
          marketplaceProduct = await prisma.marketPlaceProducts.update({
            where: { id: existingProduct.id },
            data: {
              listPrice: price,
              salePrice: price,
              description: product.description || "",
              shortDescription: product.short_description || "",
            },
          });
          console.log(`Ürün güncellendi: ${existingProduct.productName}`);
        } else {
          marketplaceProduct = await prisma.marketPlaceProducts.create({
            data: {
              productName: product.name,
              productSku: product.sku,
              description: product.description,
              shortDescription: product.short_description,
              listPrice: price,
              salePrice: price,
              barcode: product.barcode || null,
              storeId: store?.id || null,
            },
          });
          console.log("MarketPlaceProduct oluşturuldu:", marketplaceProduct);
        }

        // Kategoriler
        if (product.categories) {
          for (const category of product.categories) {
            // Mevcut kategori kontrolü
            const existingCategory = await prisma.marketPlaceCategories.findFirst({
              where: { marketPlaceCategoryId: category.id.toString() },
            });

            let linkedCategoryId;
            if (existingCategory) {
              linkedCategoryId = existingCategory.id;
            } else {
              // Yeni kategori oluşturma
              const newCategory = await prisma.marketPlaceCategories.create({
                data: {
                  marketPlaceCategoryId: category.id.toString(),
                  categoryName: category.name,
                  marketPlaceCategoryParentId: null, // Parent ID varsa burada güncelleyin
                },
              });
              linkedCategoryId = newCategory.id;
            }

            // Ürünü kategoriyle ilişkilendirme
            await prisma.marketPlaceProducts.update({
              where: { id: marketplaceProduct.id },
              data: {
                marketPlaceCategoriesId: linkedCategoryId,
              },
            });
          }
        }


        // Markalar
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

          // Ürünle markayı ilişkilendir
          await prisma.marketPlaceProducts.update({
            where: { id: marketplaceProduct.id },
            data: { marketPlaceBrandsId: existingBrand.id },
          });
        }


        // Özellikler (Attributes)
        if (product.attributes) {
          for (const attribute of product.attributes) {
            // Mevcut attribute kontrolü
            let existingAttribute = await prisma.marketPlaceAttributes.findFirst({
              where: {
                attributeMarketPlaceId: attribute.id.toString(),
                attributeName: attribute.name,
              },
              include: { MarketPlaceProducts: true },
            });

            if (existingAttribute) {
              // İlgili ürün için attribute değerlerini güncelle
              const updatedValueName = Array.from(
                new Set([
                  ...(existingAttribute.valueName?.split(", ") || []),
                  ...attribute.options,
                ])
              ).join(", ");

              await prisma.marketPlaceAttributes.update({
                where: { id: existingAttribute.id },
                data: {
                  valueName: updatedValueName,
                  MarketPlaceProducts: {
                    connect: { id: marketplaceProduct.id },
                  },
                },
              });
            } else {
              // Yeni attribute oluşturma
              await prisma.marketPlaceAttributes.create({
                data: {
                  marketPlaceId: store?.marketPlaceId || null,
                  attributeMarketPlaceId: attribute.id.toString(),
                  attributeName: attribute.name,
                  valueName: attribute.options.join(", "),
                  MarketPlaceProducts: {
                    connect: { id: marketplaceProduct.id },
                  },
                },
              });
            }
          }
        }



        // Görseller
        if (product.images) {
          // Mevcut görselleri veritabanından al
          const existingImages = await prisma.marketPlaceProductImages.findMany({
            where: { marketPlaceProductId: marketplaceProduct.id },
            select: { imageUrl: true }, // Yalnızca URL'leri al
          });

          const existingImageUrls = existingImages.map((img) => img.imageUrl);

          // Yalnızca yeni olan görselleri filtrele
          const newImages = product.images
            .filter((img) => !existingImageUrls.includes(img.src))
            .map((img) => ({
              imageUrl: img.src,
              marketPlaceProductId: marketplaceProduct.id,
            }));

          // Yeni görseller varsa ekle
          if (newImages.length > 0) {
            await prisma.marketPlaceProductImages.createMany({
              data: newImages,
              skipDuplicates: true,
            });
          }
        }

      }
    } catch (error) {
      console.error("Error syncing products:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }

}
