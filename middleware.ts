import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const { supabaseResponse, user } = await updateSession(request);

  const isLoggedIn = !!user;
  const isAuthRoute = path === "/login" || path === "/signup";
  const isProtectedRoute =
    path.startsWith("/account") ||
    path.startsWith("/checkout") ||
    path.startsWith("/admin");

  // Redirect already-logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Return the supabaseResponse so session cookies are written correctly
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/account/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
