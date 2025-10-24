ALTER TABLE "Forms" DROP CONSTRAINT "Forms_verifiedById_unique";--> statement-breakpoint
ALTER TABLE "verifications" DROP CONSTRAINT "verifications_verifiedById_unique";--> statement-breakpoint
ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T17:57:12.747+03:00';--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T17:57:12.747+03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T17:57:12.738+03:00';