import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";


export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = validateData(insertContactSchema, req.body);
      const contact = await storage.createContact(validatedData);
      
      // Log the contact message for email forwarding
      console.log("🚀 NEW CONTACT MESSAGE FOR wwwebarchitects@gmail.com");
      console.log("==========================================");
      console.log(`Name: ${validatedData.name}`);
      console.log(`Email: ${validatedData.email}`);
      console.log(`Project Type: ${validatedData.projectType}`);
      console.log(`Message: ${validatedData.message}`);
      console.log(`Date: ${new Date().toISOString()}`);
      console.log("==========================================");
      
      res.json({ success: true, contact });
    } catch (error: any) {
      res.status(400).json({ 
        success: false, 
        message: error.message || "Failed to submit contact form" 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch contacts" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function validateData(schema: any, data: any) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map((e: any) => e.message).join(", "));
  }
  return result.data;
}
