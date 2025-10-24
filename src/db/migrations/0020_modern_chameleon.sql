ALTER TABLE "referrals" DROP CONSTRAINT "referrals_referrerId_unique";--> statement-breakpoint
ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T18:11:55.492+03:00';--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T18:11:55.493+03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-24T18:11:55.483+03:00';