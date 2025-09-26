import { getRoleByUserId } from "@/db/methods/get"
import {default as User} from "@/db/schema/user"

export async function isRole(userId: number, role: typeof User.$inferSelect.role[]) {
    const userRole = await getRoleByUserId(userId)
    return userRole !== undefined && role.includes(userRole);
}
