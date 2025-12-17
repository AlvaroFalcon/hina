import { LoginForm } from "@/features/auth/components/LoginForm";

/**
 * Login page component.
 * @returns JSX element for the login page
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <LoginForm />
    </div>
  );
}

