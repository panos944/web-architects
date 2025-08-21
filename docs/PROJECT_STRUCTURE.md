# Project Structure

This document outlines the organized structure of the Web Architects project.

## Root Directory Organization

```
WebArchitectsHQ/
├── 📁 client/           # Frontend React application
├── 📁 server/           # Backend Express.js application  
├── 📁 shared/           # Shared TypeScript types and schemas
├── 📁 config/           # Configuration files
├── 📁 scripts/          # Build and utility scripts
├── 📁 docs/             # Documentation files
├── 📁 api/              # Vercel API routes
├── 📄 package.json      # Dependencies and scripts
├── 📄 README.md         # Main project documentation
├── 📄 LICENSE           # Project license
└── 📄 vercel.json       # Vercel deployment configuration
```

## Directory Descriptions

### `/client/`
Contains the React frontend application with Vite build system.

### `/server/` 
Contains the Express.js backend with TypeScript and ES modules.

### `/shared/`
Shared TypeScript types and Zod validation schemas used by both client and server.

### `/config/`
Configuration files that are not frequently modified:
- `components.json` - shadcn/ui configuration
- `drizzle.config.ts` - Database ORM configuration  
- `postcss.config.js` - PostCSS build configuration

### `/scripts/`
Build and deployment scripts:
- `build-static.js` - Static build script for traditional hosting

### `/docs/`
Project documentation:
- `deploy-traditional.md` - Traditional hosting deployment guide
- `PROJECT_STRUCTURE.md` - This file

### `/api/`
Vercel serverless API routes for production deployment.

## Key Configuration Files (Root)

- `package.json` - Main dependencies, scripts, and project metadata
- `tsconfig.json` - TypeScript compiler configuration
- `tailwind.config.ts` - Tailwind CSS configuration  
- `vite.config.ts` - Vite build tool configuration
- `vercel.json` - Vercel deployment settings