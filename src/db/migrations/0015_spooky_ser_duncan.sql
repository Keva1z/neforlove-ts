ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11T00:45:25.272+03:00';--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11T00:45:25.272+03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-11T00:45:25.264+03:00';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "verifiedAt" SET DATA TYPE varchar(128);