"use client";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils/cn";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";

/**
 * Header - Switcher component separating Mobile and Desktop layouts.
 * - Manages the global sticky positioning and smart scroll translate transitions.
 * - This prevents sticky boundary limitations of individual headers.
 */
export function Header() {
  const scrollDir = useScrollDirection();
  const isHidden = scrollDir === "down";

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full transition-transform duration-300 ease-out-quart",
        isHidden ? "-translate-y-[calc(100%+12px)]" : "translate-y-0"
      )}
    >
      {/* Desktop Header Layout */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>

      {/* Mobile Header Layout */}
      <div className="block lg:hidden">
        <MobileHeader scrollDir={scrollDir} />
      </div>
    </div>
  );
}

Header.displayName = "Header";
