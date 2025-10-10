import { pgTable, bigint, serial, varchar, boolean, integer, geometry, real } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { sexEnum } from "./enums";
import user from "./user";
import { createTimestamp } from "@/utils/datetime";

const Form = pgTable("Forms", {
  id: serial().primaryKey(),
  userid: bigint({ mode: "number" })
    .notNull()
    .unique()
    .references(() => user.userid),

  name: varchar({ length: 64 }).notNull(),
  age: integer().notNull(),
  sex: sexEnum().default("Male").notNull(),
  about: varchar({ length: 1024 }).notNull(),
  media: varchar({ length: 2048 })
    .array()
    .notNull()
    .default(sql`ARRAY[]::varchar[]`),

  locationId: integer()
    .notNull()
    .references(() => Location.id),

  // Form meta
  searchId: integer().notNull(),
  status: boolean().default(false).notNull(),

  createdAt: varchar({ length: 128 }).default(createTimestamp()),
  verifiedAt: varchar({ length: 128 }),

  // Inactive
  inactive: boolean().default(false).notNull(),
});

const Location = pgTable("locations", {
  id: serial().primaryKey(),
  userid: bigint({ mode: "number" })
    .notNull()
    .references(() => user.userid),
  createdAt: varchar({ length: 128 }).default(createTimestamp()),

  country: varchar({ length: 128 }).notNull(),
  state: varchar({ length: 128 }).notNull(),
  city: varchar({ length: 128 }),
  latitude: real().notNull(),
  longitude: real().notNull(),

  location: geometry({ type: "point", mode: "xy", srid: 4326 }).notNull(),
});

export const formRelations = relations(Form, ({ one }) => ({
  user: one(user, {
    fields: [Form.userid],
    references: [user.userid],
    relationName: "user",
  }),
  location: one(Location, {
    fields: [Form.locationId],
    references: [Location.id],
    relationName: "location_ref",
  }),
}));

export const locationRelations = relations(Location, ({ one }) => ({
  user: one(user, {
    fields: [Location.userid],
    references: [user.userid],
    relationName: "user",
  }),
  form: one(Form, {
    fields: [Location.id],
    references: [Form.locationId],
    relationName: "form",
  }),
}));

export { Form, Location };
