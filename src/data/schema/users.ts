import { pgTable, uuid, varchar, text, decimal, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

// kullanıclara ait tablo
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), // UUID v4
  name: varchar('name', { length: 100 }).notNull(), // kullanıcı adı
  email: varchar('email', { length: 150 }).notNull(), // email
  password: varchar('password', { length: 150 }).notNull(), // şifre
    roleId: uuid('role_id').references(() => roles.id), // rol id
  createdAt: timestamp('created_at').defaultNow(), // Oluşturulma tarihi
  updatedAt: timestamp('updated_at').defaultNow(), // Güncellenme tarihi
  createdBy: uuid('created_by'), // Oluşturan kullanıcı
  updatedBy: uuid('updated_by'), // Güncelleyen kullanıcı
});

// roller tablosu
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(), // UUID v4
  name: varchar('name', { length: 100 }).notNull(), // rol adı
  createdAt: timestamp('created_at').defaultNow(), // Oluşturulma tarihi
  updatedAt: timestamp('updated_at').defaultNow(), // Güncellenme tarihi
  createdBy: uuid('created_by'), // Oluşturan kullanıcı
  updatedBy: uuid('updated_by'), // Güncelleyen kullanıcı
});