"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  desktopLabel?: string;
  mobileLabel?: string;
}

/**
 * Smart back button — uses browser history if available, falls back to "/".
 * Renders different labels on mobile vs desktop.
 */
export function BackButton({
  desktopLabel = "Continue Shopping",
  mobileLabel = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 font-sans text-small text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group cursor-pointer"
      aria-label="Go back"
    >
      <ArrowLeft
        size={15}
        className="transition-transform group-hover:-translate-x-0.5"
        strokeWidth={1.8}
      />
      {/* Desktop label */}
      <span className="hidden sm:inline tracking-wide">{desktopLabel}</span>
      {/* Mobile label */}
      <span className="sm:hidden tracking-wide">{mobileLabel}</span>
    </button>
  );
}
