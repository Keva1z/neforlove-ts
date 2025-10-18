import db from "@/db";
import { eq, sql } from "drizzle-orm";
import { default as User, NewUser, searchSettings, statistics, referral, verification } from "@/db/schema/user";

export async function getUserByUserId(userid: number) {
  const result = await db.query.user
    .findFirst({
      where: eq(User.userid, userid),
      with: { verification: true, form: true },
    })
    .catch(() => {
      return undefined;
    });

  return result;
}

export async function getStatisticsByUserId(userid: number) {
  const result = await db.query.statistics
    .findFirst({
      where: eq(User.userid, userid),
    })
    .catch(() => {
      return undefined;
    });

  return result;
}

export async function getRoleByUserId(userid: number) {
  const result = await db.query.user
    .findFirst({
      columns: { role: true },
      where: eq(User.userid, userid),
    })
    .catch(() => {
      return undefined;
    });
  return result?.role;
}

export async function getVerifiedByUserId(userid: number) {
  const result = await db.query.user
    .findFirst({
      columns: { verified: true },
      where: eq(User.userid, userid),
    })
    .catch(() => {
      return undefined;
    });
  return result?.verified;
}

export async function getSubscriptionByUserId(userid: number) {
  const result = await db.query.user
    .findFirst({
      columns: { subscription: true },
      where: eq(User.userid, userid),
    })
    .catch(() => {
      return undefined;
    });
  return result?.subscription;
}
