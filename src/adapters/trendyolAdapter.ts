import { Buffer } from 'buffer';

interface TrendyolCredentials {
  supplierId: string;
  apiKey: string;
  apiSecret: string;
  token: string;
  environment: 'STAGE' | 'PROD';
  baseUrl: string;
}

interface TrendyolBrand {
  id: number;
  name: string;
}

interface TrendyolCategory {
  id: number;
  name: string;
  parentId: number | null;
  subCategories: TrendyolCategory[];
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

interface StockUpdateItem {
  barcode: string;
  quantity: number;
}

interface TrendyolProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TrendyolProduct[];
}

export class TrendyolAdapter {
  private readonly baseURL: string;
  private readonly headers: Headers;
  private readonly timeout: number = 30000;
  private readonly rateLimitDelay: number = 1000;
  private readonly brandCache: Map<string, TrendyolBrand> = new Map();
  private readonly variationsCache: Map<string, TrendyolProduct[]> = new Map();

  constructor(private readonly credentials: TrendyolCredentials) {
    this.baseURL = credentials.baseUrl;
    const token = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
    
    this.headers = new Headers({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': `${credentials.supplierId} - Trendyolsoft`
    });
  }

  private async rateLimiter() {
    await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
  }

  private async fetchWithTimeout(
    url: string, 
    options: RequestInit & { 
      validateStatus?: (status: number) => boolean 
    } = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fullUrl = `${this.baseURL}${url}`;
      console.log('Request:', fullUrl);

      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: this.headers
      });
      clearTimeout(id);

      // Özel durum doğrulama fonksiyonu varsa kullan
      if (options.validateStatus) {
        if (!options.validateStatus(response.status)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(id);
      console.error('API Error:', {
        url,
        error: error
      });
      throw error;
    }
  }

  async getBrands(): Promise<{ brands: TrendyolBrand[]; totalPages: number; }> {
    await this.rateLimiter();
    try {
      const response = await this.fetchWithTimeout('/integration/product/brands', {
        validateStatus: (status) => status >= 200 && status < 500
      });

      const data = await response.json();
      const brands = data?.brands || [];

      if (!brands.length) return { brands: [], totalPages: 0 };

      return {
        brands: brands.filter((brand: any) => brand?.id && brand?.name),
        totalPages: data.totalPages || 1
      };
    } catch {
      return { brands: [], totalPages: 0 };
    }
  }

  async getBrandById(brandId: number): Promise<TrendyolBrand> {
    await this.rateLimiter();
    const cachedBrand = await this.brandCache.get(brandId.toString());
    if (cachedBrand) {
      return { id: brandId, name: `Marka ${brandId}` };
    }

    try {
      const response = await this.fetchWithTimeout(
        `/integration/product/brands/${brandId}`,
        {
          validateStatus: (status) => [200, 404].includes(status)
        }
      );

      if (response.status === 404) {
        return { id: brandId, name: `Marka ${brandId}` };
      }

      const data = await response.json();
      return { id: brandId, name: data.name };
    } catch {
      return { id: brandId, name: `Marka ${brandId}` };
    }
  }

  async getCategories(page: number = 0, size: number = 100): Promise<{
    categories: TrendyolCategory[];
    totalPages: number;
  }> {
    await this.rateLimiter();
    const response = await this.fetchWithTimeout(
      `/integration/product/product-categories?page=${page}&size=${size}`
    );

    const data = await response.json();
    const categories = data.categories || [];

    return {
      categories: categories.filter((cat: any) => cat?.id && cat?.name),
      totalPages: data.totalPages || Math.ceil(categories.length / size)
    };
  }

  async getCategoryById(categoryId: number): Promise<TrendyolCategory> {
    await this.rateLimiter();
    try {
      const response = await this.fetchWithTimeout(
        `/integration/product/product-categories/${categoryId}`,
        {
          validateStatus: (status) => [200, 404].includes(status)
        }
      );

      if (response.status === 404) {
        return {
          id: categoryId,
          name: `Kategori ${categoryId}`,
          parentId: null,
          subCategories: []
        };
      }

      const data = await response.json();
      return data;
    } catch {
      return {
        id: categoryId,
        name: `Kategori ${categoryId}`,
        parentId: null,
        subCategories: []
      };
    }
  }

  async getProducts(page: number = 0, size: number = 100): Promise<TrendyolProductResponse> {
    console.log(`Ürün çekme isteği - Sayfa: ${page}, Boyut: ${size}`);
    const MAX_RETRIES = 5;
    const BASE_DELAY = 5000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          onSale: 'true',
          dateTo: new Date().toISOString()
        });

        const response = await this.fetchWithTimeout(
          `/integration/product/sellers/${this.credentials.supplierId}/products?${params}`,
          {
            headers: {
              ...this.headers,
              'Accept': 'application/json'
            }
          }
        );

        const data = await response.json();
        console.log('Yanıt Detayları:', {
          totalPages: data.totalPages,
          totalElements: data.totalElements
        });

        return {
          ...data,
          content: data.content || []
        };
      } catch (error: any) {
        if (error.status === 429) {
          const waitTime = BASE_DELAY * Math.pow(2, attempt);
          console.log(`Rate limit hatası. ${waitTime} ms beklenecek.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Maksimum deneme sayısına ulaşıldı');
  }

  async getProductVariations(productMainId: string): Promise<TrendyolProduct[]> {
    const cacheKey = `variations_${productMainId}`;
    const cachedVariations = await this.variationsCache?.get(cacheKey);
    if (cachedVariations) return cachedVariations;

    try {
      const response = await this.fetchWithTimeout(
        `/integration/product/sellers/${this.credentials.supplierId}/products/${productMainId}/variations`,
        {
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) return [];

      const data = await response.json();
      const variations = data?.content || [];

      return variations.filter((variation: any) =>
        variation.barcode !== productMainId &&
        variation.productMainId === productMainId &&
        variation.attributes?.some((attr: any) =>
          attr.attributeName?.toLowerCase().includes('renk') ||
          attr.attributeName?.toLowerCase().includes('beden')
        )
      );
    } catch (error) {
      console.warn(`Variation fetch error: ${productMainId}`, error);
      return [];
    }
  }

  async getProductDetails(barcode: string): Promise<TrendyolProduct | null> {
    await this.rateLimiter();
    try {
      const response = await this.fetchWithTimeout(
        `/integration/product/sellers/${this.credentials.supplierId}/products/${barcode}`,
        {
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) return null;

      return await response.json();
    } catch (error) {
      console.warn(`Product details fetch error: ${barcode}`, error);
      return null;
    }
  }

  async getProductsByModelCode(modelCode: string): Promise<TrendyolProduct[]> {
    await this.rateLimiter();
    try {
      const params = new URLSearchParams({
        productMainId: modelCode,
        size: '100'
      });

      const response = await this.fetchWithTimeout(
        `/integration/product/sellers/${this.credentials.supplierId}/products?${params}`
      );

      const data = await response.json();
      return data?.content || [];
    } catch (error) {
      console.warn(`Products by model code fetch error: ${modelCode}`, error);
      return [];
    }
  }

  async getProductStock(barcode: string): Promise<number | null> {
    await this.rateLimiter();
    try {
      const params = new URLSearchParams({
        barcode,
        size: '1',
        onSale: 'true' // Onaylı ürünler için
      });
  
      // Yeni endpoint kullanımı
      const response = await this.fetchWithTimeout(
        `/integration/product/sellers/${this.credentials.supplierId}/products?${params}`,
        {
          method: 'GET',
          validateStatus: (status) => status === 200 || status === 404
        }
      );
  
      console.log(`Stok API yanıtı - Barkod: ${barcode}, Status: ${response.status}`);
  
      if (response.status === 404) {
        throw new Error(`Ürün bulunamadı - Barkod: ${barcode}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Dokümantasyona göre content dizisini kontrol et
      if (!data?.content?.length) {
        throw new Error(`Ürün stok bilgisi bulunamadı: ${barcode}`);
      }
  
      // İlk ürünü al (size: '1' olduğu için)
      const product = data.content[0];
  
      // Quantity kontrolü
      if (product.barcode !== barcode) {
        throw new Error(`Barkod eşleşmesi bulunamadı: ${barcode}`);
      }
  
      const quantity = product.quantity;
      console.log(`Stok miktarı - Barkod: ${barcode}, Miktar: ${quantity}`);
  
      return quantity;
    } catch (error) {
      console.error(`Ürün stok bilgisi alınamadı: ${barcode}`, error);
      throw error; // Hatayı fırlat, 0 dönme
    }
  }
  
  async updateProductStock(data: { items: StockUpdateItem[] }): Promise<void> {
    const MAX_RETRIES = 3;
    const BASE_DELAY = 1000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          `/integration/inventory/sellers/${this.credentials.supplierId}/products/price-and-inventory`,
          {
            method: 'POST',
            body: JSON.stringify({
              items: data.items.map(item => ({
                barcode: item.barcode,
                quantity: Number(item.quantity)
              }))
            })
          }
        );

        const responseData = await response.json();
        if (!responseData) {
          throw new Error('Stok güncellemesi başarısız');
        }

        return;
      } catch (error: any) {
        if (error.status === 429) {
          const waitTime = BASE_DELAY * Math.pow(2, attempt);
          console.log(`Rate limit aşıldı. ${waitTime}ms bekleniyor...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Maksimum deneme sayısına ulaşıldı');
  }

  async checkProductAvailability(barcode: string): Promise<{
    isAvailable: boolean;
    stockStatus?: string;
    quantity?: number;
  }> {
    await this.rateLimiter();
    try {
      const response = await this.fetchWithTimeout(
        `/integration/product/sellers/${this.credentials.supplierId}/products/${barcode}/stocks`,
        {
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) {
        return { isAvailable: false };
      }

      const data = await response.json();
      return {
        isAvailable: true,
        stockStatus: data?.stockStatus,
        quantity: data?.quantity
      };
    } catch (error) {
      console.warn(`Stock availability check error: ${barcode}`, error);
      return { isAvailable: false };
    }
  }
}