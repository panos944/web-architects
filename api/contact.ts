import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Define schema directly in API route to avoid import issues
const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  projectType: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Create database connection for this API route
let db: any = null;

function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    
    if (connectionString) {
      const client = postgres(connectionString, {
        prepare: false,
        max: 1,
      });
      db = drizzle(client);
    }
  }
  return db;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.error.errors.map((e: any) => e.message).join(", ")
      });
    }
    
    // Try database first, fallback to memory storage
    const database = getDb();
    let contact;
    
    if (database) {
      // Use database
      const dbResult = await database.insert(contacts).values(result.data).returning();
      contact = dbResult[0];
    } else {
      // Fallback to in-memory (for development)
      contact = { 
        ...result.data, 
        id: crypto.randomUUID(),
        createdAt: new Date()
      };
    }
    
    // Log the contact message for email forwarding
    console.log("🚀 NEW CONTACT MESSAGE FOR wwwebarchitects@gmail.com");
    console.log("==========================================");
    console.log(`Name: ${result.data.name}`);
    console.log(`Email: ${result.data.email}`);
    console.log(`Project Type: ${result.data.projectType}`);
    console.log(`Message: ${result.data.message}`);
    console.log(`Date: ${new Date().toISOString()}`);
    console.log("==========================================");
    
    res.json({ success: true, contact });
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to submit contact form" 
    });
  }
}