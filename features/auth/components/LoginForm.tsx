"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from "../lib/auth";
import type { SignInData, AuthError } from "../types";

/**
 * Login form component with email/password and Google OAuth options.
 * @returns JSX element for the login form
 */
export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission for email/password login.
   * @param e - Form submit event
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(formData);
      router.push("/");
      router.refresh();
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles Google OAuth login.
   */
  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign in with Google");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header with logo */}
      <div className="mb-8 text-center">
        <a href="/" className="inline-block text-4xl font-black tracking-tighter">
          ひな
        </a>
      </div>

      {/* Main panel */}
      <div className="manga-panel manga-shadow space-y-6 bg-background p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">
            Continúa aprendiendo Hiragana y Katakana
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="manga-border bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
              className="flex h-11 w-full border-2 border-foreground bg-background px-3 py-2 text-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="flex h-11 w-full border-2 border-foreground bg-background px-3 py-2 text-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="manga-btn w-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 font-bold text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <button
          type="button"
          className="manga-btn flex w-full items-center justify-center gap-2 bg-background py-3 text-sm font-bold disabled:pointer-events-none disabled:opacity-50"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 52.6 94.3 256s164.2 203.4 252.5 187.2c26.2-5.4 48.7-17.1 66.8-33.5l-67.5-64.9c-8.2 5.8-17.1 10.4-26.8 13.2-18.5 5.4-38.2 8.2-58.2 8.2-48.7 0-89.9-18.5-122.1-50.3-32.2-31.8-50.3-73.1-50.3-122.1s18.1-90.3 50.3-122.1c32.2-31.8 73.4-50.3 122.1-50.3 25.2 0 49.4 4.8 72.1 14.1l67.5-64.9C391.1 24.5 330.8 8 248 8 111.8 8 0 119.8 0 256s111.8 248 248 248c144.9 0 240-100.3 240-242.2z"
            />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="font-bold text-foreground hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}

