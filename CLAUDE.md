# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle (frontend + backend)
- `npm start` - Run production server
- `npm run check` - Type check all TypeScript files
- `npm run db:push` - Push database schema changes to PostgreSQL

## Project Architecture

This is a full-stack TypeScript application built as a modern design agency website. The project uses a monorepo structure with shared TypeScript types and schema validation.

### Frontend Stack
- **React 18** with TypeScript and Vite build tool
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom CSS variables for theming
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **GSAP** with ScrollTrigger for scroll-based animations

### Backend Stack
- **Express.js** with TypeScript and ES modules
- **Drizzle ORM** with PostgreSQL
- **Zod** for runtime validation
- Custom Vite integration for development HMR

### Project Structure
```
client/               # React frontend
  src/
    components/       # UI components organized by type
      sections/       # Main page sections (hero, about, contact, etc.)
      navigation/     # Header and footer components
      ui/            # shadcn/ui components
      effects/       # Custom animation components
    hooks/           # Custom React hooks (useGSAP, useMobile)
    lib/            # Utilities and configuration
    pages/          # Route components
server/             # Express.js backend
  index.ts          # Server entry point
  routes.ts         # API route definitions
  storage.ts        # Database abstraction layer
  vite.ts          # Development server integration
shared/             # Shared types and schemas
  schema.ts         # Drizzle database schema and Zod validation
```

### Key Design Patterns

**Animation System**: Uses GSAP with custom animation helpers (`revealUp`, `staggerReveal`, `parallaxImage`, `fadeInOnScroll`) for smooth scroll-based animations. All animations use `power4.out` easing for organic motion.

**Form Handling**: Contact forms use React Hook Form with Zod schema validation from `shared/schema.ts`. The backend validates the same schemas for type safety.

**Database Layer**: Drizzle ORM provides type-safe database operations with shared TypeScript types. Development uses in-memory storage, production uses PostgreSQL via Neon Database.

**Component Architecture**: Large immersive sections with minimal text overlays, following a dark theme with teal (#418994) and cream (#FADFCA) accents. Uses ultra-light typography (100-300 font weight) with generous spacing.

### Path Aliases
- `@/` - Points to `client/src/`
- `@shared` - Points to `shared/` directory
- `@assets` - Points to `attached_assets/` directory

### Environment Setup
- `DATABASE_URL` - PostgreSQL connection string (required for production)
- `NODE_ENV` - Controls development vs production behavior
- `PORT` - Server port (defaults to 5000)

### Development Notes
- Server runs on single port serving both API and static files
- Development mode enables Vite HMR and Replit integration
- Custom GSAP hooks require cleanup on component unmount
- All API routes are prefixed with `/api/`