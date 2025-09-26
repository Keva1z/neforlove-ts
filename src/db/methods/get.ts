import db from "@/db"
import { eq, sql } from "drizzle-orm"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"

const getuserbyuserid = await db.select({user: User, verification: verification}).from(User)
                                        .where(eq(User.userid, sql.placeholder("userid")))
                                        .fullJoin(verification, eq(User.userid, sql.placeholder("userid")))
                                        .limit(1)
                                        .prepare("getUserByUserId")

const getrolebyuserid = await db.select({role: User.role}).from(User)
                                        .where(eq(User.userid, sql.placeholder("userid")))
                                        .limit(1).prepare("getUserByUserId")

export async function getUserByUserId(userid: number) {
    const result = (await getuserbyuserid.execute({userid}))[0]
    return result ? result : undefined
}

export async function getRoleByUserId(userid: number) {
    const result = (await getrolebyuserid.execute({userid}))[0]
    return result ? result.role : undefined
}
