CREATE TABLE "Forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" bigint NOT NULL,
	"name" varchar(64) NOT NULL,
	"age" integer NOT NULL,
	"sex" "sex" DEFAULT 'Male' NOT NULL,
	"about" varchar(1024) NOT NULL,
	"media" varchar(2048)[] DEFAULT ARRAY[]::varchar[] NOT NULL,
	"location_id" integer NOT NULL,
	"searchId" integer NOT NULL,
	"status" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"inactive" boolean DEFAULT false NOT NULL,
	CONSTRAINT "Forms_userid_unique" UNIQUE("userid"),
	CONSTRAINT "Forms_searchId_unique" UNIQUE("searchId")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" bigint NOT NULL,
	"created_at" timestamp with time zone,
	"location" geometry(point) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE no action ON UPDATE no action;