ALTER TABLE "users" ALTER COLUMN "userid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ban_message" varchar(128);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_userid_unique" UNIQUE("userid");