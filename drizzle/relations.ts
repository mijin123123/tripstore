import { relations } from "drizzle-orm/relations";
import { packages, reservations, reviews } from "./schema";

export const reservationsRelations = relations(reservations, ({one}) => ({
	package: one(packages, {
		fields: [reservations.packageId],
		references: [packages.id]
	}),
}));

export const packagesRelations = relations(packages, ({many}) => ({
	reservations: many(reservations),
	reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	package: one(packages, {
		fields: [reviews.packageId],
		references: [packages.id]
	}),
}));