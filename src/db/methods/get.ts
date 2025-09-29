import db from "@/db"
import { eq, sql } from "drizzle-orm"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"

const getrolebyuserid = db.query.user.findFirst({
    columns: {role: true},
    where: eq(User.userid, sql.placeholder("userid"))
}).prepare("getRoleByUserId")

const getuserbyuserid = db.query.user.findFirst({
        where: eq(User.userid, sql.placeholder("userid")),
        with: {verification: true}
    }).prepare("getUserByUserId")

export async function getUserByUserId(userid: number) {
    const result = await getuserbyuserid.execute({userid})
    return result ? result : undefined
}

export async function getRoleByUserId(userid: number) {
    const result = await getrolebyuserid.execute({userid})
    return result ? result.role : undefined
}
