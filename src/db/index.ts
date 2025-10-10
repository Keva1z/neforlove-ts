import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "@/env";

import * as schema from "./schema/index";

export const connection = postgres(env.DATABASE_URL, {
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
});

export const db = drizzle(connection, { logger: true, schema });

export type db = typeof db;

export default db;
