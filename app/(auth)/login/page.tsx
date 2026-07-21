"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction, requestOtpAction, verifyOtpAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { HeadingH2 } from "@/components/ui/Typography";
import { PremiumLoader } from "@/components/ui/PremiumLoader";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  // Login mode states
  const [authMethod, setAuthMethod] = React.useState<"password" | "otp">("password");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // OTP flow states
  const [step, setStep] = React.useState<"request" | "verify">("request");
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Cooldown timers
  const [cooldown, setCooldown] = React.useState(0);
  const [expiration, setExpiration] = React.useState(0);

  const otpInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  // 1. Cooldown timer count down
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // 2. Code Expiration count down
  React.useEffect(() => {
    if (step === "verify" && expiration > 0) {
      const timer = setTimeout(() => setExpiration(expiration - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiration, step]);

  // Password submission handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await loginAction(null, formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  // OTP Request handler
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestOtpAction(null, formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setStep("verify");
      setOtp(Array(6).fill(""));
      setCooldown(60); // 60 seconds resend cooldown
      setExpiration(300); // 5 minutes expiration
      setLoading(false);
      // Auto focus on the first OTP box
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    }
  };

  // OTP Verification handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please fill out all 6 verification digits.");
      return;
    }
    if (expiration === 0) {
      setError("Verification code has expired. Please request a new code.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otpValue);

    const result = await verifyOtpAction(null, formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  // Shift focus logic
  const handleOtpChange = (val: string, idx: number) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    if (!numericVal) {
      const newOtp = [...otp];
      newOtp[idx] = "";
      setOtp(newOtp);
      return;
    }

    const digit = numericVal.slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);

    // Auto-advance focus to the next input box
    if (idx < 5 && otpInputs.current[idx + 1]) {
      otpInputs.current[idx + 1]?.focus();
    }
  };

  // Handle backspaces focus fallback
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0 && otpInputs.current[idx - 1]) {
        const newOtp = [...otp];
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        otpInputs.current[idx - 1]?.focus();
      }
    }
  };

  // Handle clipboard paste auto fill
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (text.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = text[i] || "";
      }
      setOtp(newOtp);
      const focusIndex = Math.min(text.length, 5);
      otpInputs.current[focusIndex]?.focus();
    }
  };

  // Format expiration seconds to MM:SS
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] dark:bg-[#121212] flex items-center justify-center py-space-8 px-space-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-6 md:p-space-8 shadow-soft flex flex-col gap-space-6 rounded-none">
        
        {/* Header Block */}
        <div className="flex flex-col gap-1 text-center">
          <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
            Log In
          </HeadingH2>
          <p className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
            {step === "verify" && authMethod === "otp" 
              ? "Verify using the sign-in link sent to your inbox." 
              : "Access your order log and address portfolio."}
          </p>
        </div>

        {/* Auth Mode Tab Selection (Hidden when verifying OTP) */}
        {step === "request" && (
          <div className="flex border-b border-border/40 dark:border-neutral-800">
            <button
              onClick={() => { setAuthMethod("password"); setError(null); }}
              className={`flex-1 pb-3 text-micro tracking-widest uppercase font-sans font-semibold border-b-2 transition-all cursor-pointer ${
                authMethod === "password" 
                  ? "border-accent text-neutral-900 dark:text-white" 
                  : "border-transparent text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Continue with Password
            </button>
            <button
              onClick={() => { setAuthMethod("otp"); setError(null); }}
              className={`flex-1 pb-3 text-micro tracking-widest uppercase font-sans font-semibold border-b-2 transition-all cursor-pointer ${
                authMethod === "otp" 
                  ? "border-accent text-neutral-900 dark:text-white" 
                  : "border-transparent text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Continue with Email Link
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        {(error || (step === "verify" && expiration === 0)) && (
          <div className="bg-error/10 border border-error/20 p-space-3 text-small text-error font-sans font-medium text-center">
            {error || "Sign-in link has expired. Please request a new link."}
          </div>
        )}

        {/* Flow 1: Standard Password Login */}
        {authMethod === "password" && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-space-4">
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
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
        )}

        {/* Flow 2: Email OTP Login */}
        {authMethod === "otp" && (
          <>
            {step === "request" ? (
              // Step A: Request Code Form
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-space-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="otp-email" className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </Label>
                  <Input
                    id="otp-email"
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
                  className="w-full mt-space-2 rounded-none uppercase tracking-wider text-small bg-primary text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Send Sign-in Link
                </Button>
              </form>
            ) : (
              // Step B: Verify Code Form
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-space-5">
                <div className="flex flex-col gap-space-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-sans text-micro tracking-widest uppercase text-neutral-700 dark:text-neutral-300">
                      Check email for the sign-in link
                    </Label>
                    <span className="font-mono text-small text-accent font-semibold">
                      {formatTime(expiration)}
                    </span>
                  </div>

                  {/* 6 Digit Box Layout */}
                  <div className="grid grid-cols-6 gap-2 w-full justify-center">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        className="w-full aspect-square max-w-[48px] mx-auto text-center font-mono text-body-lg font-bold border border-border/60 dark:border-neutral-800 bg-[#F9F9F9] dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-accent focus:border-transparent rounded-none"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-space-3 mt-space-1">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full rounded-none uppercase tracking-wider text-small bg-primary text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Verify & Sign In
                  </Button>

                  <div className="flex justify-between items-center font-sans text-small pt-space-2">
                    <button
                      type="button"
                      onClick={() => setStep("request")}
                      className="text-neutral-700 dark:text-neutral-300 hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>

                    <button
                      type="button"
                      disabled={cooldown > 0 || loading}
                      onClick={() => handleRequestOtp()}
                      className={`cursor-pointer font-medium ${
                        cooldown > 0 
                          ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed" 
                          : "text-neutral-900 dark:text-white hover:underline"
                      }`}
                    >
                      {cooldown > 0 ? `Resend Link in ${cooldown}s` : "Resend Link"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}

        {/* Footer actions */}
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
