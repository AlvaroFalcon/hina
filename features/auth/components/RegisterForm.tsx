"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signUpWithEmail, signInWithGoogle } from "../lib/auth";
import type { SignUpData, AuthError } from "../types";

/**
 * Registration form component with email/password and Google OAuth options.
 * @returns JSX element for the registration form
 */
export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission for email/password registration.
   * @param e - Form submit event
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail(formData);
      router.push("/");
      router.refresh();
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles Google OAuth registration/login.
   */
  async function handleGoogleSignUp() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign up with Google");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start learning Hiragana and Katakana today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Your name"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
            minLength={6}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={loading}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 52.6 94.3 256s164.2 203.4 252.5 187.2c26.2-5.4 48.7-17.1 66.8-33.5l-67.5-64.9c-8.2 5.8-17.1 10.4-26.8 13.2-18.5 5.4-38.2 8.2-58.2 8.2-48.7 0-89.9-18.5-122.1-50.3-32.2-31.8-50.3-73.1-50.3-122.1s18.1-90.3 50.3-122.1c32.2-31.8 73.4-50.3 122.1-50.3 25.2 0 49.4 4.8 72.1 14.1l67.5-64.9C391.1 24.5 330.8 8 248 8 111.8 8 0 119.8 0 256s111.8 248 248 248c144.9 0 240-100.3 240-242.2z"
          />
        </svg>
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}

