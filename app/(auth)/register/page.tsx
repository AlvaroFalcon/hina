import { RegisterForm } from "@/features/auth/components/RegisterForm";

/**
 * Registration page component.
 * @returns JSX element for the registration page
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <RegisterForm />
    </div>
  );
}

