import { pgTable, bigint, serial, varchar, boolean, integer, PgDate } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { sexEnum, roleEnum, subscriptionEnum } from "./enums";
import { Form, Location } from "./form";
import { createTimestamp } from "@/utils/datetime";

const user = pgTable("users", {
  id: serial().primaryKey(),
  userid: bigint({ mode: "number" }).notNull().unique(),

  sex: sexEnum().default("Unknown").notNull(),
  role: roleEnum().default("User").notNull(),

  // Videonote verification fields
  verified: boolean().default(false).notNull(),

  // Subscription fields
  subscription: subscriptionEnum().default("Free").notNull(),
  subscriptionEnd: varchar({ length: 128 }),

  // Ban fields
  banned: boolean().default(false).notNull(),
  banMessage: varchar({ length: 128 }),

  createdAt: varchar({ length: 128 }).default(createTimestamp()),

  // Inactive on bot-block
  inactive: boolean().default(false).notNull(),
});

const verification = pgTable("verifications", {
  userid: bigint({ mode: "number" })
    .notNull()
    .unique()
    .references(() => user.userid),
  verifiedAt: varchar({ length: 128 }),
  videonote: varchar({ length: 256 }),
  phrase: varchar({ length: 32 }).notNull(),
  verifiedById: bigint({ mode: "number" })
    .unique()
    .references(() => user.userid),
});

const referral = pgTable("referrals", {
  userid: bigint({ mode: "number" })
    .notNull()
    .unique()
    .references(() => user.userid),
  code: varchar({ length: 32 }).notNull().unique(),
  referrerId: bigint({ mode: "number" })
    .unique()
    .references(() => user.userid),
  verified: integer().default(0).notNull(),
  total: integer().default(0).notNull(),
});

const searchSettings = pgTable("search_settings", {
  userid: bigint({ mode: "number" })
    .notNull()
    .unique()
    .references(() => user.userid),
  searchId: integer().default(0).notNull(),
  searchSex: sexEnum().default("Unknown").notNull(),
  ageFrom: integer().default(16).notNull(),
  ageTo: integer().default(40).notNull(),
  city: varchar({ length: 128 }),
  distance: integer().default(1000).notNull(), // In meters
  byDistance: boolean().default(false).notNull(),
});

const statistics = pgTable("user_statistics", {
  userid: bigint({ mode: "number" })
    .notNull()
    .unique()
    .references(() => user.userid),
  likesIn: integer().default(0).notNull(),
  likesOut: integer().default(0).notNull(),
  dislikesIn: integer().default(0).notNull(),
  dislikesOut: integer().default(0).notNull(),
  videonotes: integer().default(0).notNull(),
  forms: integer().default(0).notNull(),
});

export { user, verification, referral, searchSettings, statistics };

export const userRelations = relations(user, ({ one, many }) => ({
  settings: one(searchSettings, {
    fields: [user.userid],
    references: [searchSettings.userid],
  }),
  statistics: one(statistics, {
    fields: [user.userid],
    references: [statistics.userid],
  }),
  referral: one(referral, {
    fields: [user.userid],
    references: [referral.userid],
    relationName: "referral",
  }),
  verification: one(verification, {
    fields: [user.userid],
    references: [verification.userid],
    relationName: "verification",
  }),
  form: one(Form, {
    fields: [user.userid],
    references: [Form.userid],
    relationName: "form",
  }),
  locations: many(Location),
}));

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(user, {
    fields: [verification.userid],
    references: [user.userid],
    relationName: "user",
  }),
  verified_by: one(user, {
    fields: [verification.verifiedById],
    references: [user.userid],
    relationName: "moderator",
  }),
}));

export const referralRelations = relations(referral, ({ one }) => ({
  user: one(user, {
    fields: [referral.userid],
    references: [user.userid],
    relationName: "user",
  }),
  referrer: one(user, {
    fields: [referral.referrerId],
    references: [user.userid],
    relationName: "referrer",
  }),
}));

export const settingsRelations = relations(searchSettings, ({ one }) => ({
  user: one(user, {
    fields: [searchSettings.userid],
    references: [user.userid],
    relationName: "user",
  }),
}));

export const statisticsRelations = relations(statistics, ({ one }) => ({
  user: one(user, {
    fields: [statistics.userid],
    references: [user.userid],
    relationName: "user",
  }),
}));

export type NewUser = typeof user.$inferInsert;

export default user;
