import { pgTable,
    bigint,
    serial,
    varchar,
    timestamp,
    boolean,
    integer,
    geometry,
} from "drizzle-orm/pg-core"; 
import { relations, sql } from "drizzle-orm";

import { sexEnum } from "./enums"
import user from "./user";

const Form = pgTable("Forms", {
    id: serial().primaryKey(),
    userid: bigint({mode: "number"})
            .notNull()
            .unique()
            .references(() => user.userid),

    name: varchar({length: 64}).notNull(),
    age: integer().notNull(),
    sex: sexEnum().default("Male").notNull(),
    about: varchar({length: 1024}).notNull(),
    media: varchar({ length: 2048 })
            .array()
            .notNull()
            .default(sql`ARRAY[]::varchar[]`),

    locationId: integer()
                 .notNull()
                 .references(() => Location.id),

    // Form meta
    searchId: integer().notNull().unique(),
    status: boolean().default(false).notNull(),
    verifiedAt: timestamp({mode: "string", withTimezone: true}),
    
    // Inactive
    inactive: boolean().default(false).notNull(),
});

const Location = pgTable("locations", {
    id: serial().primaryKey(),
    userid: bigint({mode: "number"})
            .notNull()
            .references(() => user.userid),
    createdAt: timestamp({mode: "string", withTimezone: true}),
    location: geometry({type: "point", mode: "xy", srid: 4326}).notNull()
})

export const formRelations = relations(Form, ({ one }) => ({
    user: one(user, {
        fields: [Form.userid],
        references: [user.userid],
        relationName: "user"
    }),
    location: one(Location, {
        fields: [Form.locationId],
        references: [Location.id],
        relationName: "location_ref"
    })
})) 

export const locationRelations = relations(Location, ({ one }) => ({
    user: one(user, {
        fields: [Location.userid],
        references: [user.userid],
        relationName: "user"
    }),
    form: one(Form, {
        fields: [Location.id],
        references: [Form.locationId],
        relationName: "form"
    })
}))

export {Form, Location}
