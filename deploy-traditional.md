# Traditional Hosting Deployment Guide

## For VPS or Shared Hosting (cPanel, etc.)

### Step 1: Build the Application
```bash
npm run build
```

### Step 2: Upload Files
Upload these folders to your hosting:
- `dist/public/` → Upload to your domain's public_html or www folder
- `server/` → Upload to a Node.js app folder (if supported)
- `package.json` → For server dependencies

### Step 3: Configure Server
If your host supports Node.js:
1. Install dependencies: `npm install --production`
2. Start server: `npm start`
3. Point domain to the server port

### Step 4: Static Only Option (No Contact Form)
If only static hosting is available:
1. Upload only the `dist/public/` contents
2. Contact form won't work (needs server)
3. Remove contact form or use external service (Formspree, Netlify Forms)

### Step 5: Database Setup
For contact forms, you'll need:
- PostgreSQL database (if available)
- Update DATABASE_URL environment variable
- Or switch to file-based storage

## DNS Configuration
Point your domain to your hosting provider:
- A Record: @ → Your server IP
- CNAME: www → Your hosting domain

## SSL Certificate
- Most hosts provide free Let's Encrypt SSL
- Enable HTTPS in your hosting control panel