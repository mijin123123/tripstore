import { pgTable, text, varchar, decimal, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const packages = pgTable('packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  destination: varchar('destination', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
  duration: varchar('duration', { length: 100 }),
  category: varchar('category', { length: 100 }),
  season: varchar('season', { length: 50 }),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  reviewCount: decimal('review_count', { precision: 10, scale: 0 }),
  images: jsonb('images'),
  departureDate: jsonb('departure_date'),
  inclusions: jsonb('inclusions'),
  exclusions: jsonb('exclusions'),
  itinerary: jsonb('itinerary'),
  isFeatured: boolean('is_featured').default(false),
  isOnSale: boolean('is_on_sale').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user'),
  isEmailVerified: boolean('is_email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  packageId: uuid('package_id').references(() => packages.id),
  travelers: varchar('travelers', { length: 10 }).notNull(),
  departureDate: varchar('departure_date', { length: 20 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  customerInfo: jsonb('customer_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  isImportant: boolean('is_important').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

export type Notice = typeof notices.$inferSelect;
export type NewNotice = typeof notices.$inferInsert;
