import { PrismaClient } from "@prisma/client";
import { WooCommerceAdapter } from "../../adapters/wooCommerceAdapter";

const prisma = new PrismaClient();

export class WooCommerceService {
  private wooCommerce: WooCommerceAdapter;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(baseUrl: string, consumerKey: string, consumerSecret: string) {
    this.wooCommerce = new WooCommerceAdapter(baseUrl, consumerKey, consumerSecret);
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  async syncProducts(storeId: string | null): Promise<void> {
    try {
      let store = null;

      // Store doğrulama veya oluşturma
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

      // WooCommerce API'den ürünleri al
      const products = await this.wooCommerce.getProducts();

      for (const product of products) {
        const marketplaceProduct = await prisma.marketPlaceProducts.create({
          data: {
            productName: product.name,
            productSku: product.sku,
            description: product.description,
            shortDescription: product.short_description,
            listPrice: product.regular_price ? parseFloat(product.regular_price) : null,
            salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
            barcode: product.barcode || null,
            storeId: store?.id || null,
          },
        });

        console.log("MarketPlaceProduct created:", marketplaceProduct);

        // İlgili kategoriler
        // İlgili kategoriler
// İlgili kategoriler
if (product.categories) {
  // Benzersiz kategori ID'lerini elde et
  const uniqueCategories = Array.from(new Set(product.categories.map(c => c.id)));

  for (const rawCategoryId of uniqueCategories) {
    // rawCategoryId'nin türünü kontrol et ve dönüştür
    if (typeof rawCategoryId !== 'string' && typeof rawCategoryId !== 'number') {
      console.error("Invalid category ID:", rawCategoryId);
      continue; // Tür uygun değilse işlemi atla
    }

    // categoryId artık kesin olarak string
    const categoryId = rawCategoryId.toString();

    // Kategori bilgilerini al
    const category = product.categories.find(c => c.id === rawCategoryId);

    if (category) {
      console.log("Processing unique category:", category);

      // Mevcut kategoriyi bul
      const existingCategory = await prisma.marketPlaceCategories.findFirst({
        where: { marketPlaceCategoryId: categoryId },
      });

      console.log("Existing unique category:", existingCategory);

      let marketplaceCategory;

      if (existingCategory) {
        // Mevcut kategoriyi güncelle
        marketplaceCategory = await prisma.marketPlaceCategories.update({
          where: { id: existingCategory.id },
          data: { categoryName: category.name },
        });
      } else {
        // Yeni kategori oluştur
        marketplaceCategory = await prisma.marketPlaceCategories.create({
          data: {
            marketPlaceCategoryId: categoryId,
            categoryName: category.name,
          },
        });
      }

      console.log("Created or updated unique category:", marketplaceCategory);

      // Ürünle kategori ilişkilendir
      await prisma.marketPlaceProducts.update({
        where: { id: marketplaceProduct.id },
        data: { marketPlaceCategoriesId: marketplaceCategory.id },
      });
    }
  }
}



        // İlgili markalar
        if (product.brand) {
          const existingBrand = await prisma.marketPlaceBrands.findFirst({
            where: { marketPlaceBrandId: product.brand.id.toString() },
          });

          let marketplaceBrand;
          if (existingBrand) {
            marketplaceBrand = await prisma.marketPlaceBrands.update({
              where: { id: existingBrand.id },
              data: { brandName: product.brand.name },
            });
          } else {
            marketplaceBrand = await prisma.marketPlaceBrands.create({
              data: {
                marketPlaceBrandId: product.brand.id.toString(),
                brandName: product.brand.name,
              },
            });
          }

          await prisma.marketPlaceProducts.update({
            where: { id: marketplaceProduct.id },
            data: { marketPlaceBrandsId: marketplaceBrand.id },
          });
        }

        // İlgili özellikler
        if (product.attributes) {
          for (const attribute of product.attributes) {
            const existingAttribute = await prisma.marketPlaceAttributes.findFirst({
              where: { attributeMarketPlaceId: attribute.id.toString() },
            });

            let marketplaceAttribute;
            if (existingAttribute) {
              marketplaceAttribute = await prisma.marketPlaceAttributes.update({
                where: { id: existingAttribute.id },
                data: { valueName: attribute.options.join(", ") },
              });
            } else {
              marketplaceAttribute = await prisma.marketPlaceAttributes.create({
                data: {
                  marketPlaceId: store?.marketPlaceId || null,
                  attributeMarketPlaceId: attribute.id.toString(),
                  attributeName: attribute.name,
                  valueName: attribute.options.join(", "),
                },
              });
            }

            await prisma.marketPlaceProducts.update({
              where: { id: marketplaceProduct.id },
              data: { marketPlaceAttributesId: marketplaceAttribute.id },
            });
          }
        }

        // İlgili görseller
        if (product.images) {
          for (const image of product.images) {
            await prisma.marketPlaceProductImages.create({
              data: {
                imageUrl: image.src,
                marketPlaceProductId: marketplaceProduct.id,
              },
            });
          }
        }

        console.log("Product categories:", product.categories);
        console.log("Product attributes:", product.attributes);

      }
    } catch (error) {
      console.error("Error syncing products:", error);
      throw new Error("Senkronizasyon sırasında bir hata oluştu.");
    }
  }
}
