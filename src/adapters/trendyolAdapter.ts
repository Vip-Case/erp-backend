import { Buffer } from 'buffer';
import { TrendyolOrderResponse, TrendyolOrder } from './types'; // Gerekli tipleri içe aktar

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

interface WebhookCreateRequest {
    url: string;
    username?: string;
    password?: string;
    authenticationType: "BASIC_AUTHENTICATION" | "API_KEY";
    apiKey?: string;
    subscribedStatuses?: string[];
}

export class TrendyolAdapter {
  private readonly baseURL: string;
  private readonly headers: Headers;
  private readonly timeout: number = 30000;
  private lastRequestTime = 0;
  private readonly rateLimitDelay = 1000; // 1 saniye (5 saniye çok uzun)
  private readonly maxRetries = 3;
  private readonly brandCache: Map<string, TrendyolBrand> = new Map();
  private readonly variationsCache: Map<string, TrendyolProduct[]> = new Map();
  private brandListCache: { brands: TrendyolBrand[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 1000 * 30; // 30 saniye
  private readonly categoryCache: Map<string, TrendyolCategory> = new Map();
  private categoryListCache: { categories: TrendyolCategory[]; timestamp: number } | null = null;

  constructor(private readonly credentials: TrendyolCredentials) {
    this.baseURL = credentials.baseUrl;
    const token = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
    
    this.headers = new Headers({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': `${credentials.supplierId} - Trendyolsoft`
    });
  }

  private async handleRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
        const waitTime = this.rateLimitDelay - timeSinceLastRequest;
        await this.delay(waitTime);
    }
    
    this.lastRequestTime = Date.now(); // Son istek zamanını güncelle
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

  async getBrands(): Promise<{ brands: TrendyolBrand[]; totalPages: number }> {
    // Cache kontrolü
    if (this.brandListCache && 
        (Date.now() - this.brandListCache.timestamp) < this.CACHE_DURATION) {
        return {
            brands: this.brandListCache.brands,
            totalPages: Math.ceil(this.brandListCache.brands.length / 1000)
        };
    }

    await this.handleRateLimit(); // Cache miss olduğunda rate limit uygula

    try {
        const response = await this.fetchWithTimeout('/integration/product/brands', {
            validateStatus: (status) => status >= 200 && status < 500
        });

        const data = await response.json();
        const brands = data?.brands || [];

        // Cache'i güncelle
        this.brandListCache = {
            brands: brands.filter((brand: any) => brand?.id && brand?.name),
            timestamp: Date.now()
        };

        // Tekil cache'i de güncelle
        this.brandListCache.brands.forEach(brand => {
            this.brandCache.set(brand.id.toString(), brand);
        });

        return {
            brands: this.brandListCache.brands,
            totalPages: data.totalPages || 1
        };
    } catch (error) {
        console.error('Markalar alınamadı:', error);
        return { brands: [], totalPages: 0 };
    }
  }

  async getBrandById(brandId: number): Promise<TrendyolBrand> {
    // Önce tekil cache'den kontrol
    const cachedBrand = this.brandCache.get(brandId.toString());
    if (cachedBrand) {
        return cachedBrand;
    }

    // Sonra liste cache'den kontrol
    if (this.brandListCache) {
        const brand = this.brandListCache.brands.find(b => b.id === brandId);
        if (brand) {
            this.brandCache.set(brandId.toString(), brand);
            return brand;
        }
    }

    // Cache'de yoksa yeni istek yap
    await this.handleRateLimit();
    const { brands } = await this.getBrands();
    const brand = brands.find(b => b.id === brandId);
    
    if (brand) {
        this.brandCache.set(brandId.toString(), brand);
        return brand;
    }

    return { id: brandId, name: `Marka ${brandId}` };
  }

  async getCategories(page: number = 0, size: number = 100): Promise<{
    categories: TrendyolCategory[];
    totalPages: number;
  }> {
    await this.handleRateLimit();

    // Cache kontrolü
    if (this.categoryListCache && 
        (Date.now() - this.categoryListCache.timestamp) < this.CACHE_DURATION) {
        return {
            categories: this.categoryListCache.categories,
            totalPages: Math.ceil(this.categoryListCache.categories.length / size)
        };
    }

    const response = await this.fetchWithTimeout(
        `/integration/product/product-categories?page=${page}&size=${size}`
    );

    const data = await response.json();
    const categories = data.categories || [];

    // Cache'e kaydet
    this.categoryListCache = {
        categories: categories.filter((cat: any) => cat?.id && cat?.name),
        timestamp: Date.now()
    };

    return {
        categories: this.categoryListCache.categories,
        totalPages: data.totalPages || Math.ceil(categories.length / size)
    };
  }

  async getCategoryById(categoryId: number): Promise<TrendyolCategory> {
    await this.handleRateLimit();
    
    // Önce cache'den kontrol et
    const cachedCategory = this.categoryCache.get(categoryId.toString());
    if (cachedCategory) {
        return cachedCategory;
    }

    try {
        // Önce liste cache'inden kontrol et
        if (this.categoryListCache && 
            (Date.now() - this.categoryListCache.timestamp) < this.CACHE_DURATION) {
            const category = this.categoryListCache.categories.find(c => c.id === categoryId);
            if (category) {
                this.categoryCache.set(categoryId.toString(), category);
                return category;
            }
        }

        const response = await this.fetchWithTimeout(
            `/integration/product/product-categories/${categoryId}`,
            {
                validateStatus: (status) => [200, 404].includes(status)
            }
        );

        if (response.status === 404) {
            const defaultCategory = {
                id: categoryId,
                name: `Kategori ${categoryId}`,
                parentId: null,
                subCategories: []
            };
            this.categoryCache.set(categoryId.toString(), defaultCategory);
            return defaultCategory;
        }

        const category = await response.json();
        this.categoryCache.set(categoryId.toString(), category);
        return category;
    } catch {
        const defaultCategory = {
            id: categoryId,
            name: `Kategori ${categoryId}`,
            parentId: null,
            subCategories: []
        };
        this.categoryCache.set(categoryId.toString(), defaultCategory);
        return defaultCategory;
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
    await this.handleRateLimit();
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
    await this.handleRateLimit();
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
    await this.handleRateLimit();
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
    await this.handleRateLimit();
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

  async getWebhooks() {
    try {
      const sellerId = this.credentials.supplierId;
      
      const response = await this.fetchWithTimeout(
        `/integration/webhook/sellers/${sellerId}/webhooks`,
        {
          method: 'GET',
          validateStatus: (status) => [200, 404].includes(status)
        }
      );

      return response.status === 404 ? [] : await response.json();
    } catch (error) {
      console.error('Get webhooks error:', error);
      throw error;
    }
  }

  async createWebhook(request: WebhookCreateRequest): Promise<{ id: string }> {
    const response = await this.fetchWithTimeout(
        `/integration/webhook/sellers/${this.credentials.supplierId}/webhooks`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: request.url,
                username: request.username,
                password: request.password,
                authenticationType: request.authenticationType,
                apiKey: request.apiKey,
                subscribedStatuses: request.subscribedStatuses || [
                    "CREATED", "PICKING", "INVOICED", "SHIPPED",
                    "CANCELLED", "DELIVERED", "UNDELIVERED", "RETURNED",
                    "UNSUPPLIED", "AWAITING", "UNPACKED", "AT_COLLECTION_POINT",
                    "VERIFIED"
                ]
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Webhook oluşturma hatası: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async updateWebhook(id: string, data: {
    name?: string;
    url?: string;
    eventType?: string;
    status?: 'ACTIVE' | 'PASSIVE';
  }) {
    return await this.fetchWithTimeout(`/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteWebhook(webhookId: string, timeout = 30000): Promise<void> {
    const url = `/integration/webhook/sellers/${this.credentials.supplierId}/webhooks/${webhookId}`;
    
    try {
      console.log(`Webhook silme isteği: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'DELETE',
        headers: this.headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Webhook silme hatası: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      console.log(`Webhook silme başarılı: ${webhookId}`);
    } catch (error) {
      console.error(`API Error: {
        url: "${url}",
        error: ${error},
      }`);
      throw error;
    }
  }

  async activateWebhook(sellerId: string, webhookId: string, username: string, password: string) {
    const endpoint = `${this.baseURL}/integration/webhook/sellers/${sellerId}/webhooks/${webhookId}/activate`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    };

    try {
      const response = await fetch(endpoint, {
        method: 'PUT', // PUT isteği gönderiyoruz
        headers: headers
      });

      if (!response.ok) {
        const errorText = await response.text(); // Hata mesajını al
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json(); // Başarılı yanıtı döndür
    } catch (error) {
      console.error('Activate webhook error:', error);
      throw error;
    }
  }

  async getOrders(
    status: string,
    size: number = 50,
    page: number = 0,
    orderByField: string = 'PackageLastModifiedDate',
    orderByDirection: string = 'DESC'
  ): Promise<TrendyolOrderResponse> {
    // Stage için 5 saniye çok kısa olabilir
    await this.delay(10000); // 10 saniye bekle

    try {
      const response = await this.fetchWithTimeout(
        `/integration/order/sellers/${this.credentials.supplierId}/orders?${new URLSearchParams({
          status,
          size: Math.min(size, 200).toString(),
          page: page.toString(),
          orderByField,
          orderByDirection
        })}`,
        {
          validateStatus: (status) => status === 200 || status === 429
        }
      );

      const data = await response.json();

      if (data.exception === "TooManyRequestException") {
        console.log('Rate limit aşıldı, 10 saniye bekleniyor...');
        await this.delay(10000);
        return this.getOrders(status, size, page, orderByField, orderByDirection);
      }

      return data;

    } catch (error) {
      console.error('Sipariş listesi alınamadı:', error);
      throw error;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getOrderById(orderNumber: string): Promise<TrendyolOrder | null> {
    try {
      const response = await this.fetchWithTimeout(
        `/integration/order/sellers/${this.credentials.supplierId}/orders/${orderNumber}`
      );
      
      if (response.status === 404) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
}