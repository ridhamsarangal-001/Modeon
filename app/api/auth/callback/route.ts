import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/services/db";

/**
 * Supabase OAuth callback handler.
 * Supabase redirects here after Google sign-in with a `code` query param.
 * We exchange the code for a session, provision the Prisma user, and redirect.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { user } = data;

      // Provision Prisma user row if first Google sign-in
      if (user.email) {
        try {
          await db.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              name:
                (user.user_metadata?.full_name as string | undefined) ||
                (user.user_metadata?.name as string | undefined) ||
                user.email.split("@")[0],
              role: "CUSTOMER",
            },
          });
        } catch (dbErr) {
          console.error("[Auth Callback] Prisma upsert error:", dbErr);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // On error, redirect back to login with an error message
  console.error("[Auth Callback] Code exchange failed or code missing.");
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
