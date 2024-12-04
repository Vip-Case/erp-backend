// WooCommerceAdapter.ts
import { PlatformInterface } from './../interfaces/platformInterface';
import axios from 'axios';

export class WooCommerceAdapter implements PlatformInterface {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(baseUrl: string, consumerKey: string, consumerSecret: string) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  private getAuthParams() {
    return {
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
    };
  }

  async createProduct(productData: any): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/wp-json/wc/v3/products`,
      productData,
      { params: this.getAuthParams() }
    );
    return response.data;
  }

  async updateProduct(productId: string, productData: any): Promise<any> {
    const response = await axios.put(
      `${this.baseUrl}/wp-json/wc/v3/products/${productId}`,
      productData,
      { params: this.getAuthParams() }
    );
    return response.data;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const response = await axios.delete(
      `${this.baseUrl}/wp-json/wc/v3/products/${productId}`,
      { params: { ...this.getAuthParams(), force: true } }
    );
    return response.status === 200;
  }

  async getProduct(productId: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/wp-json/wc/v3/products/${productId}`,
      { params: this.getAuthParams() }
    );
    return response.data;
  }

  async getProducts(filters: any = {}): Promise<any[]> {
    const response = await axios.get(
      `${this.baseUrl}/wp-json/wc/v3/products`,
      { params: { ...this.getAuthParams(), ...filters } }
    );
    return response.data;
  }

  
}
