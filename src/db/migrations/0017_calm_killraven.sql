ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T14:11:33.060+03:00';--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T14:11:33.060+03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T14:11:33.051+03:00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "balance" integer DEFAULT 0 NOT NULL;