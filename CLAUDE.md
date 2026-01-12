# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hina is a minimalist web platform for learning Hiragana and Katakana (Japanese syllabaries). Built with Next.js 16, React 19, TypeScript (strict mode), and Tailwind CSS v4. The project emphasizes sequential learning with adaptive quizzes and progress tracking.

## Common Commands

### Development
- `pnpm dev` - Start development server at http://localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (do not run automatically)
- `pnpm lint:fix` - Fix auto-fixable ESLint issues
- `pnpm format` - Format code with Prettier (do not run automatically)
- `pnpm format:check` - Check formatting without changes

### Database (Prisma)
- `pnpm db:generate` - Generate Prisma Client from schema
- `pnpm db:push` - Push schema changes to database (no migration)
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:seed` - Seed database with initial data

### Adding shadcn/ui Components
- `pnpm dlx shadcn@latest add [component-name]` - Install new shadcn/ui component

## Architecture

### Feature-Based Structure

Code is organized by features rather than file types. Each feature is self-contained:

```
features/
├── auth/              # Authentication (Supabase)
│   ├── components/    # LoginForm, RegisterForm
│   ├── hooks/         # useAuth
│   ├── lib/           # auth.ts, get-user.ts
│   └── types.ts
├── modules/           # Learning modules
├── quizzes/           # Adaptive quizzes
└── progress/          # Progress tracking
```

### Database Architecture (Prisma + Supabase)

**Dual Backend System:**
- **Supabase**: Authentication and user sessions (via `@supabase/ssr`)
- **Prisma**: Database ORM for application data (PostgreSQL via Supabase)

**Schema Models:**
- `Character` - Japanese characters (character, reading, type, order)
- `Module` - Learning modules (name, order)
- `ModuleCharacter` - Join table linking modules to characters
- `UserProgress` - User progress per module (userId, moduleId, percentage)

**Important:** User authentication is handled by Supabase Auth, but user progress data is stored in Prisma tables using the Supabase user ID.

### Supabase Client Patterns

Three separate client creation patterns based on context:

1. **Client Components** (`lib/supabase/client.ts`):
   ```typescript
   import { createClient } from "@/lib/supabase/client";
   const supabase = createClient(); // Browser client
   ```

2. **Server Components/Actions** (`lib/supabase/server.ts`):
   ```typescript
   import { createClient } from "@/lib/supabase/server";
   const supabase = await createClient(); // Note: async
   ```

3. **Middleware** (`lib/supabase/middleware.ts`):
   ```typescript
   import { createClient } from "@/lib/supabase/middleware";
   const { supabase, supabaseResponse } = createClient(request);
   ```

### Prisma Singleton Pattern

The Prisma client is a singleton (`lib/prisma.ts`) that prevents connection pool exhaustion during hot reloading:

```typescript
import { prisma } from "@/lib/prisma";
// Use prisma directly - it's already instantiated
```

### Path Aliases

TypeScript paths configured with `@/*` pointing to root:
- `@/components` - React components
- `@/features` - Feature modules
- `@/lib` - Shared utilities
- `@/app` - Next.js pages and routes

## Code Style Requirements

- **TypeScript**: Strict mode enabled - all type errors must be resolved
- **JSDoc**: Every function and method MUST have JSDoc documentation with `@param`, `@returns`, and `@throws` tags
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Functional patterns**: Prefer functional components and hooks
- **Naming conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Utilities: kebab-case (`format-date.ts`)
  - Hooks: camelCase with `use` prefix (`useAuth.ts`)

## Environment Variables

Required environment variables in `.env.local`:

```env
DATABASE_URL="postgresql://..." # Prisma database connection
DIRECT_URL="postgresql://..."   # For migrations (without pooling)
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

See `.env.local.example` for the template.

## Development Guidelines

### Do NOT Run Automatically
- ESLint (`pnpm lint`)
- Prettier (`pnpm format`)
- Tests (`pnpm test`)

These are the user's responsibility before committing.

### Mobile-First Design
- Design for mobile screens first
- Progressive enhancement for desktop
- Minimalist, distraction-free UI

### Sequential Learning Flow
- Modules unlock based on user progress
- Quizzes adapt based on user mistakes
- Progress percentage tracked per module

## MVP Scope Constraints

**Included:**
- Email/password + Google OAuth authentication
- Sequential module unlocking
- Adaptive quizzes
- Progress tracking

**Excluded from MVP:**
- Audio pronunciation
- Stroke writing practice
- Gamification features
- Dark mode toggle (UI ready but not implemented)
- Mobile native app
- Notifications

## shadcn/ui Integration

- Components installed in `components/ui/`
- Uses "new-york" style with neutral base color
- CSS variables enabled
- RSC (React Server Components) mode enabled
- Tailwind v4 with `@tailwindcss/postcss`

## Testing Structure

Tests live in `/tests` at root, mirroring source structure:

```
tests/
├── features/
│   └── auth/
│       └── hooks/
│           └── useAuth.test.ts
└── lib/
    └── utils.test.ts
```
