"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { User as AppUser } from "../types";

/**
 * Custom hook for managing authentication state.
 * Provides user information and authentication status.
 * @returns Object containing user, loading state, and error
 */
export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    /**
     * Fetches the current user session.
     */
    async function getUser() {
      try {
        const {
          data: { user: supabaseUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (supabaseUser) {
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            user_metadata: supabaseUser.user_metadata,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    /**
     * Listens for authentication state changes.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Signs out the current user.
   * @returns Promise that resolves when sign out is complete
   */
  async function signOut() {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"));
      throw err;
    }
  }

  return { user, loading, error, signOut };
}

