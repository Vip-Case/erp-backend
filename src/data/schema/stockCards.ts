// src/data/schema/stockCardSchema.ts

import { pgTable, uuid, varchar, text, decimal, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import mongoose, { Schema, Document } from 'mongoose';
import { ProductType, Currency } from '../../types';

export const stockCards = pgTable('stock_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  productCode: varchar('product_code', { length: 100 }).notNull().unique(),
  productName: varchar('product_name', { length: 150 }).notNull(),
  invoiceName: varchar('invoice_name', { length: 150 }),
  shortDescription: varchar('short_description', { length: 150 }),
  description: text('description'),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
  warehouseCode: varchar('warehouse_code', { length: 50 }).notNull(),
  manufacturerCode: varchar('manufacturer_code', { length: 50 }),
  companyCode: varchar('company_code', { length: 50 }).notNull(),
  branchCode: varchar('branch_code', { length: 50 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  unitOfMeasure: varchar('unit_of_measure', { length: 50 }),
  productType: varchar('product_type', { length: 50 }).$type<ProductType>().notNull(),
  riskQuantities: jsonb('risk_quantities').$type<{ period: string; quantity: number }[]>(),
  stockStatus: boolean('stock_status').default(true),
  hasExpirationDate: boolean('has_expiration_date').notNull(),
  allowNegativeStock: boolean('allow_negative_stock').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
});

export const stockCardPriceLists = pgTable('stock_card_price_lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  priceListId: uuid('price_list_id'),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 50 }).$type<Currency>(),
  taxIncluded: boolean('tax_included').default(false),
});

export const stockCardAttributes = pgTable('stock_card_attributes', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  attributeName: varchar('attribute_name', { length: 100 }).notNull(),
  attributeValue: varchar('attribute_value', { length: 255 }).notNull(),
});

export const stockCardBarcodes = pgTable('stock_card_barcodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  barcode: varchar('barcode', { length: 100 }).unique(),
});

export const stockCardCategories = pgTable('stock_card_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  categoryId: uuid('category_id'),
});

export const stockCardVariants = pgTable('stock_card_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  sku: varchar('sku', { length: 100 }).unique(),
  price: decimal('price', { precision: 10, scale: 2 }),
  quantity: decimal('quantity', { precision: 10, scale: 2 }),
});

export const stockCardTaxRates = pgTable('stock_card_tax_rates', {
  id: uuid('id').defaultRandom().primaryKey(),
  stockCardId: uuid('stock_card_id').references(() => stockCards.id),
  taxName: varchar('tax_name', { length: 100 }).notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(),
});

// MongoDB'de saklanacak veri şemaları (referans için)

export interface IStockCardImage extends Document {
  stockCardId: string;
  imageUrl: string;
  isDefault: boolean;
}

// StockCardVideo için interface
export interface IStockCardVideo extends Document {
  stockCardId: string;
  videoUrl: string;
}

// StockCardImage için schema
const StockCardImageSchema: Schema = new Schema({
  stockCardId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

// StockCardVideo için schema
const StockCardVideoSchema: Schema = new Schema({
  stockCardId: { type: String, required: true },
  videoUrl: { type: String, required: true }
});

// Model oluşturma
export const StockCardImage = mongoose.model<IStockCardImage>('StockCardImage', StockCardImageSchema);
export const StockCardVideo = mongoose.model<IStockCardVideo>('StockCardVideo', StockCardVideoSchema);

// İleride kullanıcı tablosu eklendiğinde referans olarak kullanılacak
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  // Diğer kullanıcı alanları buraya eklenecek
});