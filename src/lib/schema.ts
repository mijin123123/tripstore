import { pgTable, text, boolean, decimal, integer, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

// 패키지 테이블 스키마 정의
export const packagesSchema = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  destination: text("destination").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountprice: decimal("discountprice", { precision: 10, scale: 2 }),
  duration: integer("duration").notNull(),
  departuredate: jsonb("departuredate").$type<string[]>(), // jsonb 타입으로 변경
  images: jsonb("images").$type<string[]>(), // jsonb 타입으로 변경
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewcount: integer("reviewcount").default(0),
  category: text("category").notNull(),
  season: text("season"),
  inclusions: jsonb("inclusions").$type<string[]>(), // jsonb 타입으로 변경
  exclusions: jsonb("exclusions").$type<string[]>(), // jsonb 타입으로 변경
  isfeatured: boolean("isfeatured").default(false),
  isonsale: boolean("isonsale").default(false),
  itinerary: jsonb("itinerary").$type<Record<string, any>>(), // jsonb 타입으로 변경
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 사용자 테이블 스키마 정의
export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  avatar_url: text("avatar_url"),
  phone: text("phone"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 예약 테이블 스키마 정의
export const reservationsSchema = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => usersSchema.id),
  package_id: uuid("package_id").references(() => packagesSchema.id),
  reservation_code: text("reservation_code").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  travelers: integer("travelers").notNull(),
  departure_date: text("departure_date").notNull(), // DATE 타입은 text로 간단히 처리
  special_requests: text("special_requests"),
  payment_method: text("payment_method").notNull(),
  payment_status: text("payment_status").notNull().default("pending"),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 공지사항 테이블 스키마 정의
export const noticesSchema = pgTable("notices", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  is_important: boolean("is_important").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 관리자 테이블 스키마 정의
export const adminsSchema = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").default("admin"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
