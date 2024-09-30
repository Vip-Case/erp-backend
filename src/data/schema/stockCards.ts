// src/data/schema/stockCardSchema.ts

import { pgTable, uuid, varchar, text, decimal, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { ProductType, Currency } from '../../types';

export const stockCards = pgTable('stock_cards', {
  id: uuid('id').defaultRandom().primaryKey(), // UUID v4
  productCode: varchar('product_code', { length: 100 }).notNull().unique(), // Ürün kodu
  productName: varchar('product_name', { length: 150 }).notNull(), // Ürün adı
  invoiceName: varchar('invoice_name', { length: 150 }), // Fatura adı
  shortDescription: varchar('short_description', { length: 150 }), // Kısa açıklama
  description: text('description'), // Açıklama
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }), // Alış fiyatı
  warehouseCode: varchar('warehouse_code', { length: 50 }).notNull(), // Depo kodu
  manufacturerCode: varchar('manufacturer_code', { length: 50 }), // Üretici kodu
  companyCode: varchar('company_code', { length: 50 }).notNull(), // Şirket kodu
  branchCode: varchar('branch_code', { length: 50 }).notNull(), // Şube kodu
  brand: varchar('brand', { length: 100 }), // Marka
  unitOfMeasure: varchar('unit_of_measure', { length: 50 }), // Ölçü birimi
  productType: varchar('product_type', { length: 50 }).$type<ProductType>().notNull(), // Ürün tipi
  riskQuantities: jsonb('risk_quantities').$type<{ period: string; quantity: number }[]>(), // Riskli miktarlar
  stockStatus: boolean('stock_status').default(true), // Stok durumu
  hasExpirationDate: boolean('has_expiration_date').notNull(), // Son kullanma tarihi var mı?
  allowNegativeStock: boolean('allow_negative_stock').notNull(), // Negatif stok izni
  createdAt: timestamp('created_at').defaultNow(), // Oluşturulma tarihi
  updatedAt: timestamp('updated_at').defaultNow(), // Güncellenme tarihi
  createdBy: uuid('created_by'), // Oluşturan kullanıcı
  updatedBy: uuid('updated_by'), // Güncelleyen kullanıcı
});

// Fiyat listeleri tablosu
export const stockCardPriceLists = pgTable('stock_card_price_lists', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  currency: varchar('currency', { length: 50 }).$type<Currency>(), // Para birimi
  taxIncluded: boolean('tax_included').default(false), // Vergi dahil mi?
});

// Fiyat listesi kalemleri tablosu
export const stockCardPriceListItems = pgTable('stock_card_price_list_items', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  priceListId: uuid('price_list_id').references(() => stockCardPriceLists.id), // Fiyat listesi ID'si
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  price: decimal('price', { precision: 10, scale: 2 }), // Fiyat
});

// Özellikler tablosu
export const stockCardAttributes = pgTable('stock_card_attributes', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  attributeName: varchar('attribute_name', { length: 100 }).notNull(), // Özellik adı
  attributeValue: varchar('attribute_value', { length: 255 }).notNull(), // Özellik değeri
});

// Barkodlar tablosu
export const stockCardBarcodes = pgTable('stock_card_barcodes', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  barcode: varchar('barcode', { length: 100 }).unique(), // Barkod
});

export const stockCardCategories = pgTable('stock_card_categories', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  category: varchar('category'), // Kategori
});

// Kategoriler 
export const stockCardCategoriesItems = pgTable('stock_card_categories', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  categoryId: uuid('category_id'), // Kategori ID'si
});

// Varyantlar tablosu
export const stockCardVariants = pgTable('stock_card_variants', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  sku: varchar('sku', { length: 100 }).unique(), // SKU
  price: decimal('price', { precision: 10, scale: 2 }), // Fiyat
  quantity: decimal('quantity', { precision: 10, scale: 2 }), // Miktar
});

// Vergi oranları tablosu
export const stockCardTaxRates = pgTable('stock_card_tax_rates', {
  id: uuid('id').defaultRandom().primaryKey(), // Birincil anahtar
  stockCardId: uuid('stock_card_id').references(() => stockCards.id), // Stok kartı ID'si
  taxName: varchar('tax_name', { length: 100 }).notNull(), // Vergi adı
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(), // Vergi oranı
});

// İleride kullanıcı tablosu eklendiğinde referans olarak kullanılacak
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  // Diğer kullanıcı alanları buraya eklenecek
});