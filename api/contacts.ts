import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check for API key in Authorization header
    const authHeader = req.headers.authorization;
    const apiKey = process.env.ADMIN_API_KEY;
    
    if (!apiKey) {
      return res.status(503).json({ 
        message: "Admin access not configured" 
      });
    }
    
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return res.status(401).json({ 
        message: "Unauthorized - Invalid API key" 
      });
    }
    
    const contacts = await storage.getContacts();
    res.json(contacts);
  } catch (error: any) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      message: error.message || "Failed to fetch contacts" 
    });
  }
}