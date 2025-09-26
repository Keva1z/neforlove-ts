import db from "@/db"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"
import { eq, sql } from "drizzle-orm"

import { DateTime } from 'luxon';

export async function updateVideonote(userid: number, videonote: typeof verification.$inferSelect.videonote) {
    await db.update(verification).set({videonote}).where(eq(verification.userid, userid))
}

export async function updateInactive(userid: number, inactive: typeof User.$inferSelect.inactive) {
    await db.update(User).set({inactive}).where(eq(User.userid, userid))
}

/**
 * if verified_by_id is True -> set timestamp & update User.verified
 */
export async function updateVerifiedBy(userid: number, gender: typeof User.$inferSelect.sex, verified_by_id: typeof verification.$inferSelect.verified_by_id) {
    const timestamp = DateTime.now().setZone("Europe/Moscow")
    await db.update(verification).set({verified_by_id, verified_at: verified_by_id ? timestamp.toSQL({includeOffset: true}) : null}).where(eq(verification.userid, userid))
    await db.update(User).set({sex: gender, verified: verified_by_id ? true : false})
}

