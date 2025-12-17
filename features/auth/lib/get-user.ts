import { createClient } from "@/lib/supabase/server";
import type { User } from "../types";

/**
 * Gets the current authenticated user in a server component or server action.
 * @returns User object if authenticated, null otherwise
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  };
}

