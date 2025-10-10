ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11 00:16:55.124 +03:00';--> statement-breakpoint
ALTER TABLE "Forms" ALTER COLUMN "verifiedAt" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11 00:16:55.125 +03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscriptionEnd" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11 00:16:55.115 +03:00';