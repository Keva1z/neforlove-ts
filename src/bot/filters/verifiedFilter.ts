import { getVerifiedByUserId } from "@/db/methods/get"
import {default as User} from "@/db/schema/user"

export async function isVerified(userId: number) {
    const verified = await getVerifiedByUserId(userId)
    return verified !== undefined && verified;
}
