"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/services/db";
import { z } from "zod";
import { redirect } from "next/navigation";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const otpRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

// ─── OTP Request ──────────────────────────────────────────────────────────────

/**
 * Triggers a Supabase Email OTP for the given address.
 * Supabase sends the 6-digit code via its own SMTP — no Resend required.
 */
export async function requestOtpAction(
  _prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  console.log("[Auth] requestOtpAction for:", email);

  const validated = otpRequestSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: validated.data.email,
    options: {
      // Do not auto-create a Supabase Auth user yet — we control user creation
      // in Prisma on successful OTP verification below.
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[Auth] signInWithOtp error:", error.message);
    return { error: error.message || "Failed to send verification code." };
  }

  console.log("[Auth] OTP email dispatched via Supabase for:", email);
  return { success: true };
}

// ─── OTP Verify ───────────────────────────────────────────────────────────────

/**
 * Verifies a 6-digit Supabase OTP token.
 * On success, provisions or fetches the Prisma user and redirects to /account.
 */
export async function verifyOtpAction(
  _prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  console.log("[Auth] verifyOtpAction for:", email);

  const validated = otpVerifySchema.safeParse({ email, otp });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email: validated.data.email,
    token: validated.data.otp,
    type: "email",
  });

  if (error || !data.session) {
    console.error("[Auth] verifyOtp error:", error?.message);
    return {
      error:
        error?.message ||
        "Invalid or expired code. Please request a new one.",
    };
  }

  // Provision the user in Prisma if they don't exist yet
  const supabaseUser = data.user;
  if (supabaseUser?.email) {
    try {
      const existing = await db.user.findUnique({
        where: { email: supabaseUser.email },
      });

      if (!existing) {
        await db.user.create({
          data: {
            email: supabaseUser.email,
            name: supabaseUser.email.split("@")[0],
            role: "CUSTOMER",
          },
        });
        console.log("[Auth] Provisioned new Prisma user for:", supabaseUser.email);
      }
    } catch (dbErr) {
      console.error("[Auth] Prisma user provision error:", dbErr);
      // Non-fatal — session is valid, DB user can be created later
    }
  }

  console.log("[Auth] OTP verified, session established for:", email);
  redirect("/account");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Signs the user out via Supabase Auth and redirects to home.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
