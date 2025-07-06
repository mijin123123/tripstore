import { pgTable, text, timestamp, uuid, boolean, foreignKey, integer, numeric, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const admins = pgTable("admins", {
	email: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const notices = pgTable("notices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	isImportant: boolean("is_important").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const reservations = pgTable("reservations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	packageId: uuid("package_id"),
	departureDate: text("departure_date").notNull(),
	travelers: integer().notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
	status: text().default('pending').notNull(),
	paymentStatus: text("payment_status").default('unpaid').notNull(),
	contactName: text("contact_name").notNull(),
	contactEmail: text("contact_email").notNull(),
	contactPhone: text("contact_phone").notNull(),
	specialRequests: text("special_requests"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: "reservations_package_id_packages_id_fk"
		}).onDelete("cascade"),
]);

export const packages = pgTable("packages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	destination: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	discountprice: numeric({ precision: 10, scale:  2 }),
	duration: integer(),
	departuredate: text().array().notNull(),
	images: text().array().notNull(),
	rating: numeric({ precision: 2, scale:  1 }),
	reviewcount: integer().default(0),
	category: text().notNull(),
	season: text(),
	inclusions: text().array(),
	exclusions: text().array(),
	isfeatured: boolean().default(false),
	isonsale: boolean().default(false),
	itinerary: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	packageId: uuid("package_id"),
	rating: integer().notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: "reviews_package_id_packages_id_fk"
		}).onDelete("cascade"),
]);
