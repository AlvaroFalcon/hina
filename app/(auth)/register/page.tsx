import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Registration page component.
 * @returns JSX element for the registration page
 */
export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <RegisterForm />
    </div>
  );
}

