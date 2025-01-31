// adapters/trendyolAdapter.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

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

interface TrendyolProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TrendyolProduct[];
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

// trendyolAdapter.ts
export class TrendyolAdapter {
  private readonly client: AxiosInstance;
  private readonly rateLimitDelay: number = 1000; // Define the rate limit delay in milliseconds
  private readonly brandCache: Map<string, TrendyolBrand> = new Map(); // Add brandCache property
  private readonly variationsCache: Map<string, TrendyolProduct[]> = new Map(); // Add variationsCache property

  constructor(private readonly credentials: TrendyolCredentials) {
    const token = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
    
    this.client = axios.create({
      baseURL: credentials.baseUrl,
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': `${credentials.supplierId} - Trendyolsoft`
      }
    });

    this.setupInterceptors();
  }

  private async rateLimiter() {
    await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        console.log('Request:', `${config.baseURL}${config.url}`);
        return config;
      },
      error => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      response => response,
      error => this.handleApiError(error)
    );
  }

  private handleApiError(error: AxiosError): Promise<never> {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }

  async getBrands(): Promise<{brands: TrendyolBrand[]; totalPages: number;}> {
    await this.rateLimiter();
    try {
      const response = await this.client.get('/brands', {
        validateStatus: (status) => status >= 200 && status < 500
      });
  
      const brands = response.data?.brands || [];
      // Marka datası yoksa boş dizi dön
      if (!brands.length) return { brands: [], totalPages: 0 };
      
      return {
        brands: brands.filter((brand: any) => brand?.id && brand?.name),
        totalPages: response.data.totalPages || 1
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
      const response = await this.client.get(`/brands/${brandId}`, {
        validateStatus: (status) => [200, 404].includes(status)
      });
      
      return {
        id: brandId,
        name: response.status === 404 ? `Marka ${brandId}` : response.data.name
      };
    } catch {
      return { id: brandId, name: `Marka ${brandId}` };
    }
  }

  async getCategories(page: number = 0, size: number = 100): Promise<{
    categories: TrendyolCategory[];
    totalPages: number;
  }> {
    await this.rateLimiter();
    const response = await this.client.get('/product-categories', {
      params: { page, size }
    });

    const categories = response.data.categories || [];
    return {
      categories: categories.filter((cat: any) => cat?.id && cat?.name),
      totalPages: response.data.totalPages || Math.ceil(categories.length / size)
    };
  }

  async getCategoryById(categoryId: number): Promise<TrendyolCategory> {
    await this.rateLimiter();
    try {
      const response = await this.client.get(`/product-categories/${categoryId}`, {
        validateStatus: (status) => [200, 404].includes(status)
      });
      
      return response.status === 404 ? {
        id: categoryId,
        name: `Kategori ${categoryId}`,
        parentId: null,
        subCategories: []
      } : response.data;
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
    console.log(`Tam URL: /suppliers/${this.credentials.supplierId}/products`);
    
    const MAX_RETRIES = 5;
    const BASE_DELAY = 5000;
  
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const params = {
          page,
          size,
          onSale: true,
          dateTo: new Date().toISOString()
        };
        console.log('API Parametreleri:', JSON.stringify(params));
  
        const response = await this.client.get(
          `/suppliers/${this.credentials.supplierId}/products`,
          {
            params,
            timeout: 30000
          }
        );
  
        console.log('Yanıt Detayları:', {
          status: response.status,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
  
        const products = response.data.content || [];
        console.log(`Sayfa ${page} içinde ${products.length} ürün var`);
  
        return {
          ...response.data,
          content: products
        };
      } catch (error) {
        console.error(`Ürün çekme hatası - Sayfa: ${page}, Deneme: ${attempt + 1}`, error);
        
        if ((error as any).response) {
          console.log('Hata Yanıtı:', {
            status: (error as any).response.status,
            data: (error as any).response.data
          });
        }
        
        if ((error as any).response?.status === 429) {
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
      const response = await this.client.get(
        `/suppliers/${this.credentials.supplierId}/products/${productMainId}/variations`,
        {
          timeout: 30000,
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) return [];

      const variations = response.data?.content || [];
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
      const response = await this.client.get(
        `/suppliers/${this.credentials.supplierId}/products/${barcode}`,
        {
          timeout: 30000,
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) return null;

      return response.data;
    } catch (error) {
      console.warn(`Product details fetch error: ${barcode}`, error);
      return null;
    }
  }

  async getProductsByModelCode(modelCode: string): Promise<TrendyolProduct[]> {
    await this.rateLimiter();
    try {
      const response = await this.client.get(
        `/suppliers/${this.credentials.supplierId}/products`,
        {
          params: {
            productMainId: modelCode,
            size: 100
          },
          timeout: 30000
        }
      );

      return response.data?.content || [];
    } catch (error) {
      console.warn(`Products by model code fetch error: ${modelCode}`, error);
      return [];
    }
  }

  async checkProductAvailability(barcode: string): Promise<{
    isAvailable: boolean;
    stockStatus?: string;
    quantity?: number;
  }> {
    await this.rateLimiter();
    try {
      const response = await this.client.get(
        `/suppliers/${this.credentials.supplierId}/products/${barcode}/stocks`,
        {
          timeout: 30000,
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) {
        return { isAvailable: false };
      }

      return {
        isAvailable: true,
        stockStatus: response.data?.stockStatus,
        quantity: response.data?.quantity
      };
    } catch (error) {
      console.warn(`Stock availability check error: ${barcode}`, error);
      return { isAvailable: false };
    }
  }
}