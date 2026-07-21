"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { HeadingH2 } from "@/components/ui/Typography";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("password", password);

    const result = await resetPasswordAction(null, formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-[#121212] flex items-center justify-center py-space-8 px-space-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-6 md:p-space-8 shadow-soft flex flex-col gap-space-6 rounded-none">

        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
            New Password
          </HeadingH2>
          <p className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
            Enter and confirm your new password below.
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
            Password updated. Redirecting to login…
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-password" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="bg-[#F9F9F9] dark:bg-neutral-900 border-border/60 dark:border-neutral-800 rounded-none focus:ring-accent text-neutral-900 dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="bg-[#F9F9F9] dark:bg-neutral-900 border-border/60 dark:border-neutral-800 rounded-none focus:ring-accent text-neutral-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-space-2 rounded-none uppercase tracking-wider text-small bg-primary text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Update Password
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
