import express from 'express';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';
import path from 'path';

const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize routes first
const server = await registerRoutes(app);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve built frontend files
  const publicPath = path.resolve(process.cwd(), 'dist', 'public');
  app.use(express.static(publicPath));
  
  // Fallback to index.html for client-side routing
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API route not found' });
    } else {
      res.sendFile(path.resolve(publicPath, 'index.html'));
    }
  });
} else {
  serveStatic(app);
}

export default app;