CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"password_hash" varchar(255),
	"role" varchar(50) DEFAULT 'user',
	"is_email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "admins" CASCADE;--> statement-breakpoint
DROP TABLE "reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_package_id_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "notices" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "destination" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "duration" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "images" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "images" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "rating" SET DATA TYPE numeric(3, 2);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "category" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "season" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "inclusions" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "exclusions" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "departure_date" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "travelers" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notices" ADD COLUMN "author_id" uuid;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "discount_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "review_count" numeric(10, 0);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "departure_date" jsonb;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "is_on_sale" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "customer_info" jsonb;--> statement-breakpoint
ALTER TABLE "notices" ADD CONSTRAINT "notices_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "discountprice";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "departuredate";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "reviewcount";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "isfeatured";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "isonsale";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "contact_name";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "contact_email";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "contact_phone";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "special_requests";