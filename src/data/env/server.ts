import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    // Prefer a direct DATABASE_URL (e.g., Neon connection string)
    DATABASE_URL: z.string().url().optional(),

    // Fallback pieces for composing a local/database URL if DATABASE_URL isn't provided
    DB_PASSWORD: z.string().min(1).optional(),
    DB_HOST: z.string().min(1).optional(),
    DB_PORT: z.string().min(1).optional(),
    DB_USER: z.string().min(1).optional(),
    DB_NAME: z.string().min(1).optional(),

    ARCJET_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    HUME_API_KEY: z.string().min(1),
    HUME_SECRET_KEY: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
  },
  createFinalSchema: (env) => {
    return z.object(env).transform((val) => {
      const {
        DATABASE_URL,
        DB_HOST,
        DB_NAME,
        DB_PASSWORD,
        DB_PORT,
        DB_USER,
        ...rest
      } = val;

      // Use provided DATABASE_URL if present (e.g., Neon)
      if (DATABASE_URL && DATABASE_URL.length > 0) {
        return {
          ...rest,
          DATABASE_URL,
        };
      }

      // Otherwise, attempt to build from individual DB_* pieces
      if (DB_HOST && DB_NAME && DB_PASSWORD && DB_PORT && DB_USER) {
        return {
          ...rest,
          DATABASE_URL: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        };
      }

      // Neither DATABASE_URL nor all DB_* provided
      throw new Error(
        "DATABASE_URL is not set and DB_* variables are incomplete. Please set `DATABASE_URL` (e.g., your Neon connection string) or provide all DB_* variables."
      );
    });
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
