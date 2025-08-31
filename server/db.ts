import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Configure postgres client for serverless with connection limits
    const client = postgres(connectionString, {
      prepare: false, // Disable prepared statements for serverless
      max: 1, // Limit connections for serverless
    });

    db = drizzle(client);
  }

  return db;
};