"use server";

import { db } from "@/lib/services/db";
import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(_prevState: unknown, formData: FormData) {
  try {
    const rawName = formData.get("name") as string;
    const rawEmail = formData.get("email") as string;
    const rawPassword = formData.get("password") as string;

    const validated = signupSchema.safeParse({
      name: rawName,
      email: rawEmail,
      password: rawPassword,
    });

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, email, password } = validated.data;

    // Check if user exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "User already exists with this email address." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "CUSTOMER",
      },
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Signup error:", err);
    return { error: "An unexpected error occurred during signup." };
  }
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  console.log("[Server Action] loginAction triggered for email:", rawEmail);

  try {
    const validated = loginSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!validated.success) {
      console.warn("[Server Action] validation failed inside loginAction:", validated.error.issues);
      return { error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;
    console.log("[Server Action] calling Auth.js signIn provider with credentials for:", email);

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/account",
    });

    console.log("[Server Action] signIn completed successfully for:", email);
    return { success: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
      console.log("[Server Action] NEXT_REDIRECT caught, re-throwing to perform routing redirect...");
      throw err;
    }

    if (err instanceof AuthError) {
      console.warn("[Server Action] AuthError encountered during signIn:", err.type);
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please check your email and password." };
        default:
          return { error: "Authentication failed." };
      }
    }

    console.error("[Server Action] Unexpected login error encountered:", err);
    return { error: "An unexpected error occurred during login." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

import { sendOtp } from "@/lib/services/otp-service";

const otpRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

export async function requestOtpAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  console.log("[Server Action] requestOtpAction for email:", email);

  const validated = otpRequestSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const result = await sendOtp(validated.data.email);
  if (!result.success) {
    return { error: result.error || "Failed to send code." };
  }

  return { success: true };
}

export async function verifyOtpAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  console.log("[Server Action] verifyOtpAction for email:", email, "OTP:", otp);

  const validated = otpVerifySchema.safeParse({ email, otp });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      otp: validated.data.otp,
      isOtpLogin: "true",
      redirectTo: "/account",
    });

    return { success: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
      console.log("[Server Action] verifyOtpAction redirecting...");
      throw err;
    }

    if (err instanceof AuthError) {
      console.warn("[Server Action] AuthError in OTP validation:", err.type);
      return { error: "Invalid code or code has expired. Please request a new code." };
    }

    console.error("[Server Action] Unexpected OTP verify error:", err);
    return { error: "An unexpected error occurred during OTP verification." };
  }
}
