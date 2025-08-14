# Web Architects

A modern, elegant design agency website showcasing exceptional digital craftsmanship through immersive animations, smooth video backgrounds, and sophisticated user interactions.

## Features

- **Immersive Hero Section** with animated code-to-scenery transformation and dust particles
- **Video Backgrounds** throughout sections for enhanced visual storytelling  
- **GSAP Animations** with smooth scroll-triggered reveals and parallax effects
- **Responsive Design** optimized for all devices
- **Interactive Contact Form** with real-time validation
- **Modern Tech Stack** built with React 18, TypeScript, and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS** with custom design system
- **GSAP** for advanced animations and scroll effects
- **shadcn/ui** components built on Radix primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend  
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Zod** for runtime validation
- **Custom Vite integration** for seamless development

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webarchitects.git
   cd webarchitects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with:
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Visit** `http://localhost:3000`

## Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Design Philosophy

Web Architects embodies the intersection of strategic thinking and creative vision. Every animation, transition, and interaction is crafted with purpose:

- **Ultra-light Typography** (100-300 font weight) for elegance
- **Deep Forest Green** (#263226) with **Vibrant Orange** (#FFA366) accents  
- **Generous White Space** for breathing room
- **Subtle Animations** that enhance rather than distract
- **Video-First Approach** for immersive storytelling

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── sections/   # Page sections
│   │   │   ├── navigation/ # Header & footer
│   │   │   └── ui/         # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   └── routes.ts          # API routes
├── shared/                 # Shared types & schemas
└── public/                # Static assets & videos
```

## Key Animations

- **Hero Animation**: Code terminal transforms into scenic landscape
- **Dust Particles**: 350+ animated particles in hero section
- **Scroll Reveals**: Staggered content reveals on scroll
- **Video Parallax**: Mouse-responsive video interactions
- **Hover Effects**: Subtle scale and overlay transitions