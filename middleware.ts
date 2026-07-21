import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Detect active NextAuth sessions across dev/production secure cookie profiles
  const sessionCookie = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionCookie;

  const isAuthRoute = path === "/login" || path === "/signup";
  const isProtectedRoute = path.startsWith("/account") || path.startsWith("/checkout") || path.startsWith("/admin");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
