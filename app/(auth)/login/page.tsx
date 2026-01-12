import { LoginForm } from "@/features/auth/components/LoginForm";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Login page component.
 * @returns JSX element for the login page
 */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  );
}

