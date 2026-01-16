"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Client component button for logging out.
 * Handles sign out and redirects to home page.
 * @returns Logout button JSX element
 */
export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  /**
   * Handles the logout process.
   * Signs out the user and redirects to home.
   */
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 text-sm font-semibold transition-colors hover:text-muted-foreground sm:px-4"
    >
      Salir
    </button>
  );
}
