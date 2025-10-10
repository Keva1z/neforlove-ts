import db from "@/db";
import { default as User, NewUser, searchSettings, statistics, referral, verification } from "@/db/schema/user";
import { generateReferralCode } from "@/utils/generate";
import { eq } from "drizzle-orm";
import { Form, Location } from "../schema";

export async function createUser(data: NewUser, phrase: string) {
  try {
    await db.transaction(async (tx) => {
      let [user] = await tx.insert(User).values(data).onConflictDoNothing().returning();

      // If user exists, just update phrase.
      if (!user) {
        await tx.update(verification).set({ phrase }).where(eq(verification.userid, data.userid));
        console.log(`Пользователю ${data.userid} установлена фраза ${phrase}`);
        return;
      }

      await tx.insert(searchSettings).values({ userid: user.userid }).onConflictDoNothing();
      await tx.insert(statistics).values({ userid: user.userid }).onConflictDoNothing();
      await tx.insert(verification).values({ userid: user.userid, phrase }).onConflictDoNothing();

      // Generate unique code
      const codes = (await tx.select({ code: referral.code }).from(referral)).map((item) => item.code);
      let code = generateReferralCode();
      while (code in codes) {
        code = generateReferralCode();
      }

      await tx.insert(referral).values({ userid: user.userid, code }).onConflictDoNothing();

      console.log(`Пользователь ${user.userid} создан успешно.`);
    });
  } catch (error) {
    console.error("Ошибка при создании пользователя и связанных записей:", error);
  }
}

export async function createForm(
  formData: typeof Form.$inferInsert,
  locationData: typeof Location.$inferInsert,
): Promise<boolean> {
  try {
    await db.transaction(async (tx) => {
      let [location] = await tx.insert(Location).values(locationData).onConflictDoNothing().returning();

      if (!location) return false;
      formData.locationId = location.id;

      let [form] = await tx.insert(Form).values(formData).onConflictDoNothing().returning();

      if (!form) {
        console.log(`Анкета пользователя ${formData.userid} не была создана.`);
        return false;
      }
    });
    return true;
  } catch (error) {
    console.error("Ошибка при создании анкеты:", error);
    return false;
  }
}
