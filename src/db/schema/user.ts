import { pgTable,
    bigint,
    serial,
    varchar,
    boolean
} from "drizzle-orm/pg-core"; 

import { sexEnum, roleEnum } from "./enums"

const user = pgTable("users", {
    id: serial("id").primaryKey(),
    userid: bigint("userid", {mode: "number"}).notNull().unique(),

    sex: sexEnum().default("Unknown").notNull(),
    role: roleEnum().default("User").notNull(),

    verified: boolean().default(false).notNull(),

    banned: boolean().default(false).notNull(),
    banMessage: varchar("ban_message",{length: 128})
});

// TODO: Create other schemas for user
// Sub-Tables: Settings, Statistics, Referral, Subscription, Verification

// Settings fields:
// userid BIGINT
// searchID INT
// searchSex sexEnum
// ageFrom INT
// ageTo INT
// city STR
// distance INT
// by_distance BOOLEAN

// Statistics fields:
// userid BIGINT
// likesIn INT
// likesOut INT
// dislikesIn INT
// dislikesOut INT
// videonotes INT
// forms INT

// Referral fields:
// userid BIGINT
// code VARCHAR(32)
// inviter BIGINT - IDK how to name guy that send you invite link
// verified INT
// total INT

// Verification fields:
// userid BIGINT
// verified_at TIMESTAMP (with moscow timezone)
// videonote VARCHAR(256)
// phrase VARCHAR(32)
// verified_by BIGINT - Moderator that verified

// Subscription fields:
// userid BIGINT
// status subscriptionEnum
// end TIMESTAMP (with moscow timezone)

export default user
