import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

/**
 * Proxy to handle authentication and route protection.
 * Refreshes user sessions and protects authenticated routes.
 * @param request - Next.js request object
 * @returns NextResponse with updated cookies
 */
export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes - redirect to login if not authenticated
  // Skip auth callback route
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/modules") &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/auth/callback")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return Response.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
