# Overview

This is a full-stack web application for a modern design agency called "Web Architects" inspired by igloo.inc's award-winning aesthetic. The application features large immersive sections, minimal text overlays, smooth scroll interactions, and spacious modern layouts. Built as a single-page application (SPA), it showcases three core services through elegant design and subtle animations. The architecture follows a monorepo structure with a React frontend and Express.js backend, emphasizing visual impact over content density.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form schemas
- **Animations**: GSAP (GreenSock Animation Platform) with ScrollTrigger for scroll-based animations

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for contact form submission and data retrieval
- **Development Setup**: Custom Vite integration for hot module replacement in development
- **Error Handling**: Centralized error handling middleware with structured error responses

## Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema generation
- **Development Storage**: In-memory storage implementation for local development
- **Connection**: Neon Database serverless PostgreSQL for production

## Component Architecture
- **Design System**: Minimal dark theme with teal (#418994) and cream (#FADFCA) accent colors
- **Component Structure**: Large immersive sections with spacious layouts inspired by igloo.inc
- **Layout**: Four main sections (Hero, Experience, Approach, Contact) with smooth scroll navigation
- **Typography**: Ultra-light fonts (100-300 weight) with generous spacing and elegant proportions
- **Visual Hierarchy**: Large hero typography (text-9xl), minimal UI elements, and subtle accent lines

## Animation System
- **Primary Library**: GSAP with ScrollTrigger and ScrollToPlugin for igloo.inc-style interactions
- **Scroll Animations**: Parallax image movement, subtle element reveals, and smooth scrolling navigation
- **Custom Hooks**: useGSAP with enhanced animation helpers (revealUp, staggerReveal, parallaxImage)
- **Animation Types**: Power4.out easing for smooth organic motion, staggered reveals, and floating elements
- **Performance**: Minimal DOM manipulation with transforms and opacity for smooth 60fps animations

## Form Handling & Validation
- **Contact Form**: React Hook Form with Zod schema validation
- **Validation Rules**: Email validation, minimum length requirements, and required field validation
- **User Feedback**: Toast notifications for form submission success/error states
- **Data Flow**: Form data validation on client-side before API submission

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting service
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI & Design
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library with consistent design patterns
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

## Animation & Interaction
- **GSAP**: Professional animation library for smooth transitions
- **ScrollTrigger**: GSAP plugin for scroll-based animations
- **Embla Carousel**: Touch-friendly carousel component library

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **React Query**: Server state management and data fetching
- **React Hook Form**: Form state management and validation
- **Wouter**: Minimalist routing library for React

## Hosting & Deployment
- **Replit**: Development and hosting platform integration
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **ESBuild**: Fast JavaScript bundler for production builds