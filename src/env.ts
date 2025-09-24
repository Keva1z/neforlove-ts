// import { config } from "dotenv";
// import { expand } from "dotenv-expand";

// expand(config({debug: false}))

// const token = process.env.BOT_TOKEN!
// const videonote_chat = Number(process.env.VIDEONOTE_CHAT!)

// const DB_MIGRATING = process.env.DB_MIGRATING ? process.env.DB_MIGRATING === "true" : false
// const DB_SEEDING = process.env.DB_SEEDING ? process.env.DB_SEEDING === "true" : false
// const DATABASE_URL = process.env.DATABASE_URL

// if (!token) {throw new Error("Token must be provided!")}
// if (!videonote_chat) {throw new Error("Videonote chat must be provided!")}
// if (DATABASE_URL) {throw new Error("Database url must be provided!")}

// export { token, videonote_chat, DB_MIGRATING, DB_SEEDING, DATABASE_URL}

import { config } from "dotenv";
import { expand } from "dotenv-expand";

import { ZodError, z } from "zod";

const stringBoolean = z.coerce.string().transform((val) => {
  return val === "true";
}).default(false);

const EnvSchema = z.object({
  TOKEN: z.string(),
  VIDEONOTE_CHAT: z.coerce.number(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    error.issues.forEach((issue) => {
      message += issue.path + "\n";
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
