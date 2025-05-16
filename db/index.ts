import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a Neon client
const sql = neon(process.env.DATABASE_URL);
// Initialize drizzle with the Neon client
export const db = drizzle(sql, { schema });