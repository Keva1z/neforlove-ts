import db from "@/db"
import { eq, sql } from "drizzle-orm"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"

const getuserbyuserid = await db.select({user: User, verification: verification}).from(User)
                                        .where(eq(User.userid, sql.placeholder("userid")))
                                        .leftJoin(verification, eq(User.userid, sql.placeholder("userid")))
                                        .limit(1)
                                        .prepare("getUserByUserId")

export async function getUserByUserId(userid: number) {
    return (await getuserbyuserid.execute({userid}))[0]
}
