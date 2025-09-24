import { pgEnum } from "drizzle-orm/pg-core"; 

export const sexEnum = pgEnum("sex", ["Male", "Female", "Unknown"])
export const roleEnum = pgEnum("role", ["User", "Owner", "Senior-Moderator", "Moderator"])

// export const subscriptionEnum = pgEnum("subscription", ["Free", "Premium", "Legend"])
