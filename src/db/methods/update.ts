import db from "@/db"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"
import { sql } from "drizzle-orm"

export async function updateVideonote(videonote: string) {
    await db.update(verification).set({videonote})
}
