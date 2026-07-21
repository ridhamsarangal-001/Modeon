"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/services/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── Sign Up ──────────────────────────────────────────────────────────────────

/**
 * Create a new account with email + password via Supabase Auth.
 * On success also provisions a Prisma user row for app-level data.
 */
export async function signupAction(
  _prevState: unknown,
  formData: FormData
) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = signupSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, email, password } = validated.data;
  const supabase = await createClient();

  // 1. Create Supabase Auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    console.error("[Auth] signUp error:", error.message);
    return { error: error.message };
  }

  // 2. Provision Prisma user (non-fatal if it already exists)
  if (data.user?.email) {
    try {
      await db.user.upsert({
        where: { email: data.user.email },
        update: {},
        create: {
          email: data.user.email,
          name,
          role: "CUSTOMER",
        },
      });
    } catch (dbErr) {
      console.error("[Auth] Prisma upsert error on signup:", dbErr);
    }
  }

  return { success: true };
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password via Supabase Auth.
 * Provisions the Prisma user row if missing (edge case for legacy OTP users).
 */
export async function loginAction(
  _prevState: unknown,
  formData: FormData
) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { email, password } = validated.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[Auth] signInWithPassword error:", error.message);
    // Surface a user-friendly message for common cases
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    return { error: error.message };
  }

  // Provision Prisma user row if somehow missing
  if (data.user?.email) {
    try {
      await db.user.upsert({
        where: { email: data.user.email },
        update: {},
        create: {
          email: data.user.email,
          name:
            (data.user.user_metadata?.full_name as string | undefined) ||
            data.user.email.split("@")[0],
          role: "CUSTOMER",
        },
      });
    } catch (dbErr) {
      console.error("[Auth] Prisma upsert error on login:", dbErr);
    }
  }

  redirect("/account");
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * Initiate Google OAuth sign-in.
 * Supabase returns an authorization URL — we redirect the browser there.
 */
export async function googleLoginAction() {
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error || !data.url) {
    console.error("[Auth] Google OAuth error:", error?.message);
    return { error: error?.message || "Failed to initiate Google sign-in." };
  }

  redirect(data.url);
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * Send a Supabase password reset email.
 */
export async function forgotPasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;

  const validated = forgotSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    validated.data.email,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );

  if (error) {
    console.error("[Auth] resetPasswordForEmail error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

/**
 * Set a new password after the user clicks the reset link in their email.
 * This is called from the /reset-password page which Supabase redirects to.
 */
export async function resetPasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const password = formData.get("password") as string;

  const validated = resetSchema.safeParse({ password });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (error) {
    console.error("[Auth] updateUser (reset) error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Sign the current user out via Supabase Auth.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
