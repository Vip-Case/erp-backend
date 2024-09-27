CREATE TABLE IF NOT EXISTS "stock_card_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"attribute_name" varchar(100) NOT NULL,
	"attribute_value" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_card_barcodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"barcode" varchar(100),
	CONSTRAINT "stock_card_barcodes_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_card_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"category_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_card_price_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"price_list_id" uuid,
	"price" numeric(10, 2),
	"currency" varchar(50),
	"tax_included" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_card_tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"tax_name" varchar(100) NOT NULL,
	"tax_rate" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_card_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_card_id" uuid,
	"sku" varchar(100),
	"price" numeric(10, 2),
	"quantity" numeric(10, 2),
	CONSTRAINT "stock_card_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_code" varchar(100) NOT NULL,
	"product_name" varchar(150) NOT NULL,
	"invoice_name" varchar(150),
	"short_description" varchar(150),
	"description" text,
	"purchase_price" numeric(10, 2),
	"warehouse_code" varchar(50) NOT NULL,
	"manufacturer_code" varchar(50),
	"company_code" varchar(50) NOT NULL,
	"branch_code" varchar(50) NOT NULL,
	"brand" varchar(100),
	"unit_of_measure" varchar(50),
	"product_type" varchar(50) NOT NULL,
	"risk_quantities" jsonb,
	"stock_status" boolean DEFAULT true,
	"has_expiration_date" boolean NOT NULL,
	"allow_negative_stock" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "stock_cards_product_code_unique" UNIQUE("product_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_attributes" ADD CONSTRAINT "stock_card_attributes_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_barcodes" ADD CONSTRAINT "stock_card_barcodes_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_categories" ADD CONSTRAINT "stock_card_categories_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_price_lists" ADD CONSTRAINT "stock_card_price_lists_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_tax_rates" ADD CONSTRAINT "stock_card_tax_rates_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_card_variants" ADD CONSTRAINT "stock_card_variants_stock_card_id_stock_cards_id_fk" FOREIGN KEY ("stock_card_id") REFERENCES "public"."stock_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
