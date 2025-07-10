import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

// 패키지(여행 상품) 테이블 정의
export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  destination: text('destination').notNull(),
  price: numeric('price').notNull(),
  duration: integer('duration').notNull(),
  category: text('category').notNull(),
  image_url: text('image_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// 예약 테이블 정의
export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  package_id: integer('package_id').notNull(),
  user_id: text('user_id').notNull(),
  reservation_date: timestamp('reservation_date').notNull(),
  travel_date: timestamp('travel_date').notNull(),
  status: text('status').notNull().default('pending'),
  payment_status: text('payment_status').notNull().default('unpaid'),
  adults: integer('adults').notNull(),
  children: integer('children').default(0),
  total_price: numeric('total_price').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
