import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure postgres client for serverless with connection limits
const client = postgres(connectionString, {
  prepare: false, // Disable prepared statements for serverless
  max: 1, // Limit connections for serverless
});

export const db = drizzle(client);