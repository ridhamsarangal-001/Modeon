"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction, googleLoginAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { HeadingH2 } from "@/components/ui/Typography";
import { PremiumLoader } from "@/components/ui/PremiumLoader";
import { BackButton } from "@/components/ui/BackButton";

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border/40 dark:bg-neutral-800" />
      <span className="font-sans text-micro tracking-widest uppercase text-neutral-400 dark:text-neutral-600 shrink-0">
        or
      </span>
      <div className="flex-1 h-px bg-border/40 dark:bg-neutral-800" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const oauthError = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    oauthError ? "Google sign-in failed. Please try again." : null
  );

  // Email + Password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      await loginAction(null, formData);
      // loginAction redirects on success — reaching here means an error was returned
    } catch (err: unknown) {
      // Next.js redirect() throws — catch and navigate
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")
      ) {
        router.push(callbackUrl);
        return;
      }
      setError("An unexpected error occurred.");
      setLoading(false);
      return;
    }

    // If loginAction returned an error object (non-redirect path)
    const result = await loginAction(null, (() => {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("password", password);
      return fd;
    })());
    if (result?.error) setError(result.error);
    setLoading(false);
  };

  // Google OAuth
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await googleLoginAction();
    } catch (err: unknown) {
      // Google redirects via redirect() — this is expected
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")
      ) {
        return; // browser will follow the redirect
      }
      setError("Could not initiate Google sign-in.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-[#121212] flex items-center justify-center py-space-8 px-space-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-6 md:p-space-8 shadow-soft flex flex-col gap-space-6 rounded-none">

        {/* Back */}
        <div className="flex items-start">
          <BackButton mobileLabel="Back" desktopLabel="Back" />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
            Log In
          </HeadingH2>
          <p className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
            Access your order log and address portfolio.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/20 p-space-3 text-small text-error font-sans font-medium text-center">
            {error}
          </div>
        )}

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border border-border/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 py-3 px-4 font-sans text-small font-medium text-neutral-900 dark:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
        >
          {googleLoading ? (
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        <OrDivider />

        {/* Email + Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
              Email Address
            </Label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@modeon.com"
              className="bg-[#F9F9F9] dark:bg-neutral-900 border-border/60 dark:border-neutral-800 rounded-none focus:ring-accent text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="login-password" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:underline transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#F9F9F9] dark:bg-neutral-900 border-border/60 dark:border-neutral-800 rounded-none focus:ring-accent text-neutral-900 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-space-2 rounded-none uppercase tracking-wider text-small bg-primary text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center font-sans text-small text-neutral-700 dark:text-neutral-300 border-t border-border/40 dark:border-neutral-800 pt-space-4 mt-space-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-neutral-900 dark:text-white font-medium hover:underline transition-all"
          >
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<PremiumLoader />}>
      <LoginContent />
    </React.Suspense>
  );
}
