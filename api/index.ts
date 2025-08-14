import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { storage } from '../server/storage';
import { insertContactSchema } from '../shared/schema';

const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.error.errors.map((e: any) => e.message).join(", ")
      });
    }
    
    const contact = await storage.createContact(result.data);
    
    // Log the contact message for email forwarding
    console.log("🚀 NEW CONTACT MESSAGE FOR panos.hatzinikolaou@gmail.com");
    console.log("==========================================");
    console.log(`Name: ${result.data.name}`);
    console.log(`Email: ${result.data.email}`);
    console.log(`Project Type: ${result.data.projectType}`);
    console.log(`Message: ${result.data.message}`);
    console.log(`Date: ${new Date().toISOString()}`);
    console.log("==========================================");
    
    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to submit contact form" 
    });
  }
});

// Get all contacts (for admin purposes)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "Failed to fetch contacts" 
    });
  }
});

export default app;