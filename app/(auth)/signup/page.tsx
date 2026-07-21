"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { HeadingH2 } from "@/components/ui/Typography";
import { requestOtpAction } from "@/lib/actions/auth-actions";

/**
 * Signup Page — Supabase Email OTP.
 * Accounts are provisioned automatically on first OTP login.
 * This page simply triggers an OTP for the given email and redirects to the verify step.
 */
export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestOtpAction(null, formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Redirect to login page with email pre-filled via query param
      router.push(`/login?email=${encodeURIComponent(email)}&step=verify`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-[#121212] flex items-center justify-center py-space-8 px-space-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-6 md:p-space-8 shadow-soft flex flex-col gap-space-6 rounded-none">
        
        {/* Header Block */}
        <div className="flex flex-col gap-1 text-center">
          <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
            Register
          </HeadingH2>
          <p className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
            Enter your email. A verification code will be sent to your inbox — no password required.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-error/10 border border-error/20 p-space-3 text-small text-error font-sans font-medium text-center">
            {error}
          </div>
        )}

        {/* Input fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@modeon.com"
              className="bg-[#F9F9F9] dark:bg-neutral-900 border-border/60 dark:border-neutral-800 rounded-none focus:ring-accent text-neutral-900 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-space-2 rounded-none uppercase tracking-wider text-small bg-primary text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Send Verification Code
          </Button>
        </form>

        {/* Footer actions */}
        <div className="text-center font-sans text-small text-neutral-700 dark:text-neutral-300 border-t border-border/40 dark:border-neutral-800 pt-space-4 mt-space-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neutral-900 dark:text-white font-medium hover:underline transition-all"
          >
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
