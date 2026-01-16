import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import type { User } from "@/features/auth/types";

/**
 * Props for the Navbar component.
 */
interface NavbarProps {
  /** Visual style variant - "fixed" for landing page, "default" for other pages */
  variant?: "default" | "fixed";
  /** Authenticated user, if any */
  user?: User | null;
  /** Custom content for the left side (replaces logo) */
  leftContent?: React.ReactNode;
  /** Additional content for the right side (before auth buttons) */
  rightSlot?: React.ReactNode;
}

/**
 * Reusable navigation bar component.
 * Adapts its appearance based on authentication state and variant.
 * @param props - Component props
 * @returns Navbar JSX element
 */
export function Navbar({
  variant = "default",
  user,
  leftContent,
  rightSlot,
}: NavbarProps) {
  const isFixed = variant === "fixed";

  return (
    <header
      className={
        isFixed
          ? "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm"
          : "border-b-4 border-foreground"
      }
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left side */}
        {leftContent ?? (
          <Link
            href={isFixed && user ? "/dashboard" : "/"}
            className="text-2xl font-black tracking-tighter"
          >
            ひな
          </Link>
        )}

        {/* Right side */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {rightSlot}
          {/* Logout button for authenticated users */}
          {user && <LogoutButton />}
          {/* Auth buttons for unauthenticated users on landing page */}
          {isFixed && !user && (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold transition-colors hover:text-muted-foreground sm:px-4"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="manga-btn bg-primary px-4 py-2 text-sm font-bold text-primary-foreground sm:px-6"
              >
                Empezar
              </Link>
            </>
          )}
          {/* Dashboard button for authenticated users on landing page */}
          {isFixed && user && (
            <Link
              href="/dashboard"
              className="manga-btn bg-primary px-4 py-2 text-sm font-bold text-primary-foreground sm:px-6"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
