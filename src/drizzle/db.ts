import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";

// Reuse connections between invocations for better performance
neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
