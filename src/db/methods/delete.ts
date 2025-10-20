import db from "@/db";
import { default as User, searchSettings, statistics, referral, verification } from "@/db/schema/user";
import { Form, Location } from "../schema";
import { eq } from "drizzle-orm";

export async function deleteFormByUserId(userid: number) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(Form).where(eq(Form.userid, userid));
      await tx.delete(Location).where(eq(Location.userid, userid));

      console.log(`Анкета пользователя ${userid} удалена успешно.`);
    });
  } catch (error) {
    console.error("Ошибка при удалении анкеты пользователя:", error);
  }
  await db.delete(Form).where(eq(Form.userid, userid));
}
