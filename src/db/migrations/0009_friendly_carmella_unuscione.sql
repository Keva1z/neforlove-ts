ALTER TABLE "locations" ADD COLUMN "country" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "state" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "city" varchar(128);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "latitude" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "longitude" integer NOT NULL;