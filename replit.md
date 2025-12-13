# GG Command Center

## Overview

GG Command Center is a gaming cafe management software interface built as a full-stack web application. It provides administrators with tools to manage gaming terminals, member accounts, game libraries, store inventory, and generate reports. The application also includes a client-side launcher interface for end-users at gaming stations.

The project follows a modern React + Express architecture with PostgreSQL for data persistence, designed specifically for the Replit deployment environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend lives in `client/src/` with a clear separation:
- `pages/` - Route-level components (Dashboard, Terminals, Members, Games, Store, Reports, Settings, Launcher, Login)
- `components/` - Reusable UI components organized by feature (dialogs, dashboard, layout, ui)
- `hooks/` - Custom React hooks
- `lib/` - Utilities and query client configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API at `/api/*` endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

The backend structure:
- `server/index.ts` - Express app setup with middleware
- `server/routes.ts` - API route definitions for all CRUD operations
- `server/storage.ts` - Database abstraction layer with Drizzle queries
- `server/static.ts` - Production static file serving
- `server/vite.ts` - Development Vite middleware integration

### Data Models
Defined in `shared/schema.ts` with Drizzle ORM:
- **Users** - Admin authentication
- **Members** - Gaming cafe members with tiers, balance, and points
- **Terminals** - Physical gaming stations with status tracking
- **Games** - Game library catalog
- **StoreItems** - Point-of-sale inventory
- **Sessions** - User gaming sessions
- **ActivityLogs** - System event logging

### Build System
- Development: Vite dev server with HMR proxied through Express
- Production: Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client

## External Dependencies

### Database
- **PostgreSQL** - Primary data store accessed via `DATABASE_URL` environment variable
- **Drizzle Kit** - Database migrations stored in `migrations/` directory
- Uses `drizzle-kit push` for schema synchronization

### Third-Party Services
- **Replit-specific plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` - Error overlay
  - `@replit/vite-plugin-cartographer` - Development tooling
  - `@replit/vite-plugin-dev-banner` - Development mode indicator
- Custom `vite-plugin-meta-images` for OpenGraph image handling

### Key NPM Packages
- **UI**: Full Radix UI primitive suite, Lucide React icons, Recharts for data visualization
- **Forms**: React Hook Form with Zod resolver
- **Utilities**: date-fns, clsx, class-variance-authority, tailwind-merge
- **Animation**: Framer Motion, embla-carousel-react

### Session Management
- `connect-pg-simple` available for PostgreSQL-backed sessions
- `express-session` for session middleware

### Fonts
- Oxanium (display font)
- Rajdhani (body font)  
- Inter (sans-serif fallback)
- Loaded via Google Fonts CDN