#!/usr/bin/env node

/**
 * Script to view contacts directly from the database
 * Usage: node scripts/view-contacts.js
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Define the contacts table schema
const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

async function viewContacts() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Run: DATABASE_URL="your_connection_string" node scripts/view-contacts.js');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to database...');
    
    // Create database connection
    const client = postgres(connectionString, {
      prepare: false,
      max: 1,
    });
    
    const db = drizzle(client);
    
    // Fetch all contacts
    const allContacts = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    
    console.log('✅ Successfully connected to database!\n');
    console.log('=====================================');
    console.log('         CONTACT MESSAGES            ');
    console.log('=====================================\n');
    
    if (allContacts.length === 0) {
      console.log('No contact messages found.');
    } else {
      allContacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`   Project Type: ${contact.projectType}`);
        console.log(`   Date: ${contact.createdAt.toLocaleString()}`);
        console.log(`   Message: ${contact.message}`);
        console.log('   ' + '-'.repeat(50));
      });
      
      console.log(`\nTotal: ${allContacts.length} contact message(s)`);
    }
    
    // Close the connection
    await client.end();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

viewContacts();