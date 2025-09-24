import db from "@/db"
import {default as User, NewUser, searchSettings, statistics, referral, verification} from "@/db/schema/user"
import { generateReferralCode } from "@/utils/generate"
import { eq } from "drizzle-orm"

const allCodes = await db.select({code: referral.code}).from(referral).prepare("all_codes")

export async function createUser(data: NewUser, phrase: string) {
    try {
        await db.transaction(async (tx) => {

            let [user] = await tx.insert(User).values(data).onConflictDoNothing().returning()

            // If user exists, just update phrase.
            if (!user) { 
                await tx.update(verification).set({phrase}).where(eq(verification.userid, data.userid))
                return;
            };
            
            await tx.insert(searchSettings).values({userid: user.userid}).onConflictDoNothing()
            await tx.insert(statistics).values({userid: user.userid}).onConflictDoNothing()
            await tx.insert(verification).values({userid: user.userid, phrase}).onConflictDoNothing()

            // Generate unique code
            const codes = (await allCodes.execute()).map(item => item.code)
            let code = generateReferralCode()
            while (code in codes) {
                code = generateReferralCode()
            }

            await tx.insert(referral).values({userid: user.userid, code}).onConflictDoNothing()

            console.log(`Пользователь ${user.userid} создан успешно.`)
        })
    } catch (error) {
        console.error("Ошибка при создании пользователя и связанных записей:", error);
    }
}
