import { pgTable, text, uuid, decimal, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const packages = pgTable('packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  destination: text('destination').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountprice: decimal('discountprice', { precision: 10, scale: 2 }),
  duration: integer('duration'),
  departuredate: text('departuredate').array().notNull(),
  images: text('images').array().notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }),
  reviewcount: integer('reviewcount').default(0),
  category: text('category').notNull(),
  season: text('season'),
  inclusions: text('inclusions').array(),
  exclusions: text('exclusions').array(),
  isfeatured: boolean('isfeatured').default(false),
  isonsale: boolean('isonsale').default(false),
  itinerary: jsonb('itinerary'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const admins = pgTable('admins', {
  email: text('email').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // 외래 키 제약 조건 제거
  packageId: uuid('package_id').references(() => packages.id, { onDelete: 'cascade' }),
  departureDate: text('departure_date').notNull(),
  travelers: integer('travelers').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  paymentStatus: text('payment_status').notNull().default('unpaid'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // 외래 키 제약 조건 제거
  packageId: uuid('package_id').references(() => packages.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isImportant: boolean('is_important').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
