import db from "@/db";
import { desc, eq, sql } from "drizzle-orm";
import { default as User, NewUser, searchSettings, statistics, referral, verification } from "@/db/schema/user";
import { Location } from "@/db/schema/form";

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

export async function getReferralByUserId(userid: number) {
  const result = await db.query.referral
    .findFirst({
      where: eq(referral.userid, userid),
      with: { referrer: true },
    })
    .catch(() => {
      return undefined;
    });

  return result;
}

export async function getReferralByCode(code: string) {
  const result = await db.query.referral
    .findFirst({
      where: eq(referral.code, code),
    })
    .catch(() => {
      return undefined;
    });

  return result;
}

export async function getUserSearchSettings(userid: number) {
  const result = await db.query.searchSettings
    .findFirst({
      where: eq(Location.userid, userid),
    })
    .catch(() => {
      return undefined;
    });
  return result;
}

export async function getUserLocations(userid: number) {
  const result = await db.query.Location.findMany({
    where: eq(Location.userid, userid),
    orderBy: desc(Location.id),
  }).catch(() => {
    return undefined;
  });
  return result;
}

export async function getUserInactive(userid: number) {
  const [result] = await db
    .select({ inactive: User.inactive })
    .from(User)
    .where(eq(User.userid, userid))
    .catch(() => {
      return [undefined];
    });

  return result ? result.inactive : result;
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
