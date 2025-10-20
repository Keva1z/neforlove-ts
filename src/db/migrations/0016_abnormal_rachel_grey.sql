ALTER TABLE "Forms" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-20T09:06:05.501+03:00';--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-20T09:06:05.501+03:00';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-10-20T09:06:05.492+03:00';--> statement-breakpoint
ALTER TABLE "Forms" ADD COLUMN "verifiedById" bigint;--> statement-breakpoint
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_verifiedById_users_userid_fk" FOREIGN KEY ("verifiedById") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_verifiedById_unique" UNIQUE("verifiedById");