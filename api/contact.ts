import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertContactSchema } from '../shared/schema';

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
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to submit contact form" 
    });
  }
}