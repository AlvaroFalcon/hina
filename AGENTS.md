# AGENTS.md

## Project Overview

Hina is a simple, minimalist web platform for learning Hiragana and Katakana (Japanese syllabaries). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Setup Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Run linter: `pnpm lint`
- Format code: `pnpm format` (when Prettier is configured)
- Run tests: `pnpm test` (when testing is configured)

## Architecture

### Feature-Based Structure

This project uses a **feature-based architecture**. Organize code by features/modules rather than by file type:

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── modules/
│   │   ├── [id]/
│   │   └── page.tsx
│   └── progress/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types.ts
│   ├── modules/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types.ts
│   ├── quizzes/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types.ts
│   └── progress/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── types.ts
├── components/
│   └── ui/          # shadcn/ui components
├── lib/
│   └── utils.ts     # Shared utilities
└── types/
    └── index.ts     # Global types
```

**Guidelines:**

- Each feature is self-contained with its own components, hooks, and utilities
- Shared UI components go in `components/ui/` (shadcn/ui)
- Shared utilities go in `lib/`
- Use Next.js App Router conventions (route groups, layouts, etc.)

## Code Style

- **TypeScript**: Strict mode enabled
- **Quotes**: Double quotes preferred
- **Semicolons**: Use semicolons
- **Functional patterns**: Prefer functional components and hooks
- **Naming**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Files: kebab-case for utilities (`format-date.ts`)
  - Hooks: camelCase with `use` prefix (`useAuth.ts`)
- **JSDoc**: Every method/function must have JSDoc documentation

## JSDoc Documentation

- **Required**: Every method and function must have JSDoc documentation
- Include parameter descriptions, return types, and examples when helpful
- Use `@param` for parameters, `@returns` for return values, `@throws` for errors
- Example:
  ```typescript
  /**
   * Calculates the progress percentage for a user module.
   * @param completed - Number of completed characters
   * @param total - Total number of characters in the module
   * @returns The progress percentage (0-100)
   */
  function calculateProgress(completed: number, total: number): number {
    return Math.round((completed / total) * 100);
  }
  ```

## Prettier

- Use Prettier for code formatting
- Configuration should be in `.prettierrc` or `package.json`
- Format on save recommended
- **Do NOT run Prettier automatically after changes** - only run `pnpm format` when explicitly requested by the user
- Run `pnpm format` before committing (user's responsibility)

## Linter

- ESLint is configured with Next.js presets
- **Do NOT run ESLint automatically after changes** - only run `pnpm lint` when explicitly requested by the user
- Run `pnpm lint` before committing (user's responsibility)
- Fix auto-fixable issues: `pnpm lint --fix`
- TypeScript strict mode is enabled - fix all type errors

## shadcn/ui Components

- Use shadcn/ui for UI components
- Components are located in `components/ui/`
- To add a new component: `pnpm dlx shadcn@latest add [component-name]`
- Customize components in `components/ui/` as needed
- Follow shadcn/ui patterns and conventions

## Testing

- **Test Structure**: All tests are located in a `tests/` folder at the root, mirroring the source code structure
- Test files use the same naming: `*.test.ts` or `*.test.tsx`
- Example structure:
  ```
  tests/
  ├── app/
  │   └── page.test.tsx
  ├── features/
  │   ├── auth/
  │   │   ├── hooks/
  │   │   │   └── useAuth.test.ts
  │   │   └── lib/
  │   │       └── utils.test.ts
  │   └── modules/
  │       └── components/
  │           └── ModuleCard.test.tsx
  ├── components/
  │   └── ui/
  │       └── button.test.tsx
  └── lib/
      └── utils.test.ts
  ```
- Use Vitest or Jest (prefer Vitest for Next.js projects)
- Test coverage should be maintained
- **Do NOT run tests automatically after changes** - only run `pnpm test` when explicitly requested by the user
- Run `pnpm test` before committing (user's responsibility)
- This structure makes it easy to locate tests quickly by mirroring the source code organization

## Database & Backend

- **Supabase** for authentication and database
- Tables:
  - `characters` (character, reading, type, order)
  - `modules` (id, name, character_list)
  - `user_progress` (user_id, module_id, percentage)
- Use Supabase client for all database operations
- Environment variables in `.env.local`

## Development Guidelines

- **Mobile-first**: Design for mobile, enhance for desktop
- **Minimalist design**: Keep UI clean and focused
- **Progressive enhancement**: Features unlock sequentially
- **Error handling**: Always handle errors gracefully
- **Loading states**: Show loading indicators for async operations
- **Accessibility**: Follow WCAG guidelines

## Commit Guidelines

- Use conventional commits format
- Run `pnpm lint` and `pnpm test` before committing (user's responsibility)
- Format code with Prettier before committing (user's responsibility)
- Keep commits focused and atomic

## File Organization

- Keep feature code within feature folders
- Shared code in `lib/` or `components/ui/`
- Types should be co-located with features or in `types/` if global
- Avoid deep nesting (max 3-4 levels)

## Important Notes

- This is an MVP - keep features simple and focused
- No audio, stroke writing, gamification, or dark mode in MVP
- Authentication: Email/password + Google OAuth via Supabase
- Modules unlock sequentially based on user progress
- Quizzes use adaptive repetition based on errors
