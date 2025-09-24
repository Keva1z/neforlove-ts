CREATE TYPE "public"."role" AS ENUM('User', 'Owner', 'Senior-Moderator', 'Moderator');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('Male', 'Female', 'Unknown');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" "sex" DEFAULT 'Unknown';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'User';