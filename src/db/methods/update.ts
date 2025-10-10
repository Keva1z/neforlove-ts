import db from "@/db";
import { default as User, NewUser, searchSettings, statistics, referral, verification } from "@/db/schema/user";
import { eq, sql } from "drizzle-orm";
import { createTimestamp } from "@/utils/datetime";

export async function updateVideonote(userid: number, videonote: typeof verification.$inferSelect.videonote) {
  await db.update(verification).set({ videonote }).where(eq(verification.userid, userid));
}

export async function updateInactive(userid: number, inactive: typeof User.$inferSelect.inactive) {
  await db.update(User).set({ inactive }).where(eq(User.userid, userid));
}

/**
 * if verifiedById is True -> set timestamp & update User.verified
 */
export async function updateVerifiedBy(
  userid: number,
  gender: typeof User.$inferSelect.sex,
  verifiedById: typeof verification.$inferSelect.verifiedById,
) {
  await db
    .update(verification)
    .set({ verifiedById, verifiedAt: verifiedById ? createTimestamp() : null })
    .where(eq(verification.userid, userid));
  await db.update(User).set({ sex: gender, verified: verifiedById ? true : false });
}
