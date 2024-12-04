// PlatformInterface.ts
export interface PlatformInterface {
    createProduct(productData: any): Promise<any>; // Yeni bir ürün oluşturma
    updateProduct(productId: string, productData: any): Promise<any>; // Mevcut bir ürünü güncelleme
    deleteProduct(productId: string): Promise<boolean>; // Mevcut bir ürünü silme
    getProduct(productId: string): Promise<any>; // Tek bir ürünü çekme
    getProducts(filters?: any): Promise<any[]>; // Ürün listesini çekme (filtreleme destekli)
  }
  