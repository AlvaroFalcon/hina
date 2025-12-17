"use client";

import { createClient } from "@/lib/supabase/client";
import type { SignInData, SignUpData, AuthError } from "../types";

/**
 * Signs in a user with email and password.
 * @param data - Sign in credentials
 * @returns Promise resolving to user data or throwing an error
 */
export async function signInWithEmail(
  data: SignInData
): Promise<{ user: any }> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    const authError: AuthError = {
      message: error.message,
      status: error.status,
    };
    throw authError;
  }

  return { user: authData.user };
}

/**
 * Signs up a new user with email and password.
 * @param data - Sign up credentials
 * @returns Promise resolving to user data or throwing an error
 */
export async function signUpWithEmail(
  data: SignUpData
): Promise<{ user: any }> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (error) {
    const authError: AuthError = {
      message: error.message,
      status: error.status,
    };
    throw authError;
  }

  return { user: authData.user };
}

/**
 * Signs in a user with Google OAuth.
 * @param redirectTo - URL to redirect to after authentication
 * @returns Promise that resolves when OAuth flow is initiated
 */
export async function signInWithGoogle(redirectTo?: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    const authError: AuthError = {
      message: error.message,
      status: error.status,
    };
    throw authError;
  }
}

