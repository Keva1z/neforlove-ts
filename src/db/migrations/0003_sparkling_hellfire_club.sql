CREATE TYPE "public"."subscription" AS ENUM('Free', 'Premium', 'Legend');--> statement-breakpoint
CREATE TABLE "referrals" (
	"userid" bigint NOT NULL,
	"code" varchar(32) NOT NULL,
	"referrer_id" bigint,
	"verified" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "referrals_userid_unique" UNIQUE("userid"),
	CONSTRAINT "referrals_code_unique" UNIQUE("code"),
	CONSTRAINT "referrals_referrer_id_unique" UNIQUE("referrer_id")
);
--> statement-breakpoint
CREATE TABLE "search_settings" (
	"userid" bigint NOT NULL,
	"searchId" integer DEFAULT 0 NOT NULL,
	"searchSex" "sex" DEFAULT 'Unknown' NOT NULL,
	"ageFrom" integer DEFAULT 16 NOT NULL,
	"ageTo" integer DEFAULT 40 NOT NULL,
	"city" varchar(128),
	"distance" integer DEFAULT 1000 NOT NULL,
	"by_distance" boolean DEFAULT false NOT NULL,
	CONSTRAINT "search_settings_userid_unique" UNIQUE("userid")
);
--> statement-breakpoint
CREATE TABLE "user_statistics" (
	"userid" bigint NOT NULL,
	"likesIn" integer DEFAULT 0 NOT NULL,
	"likesOut" integer DEFAULT 0 NOT NULL,
	"dislikesIn" integer DEFAULT 0 NOT NULL,
	"dislikesOut" integer DEFAULT 0 NOT NULL,
	"videonotes" integer DEFAULT 0 NOT NULL,
	"forms" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_statistics_userid_unique" UNIQUE("userid")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"userid" bigint NOT NULL,
	"verified_at" timestamp with time zone,
	"videonote" varchar(256),
	"phrase" varchar(32) NOT NULL,
	"verified_by_id" bigint,
	CONSTRAINT "verifications_userid_unique" UNIQUE("userid"),
	CONSTRAINT "verifications_verified_by_id_unique" UNIQUE("verified_by_id")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "ban_message" TO "banMessage";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription" "subscription" DEFAULT 'Free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscriptionEnd" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_userid_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_settings" ADD CONSTRAINT "search_settings_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_verified_by_id_users_userid_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;