// Hepsiburada API için tip tanımlamaları

export interface HepsiburadaCredentials {
  merchantId: string;    // Merchant ID
  secretKey: string;     // Secret Key
  userAgent: string;     // Developer Username
  baseUrl?: string;      // API URL (opsiyonel)
}

// Kategori bilgisi için tip tanımlaması
export interface HepsiburadaCategory {
  categoryId: number;
  name: string;
  parentCategoryId: number | null;
  paths: string;
  leaf: boolean;
  status: string;
  available: boolean;
}

// Kategori yanıtı için tip tanımlaması
export interface HepsiburadaCategoryResponse {
  success: boolean;
  code: number;
  version: number;
  message: string | null;
  totalElements: number;
  totalPages: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  data: HepsiburadaCategory[];
} 