# Hina

A simple, minimalist web platform for learning Hiragana and Katakana (Japanese syllabaries). Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🎯 Overview

Hina is designed to help beginners learn the Japanese syllabaries through a clean, focused experience. Users progress through small, sequential modules reinforced with adaptive quizzes.

### Key Features

- **Sequential Learning**: Progress through modules that unlock based on your progress
- **Adaptive Quizzes**: Test your knowledge with quizzes that adapt based on your mistakes
- **Progress Tracking**: Monitor your learning journey with detailed progress metrics
- **Minimalist Design**: Clean, distraction-free interface focused on learning
- **Mobile-First**: Responsive design that works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Theme**: Dark mode support with [next-themes](https://github.com/pacocoursey/next-themes)
- **Backend**: Supabase (authentication & database)
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 20 or higher
- pnpm 10.24.0 or higher

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AlvaroFalcon/hina.git
cd hina
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Run ESLint and automatically fix issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without making changes
- `pnpm test` - Run tests (when configured)

## 📁 Project Structure

```
hina/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── theme-provider.tsx # Theme provider for dark mode
│   └── theme-toggle.tsx   # Theme toggle component
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── modules/          # Learning modules feature
│   ├── quizzes/          # Quizzes feature
│   └── progress/         # Progress tracking feature
├── lib/                   # Shared utilities
│   └── utils.ts          # Utility functions (cn, etc.)
├── tests/                 # Test files (mirrors source structure)
├── .github/               # GitHub workflows
│   └── workflows/        # CI/CD workflows
└── public/                # Static assets
```

## 🏗️ Architecture

This project uses a **feature-based architecture**, organizing code by features/modules rather than by file type. Each feature is self-contained with its own components, hooks, and utilities.

### Database Schema (Supabase)

- `characters` - Japanese characters (character, reading, type, order)
- `modules` - Learning modules (id, name, character_list)
- `user_progress` - User progress tracking (user_id, module_id, percentage)

## 🎨 Code Style

- **TypeScript**: Strict mode enabled
- **Quotes**: Double quotes
- **Semicolons**: Required
- **JSDoc**: All methods and functions must have JSDoc documentation
- **Formatting**: Prettier with double quotes and semicolons
- **Linting**: ESLint with Next.js presets

## 🧪 Testing

Tests are located in a `tests/` folder at the root, mirroring the source code structure. Test files use the naming convention `*.test.ts` or `*.test.tsx`.

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm format` before committing
4. Ensure all tests pass
5. Create a pull request

### Commit Guidelines

- Use conventional commits format
- Run `pnpm lint` and `pnpm test` before committing
- Format code with Prettier before committing
- Keep commits focused and atomic

## 🔄 CI/CD

GitHub Actions automatically runs linting and build checks on pull requests (excluding draft PRs). The workflow:

- Runs on PR open, sync, reopen, and ready for review
- Skips draft PRs
- Executes `pnpm lint` and `pnpm build`

## 📝 Development Guidelines

- **Mobile-first**: Design for mobile, enhance for desktop
- **Minimalist design**: Keep UI clean and focused
- **Progressive enhancement**: Features unlock sequentially
- **Error handling**: Always handle errors gracefully
- **Loading states**: Show loading indicators for async operations
- **Accessibility**: Follow WCAG guidelines

## 🚧 MVP Scope

This is an MVP with the following scope:

### Included
- Authentication (Email/password + Google OAuth via Supabase)
- Learning modules with sequential unlocking
- Adaptive quizzes
- Progress tracking

### Excluded (for future versions)
- Audio pronunciation
- Stroke writing practice
- Gamification
- Dark mode toggle (UI ready, but not in MVP scope)
- Mobile native app
- Notifications

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is private.

## 👤 Author

**Álvaro Falcón Morales**

---

For more detailed development instructions, see [AGENTS.md](./AGENTS.md).
