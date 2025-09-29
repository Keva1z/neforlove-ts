ALTER TABLE "Forms" RENAME COLUMN "location_id" TO "locationId";--> statement-breakpoint
ALTER TABLE "Forms" RENAME COLUMN "verified_at" TO "verifiedAt";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "referrals" RENAME COLUMN "referrer_id" TO "referrerId";--> statement-breakpoint
ALTER TABLE "search_settings" RENAME COLUMN "by_distance" TO "byDistance";--> statement-breakpoint
ALTER TABLE "verifications" RENAME COLUMN "verified_at" TO "verifiedAt";--> statement-breakpoint
ALTER TABLE "verifications" RENAME COLUMN "verified_by_id" TO "verifiedById";--> statement-breakpoint
ALTER TABLE "referrals" DROP CONSTRAINT "referrals_referrer_id_unique";--> statement-breakpoint
ALTER TABLE "verifications" DROP CONSTRAINT "verifications_verified_by_id_unique";--> statement-breakpoint
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "referrals" DROP CONSTRAINT "referrals_referrer_id_users_userid_fk";
--> statement-breakpoint
ALTER TABLE "verifications" DROP CONSTRAINT "verifications_verified_by_id_users_userid_fk";
--> statement-breakpoint
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_locationId_locations_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_users_userid_fk" FOREIGN KEY ("referrerId") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_verifiedById_users_userid_fk" FOREIGN KEY ("verifiedById") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_unique" UNIQUE("referrerId");--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_verifiedById_unique" UNIQUE("verifiedById");