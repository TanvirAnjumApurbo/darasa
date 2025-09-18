import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

// Ensure CLI picks up variables from .env when running drizzle-kit
loadEnv({ path: ".env" });

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
