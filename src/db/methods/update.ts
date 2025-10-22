import db from "@/db";
import { default as User, NewUser, searchSettings, statistics, referral, verification } from "@/db/schema/user";
import { eq, sql } from "drizzle-orm";
import { createTimestamp } from "@/utils/datetime";
import { Form } from "../schema";

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

export async function updateFormStatus(
  userid: number,
  status: boolean,
  verifiedById: typeof Form.$inferSelect.verifiedById,
) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(Form)
        .set({
          status,
          verifiedById: status ? verifiedById : null,
          verifiedAt: status ? createTimestamp() : null,
        })
        .where(eq(Form.userid, userid));
    });
  } catch (error) {
    console.error("Ошибка при обновлении анкеты:", error);
  }
}

export async function updateSearchAge(userid: number, from: number, to: number) {
  try {
    await db.update(searchSettings).set({ ageFrom: from, ageTo: to }).where(eq(searchSettings.userid, userid));
  } catch (error) {
    console.error("Ошибка при обновлении возраста:", error);
  }
}
