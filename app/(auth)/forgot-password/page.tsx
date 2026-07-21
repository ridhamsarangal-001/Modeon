"use client";

import * as React from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { HeadingH2 } from "@/components/ui/Typography";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await forgotPasswordAction(null, formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-[#121212] flex items-center justify-center py-space-8 px-space-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-6 md:p-space-8 shadow-soft flex flex-col gap-space-6 rounded-none">

        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
            Reset Password
          </HeadingH2>
          <p className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
            {success
              ? "If this email is registered, a reset link has been dispatched."
              : "Enter your account email to receive a password reset link."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/20 p-space-3 text-small text-error font-sans font-medium text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-success/10 border border-success/20 p-space-3 text-small text-success font-sans font-medium text-center">
            Check your inbox for the reset link.
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="forgot-email" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                Email Address
              </Label>
              <Input
                id="forgot-email"
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
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center font-sans text-small text-neutral-700 dark:text-neutral-300 border-t border-border/40 dark:border-neutral-800 pt-space-4 mt-space-1">
          <Link href="/login" className="text-neutral-900 dark:text-white font-medium hover:underline transition-all">
            Back to Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
