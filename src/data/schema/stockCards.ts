import { pgTable, serial, varchar, numeric, boolean, timestamp } from "drizzle-orm/pg-core";

export const stockCards = pgTable('stock_cards', {
  id: serial('id').primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  // Diğer alanlar...
});