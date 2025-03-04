import { HepsiburadaCredentials, HepsiburadaCategoryResponse } from '../types/hepsiburadaTypes';

export class HepsiburadaAdapter {
  private readonly baseURL: string;
  private readonly headers: Headers;
  private readonly timeout: number = 30000;
  private lastRequestTime = 0;
  private readonly rateLimitDelay = 200; // 500 istek/saniye için güvenli bir değer
  private readonly maxRetries = 3;

  constructor(private readonly credentials: HepsiburadaCredentials) {
    // Doğru baseURL'i kullan
    this.baseURL = credentials.baseUrl || 'https://mpop-sit.hepsiburada.com';
    
    // Basic Auth için token oluştur
    // Hepsiburada'nın istediği formatta: merchantId:secretKey
    const token = Buffer.from(`${credentials.merchantId}:${credentials.secretKey}`).toString('base64');
    
    this.headers = new Headers({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': credentials.userAgent || 'vipcase_dev' // Developer Username
    });
    
    console.log("Hepsiburada API Credentials:", {
      baseUrl: this.baseURL,
      merchantId: this.credentials.merchantId,
      userAgent: this.headers.get('User-Agent')
    });
  }

  private async handleRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await this.delay(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  private async fetchWithTimeout(url: string, options: any = {}): Promise<Response> {
    await this.handleRateLimit();
    
    const timeout = options.timeout || this.timeout;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`Request: ${this.baseURL}${url}`);
      
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: this.headers,
        signal: controller.signal
      });
      
      clearTimeout(id);
      
      console.log(`Response Status: ${response.status}`);
      
      if (response.status === 401) {
        const errorText = await response.text();
        console.error(`401 Unauthorized Error Details:`, errorText);
        throw new Error(`Authentication failed: ${errorText}`);
      }
      
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
      throw error;
    }
  }

  // Bağlantı testi için doğru endpoint
  async testConnection(): Promise<boolean> {
    try {
      // Kategori endpoint'i
      const response = await this.fetchWithTimeout(
        `/product/api/categories/get-all-categories?leaf=true&status=ACTIVE&available=true&size=1&page=0&version=1`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Bağlantı testi başarısız:', error);
      return false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Tüm kategorileri çekme
  async getCategories(page: number = 0, size: number = 1000): Promise<HepsiburadaCategoryResponse> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/categories/get-all-categories?leaf=true&status=ACTIVE&available=true&size=${size}&page=${page}&version=1`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Kategoriler alınamadı:', error);
      throw error;
    }
  }

  // Kategori özelliklerini çekme
  async getCategoryAttributes(categoryId: number): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/categories/${categoryId}/attributes`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error(`Kategori özellikleri alınamadı (categoryId: ${categoryId}):`, error);
      throw error;
    }
  }

  // Özellik değerlerini çekme
  async getAttributeValues(categoryId: number, attributeId: string, page: number = 0, limit: number = 1000): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/categories/${categoryId}/attributes/${attributeId}/values?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error(`Özellik değerleri alınamadı (categoryId: ${categoryId}, attributeId: ${attributeId}):`, error);
      throw error;
    }
  }

  // Listing bilgilerini çekme
  async getListings(offset: number = 0, limit: number = 100): Promise<any> {
    try {
      // Dokümantasyona göre doğru endpoint
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}?offset=${offset}&limit=${limit}`;
      
      console.log(`Request: ${listingBaseUrl}${path}`);
      
      // AbortController ile timeout oluştur
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Özel bir fetch isteği oluştur
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'GET',
        headers: this.headers,
        signal: controller.signal
      });
      
      // Timeout'u temizle
      clearTimeout(timeoutId);
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing bilgileri alınamadı:', error);
      throw error;
    }
  }

  // Belirli bir listing bilgisini çekme
  async getListing(hepsiburadaSku: string, merchantSku?: string): Promise<any> {
    try {
      let url = `/listing/listings/merchant/${this.credentials.merchantId}?hepsiburadaSku=${hepsiburadaSku}`;
      if (merchantSku) {
        url += `&merchantSku=${merchantSku}`;
      }
      
      const response = await this.fetchWithTimeout(
        url,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Listing bilgisi alınamadı:', error);
      throw error;
    }
  }

  // Listing envanter güncelleme (stok, fiyat, kargolama süresi, teslimat profili)
  async updateListingInventory(listingData: any): Promise<any> {
    try {
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}/inventory-uploads`;
      
      console.log(`Listing envanter güncelleme isteği: ${listingBaseUrl}${path}`);
      
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listingData)
      });
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing envanter güncellenemedi:', error);
      throw error;
    }
  }

  // Listing stok güncelleme
  async updateListingStock(stockData: any): Promise<any> {
    try {
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}/stock-uploads`;
      
      console.log(`Listing stok güncelleme isteği: ${listingBaseUrl}${path}`);
      
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      });
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing stok güncellenemedi:', error);
      throw error;
    }
  }

  // Listing fiyat güncelleme
  async updateListingPrice(priceData: any): Promise<any> {
    try {
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}/price-uploads`;
      
      console.log(`Listing fiyat güncelleme isteği: ${listingBaseUrl}${path}`);
      
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(priceData)
      });
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing fiyat güncellenemedi:', error);
      throw error;
    }
  }

  // Genel listing güncelleme (eski metodu koruyalım, içeriğe göre doğru endpoint'i çağırsın)
  async updateListing(listingData: any): Promise<any> {
    try {
      // Gelen veriye göre hangi güncelleme türünü kullanacağımızı belirleyelim
      if (listingData.onlyUpdatePrice === true) {
        // Sadece fiyat güncellemesi
        return await this.updateListingPrice(listingData);
      } else if (listingData.onlyUpdateStock === true) {
        // Sadece stok güncellemesi
        return await this.updateListingStock(listingData);
      } else {
        // Genel envanter güncellemesi
        return await this.updateListingInventory(listingData);
      }
    } catch (error) {
      console.error('Listing güncellenemedi:', error);
      throw error;
    }
  }

  // Listing silme
  async deleteListing(hepsiburadaSku: string): Promise<any> {
    try {
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}/${hepsiburadaSku}`;
      
      console.log(`Request: ${listingBaseUrl}${path}`);
      
      // AbortController ile timeout oluştur
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Özel bir fetch isteği oluştur
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'DELETE',
        headers: this.headers,
        signal: controller.signal
      });
      
      // Timeout'u temizle
      clearTimeout(timeoutId);
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing silinemedi:', error);
      throw error;
    }
  }

  // Listing satışa açma/kapatma
  async toggleListingStatus(hepsiburadaSku: string, isSalable: boolean): Promise<any> {
    try {
      const listingBaseUrl = 'https://listing-external-sit.hepsiburada.com';
      const path = `/listings/merchantid/${this.credentials.merchantId}/status`;
      
      console.log(`Request: ${listingBaseUrl}${path}`);
      
      // AbortController ile timeout oluştur
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Özel bir fetch isteği oluştur
      const response = await fetch(`${listingBaseUrl}${path}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          hepsiburadaSku,
          isSalable
        }),
        signal: controller.signal
      });
      
      // Timeout'u temizle
      clearTimeout(timeoutId);
      
      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Listing durumu değiştirilemedi:', error);
      throw error;
    }
  }

  // Ürün bilgilerini çekme
  async getProducts(page: number = 0, size: number = 100): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/products?page=${page}&size=${size}`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Ürün bilgileri alınamadı:', error);
      throw error;
    }
  }

  // Ürün detayını çekme
  async getProductDetail(productId: string): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/products/${productId}`,
        {
          method: 'GET',
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Ürün detayı alınamadı:', error);
      throw error;
    }
  }

  // Ürün oluşturma
  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.fetchWithTimeout(
        `/product/api/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData),
          validateStatus: (status: number) => status === 200
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Ürün oluşturulamadı:', error);
      throw error;
    }
  }

  // Listing detaylarını çekme
  async getListingDetail(listingId: string): Promise<any> {
    try {
      const url = `${this.baseURL}/listings/${listingId}`;
      console.log(`Listing detay isteği: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Listing bulunamadı (ID: ${listingId}). Bu, test ortamında normal olabilir.`);
          return null;
        }
        throw new Error(`Listing detayları alınamadı: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Listing detayları alınamadı (listingId: ${listingId}):`, error);
      return null; // null döndürerek hata durumunda da devam etmesini sağlayalım
    }
  }
} 