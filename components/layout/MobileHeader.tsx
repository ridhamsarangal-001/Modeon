"use client";

import * as React from "react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/useCartStore";
import { useHydratedStore } from "@/store/useHydratedStore";
import { cn } from "@/lib/utils/cn";

/**
 * MobileHeader - Fully independent navbar built specifically for mobile screens from scratch.
 * - Handles transparent overlays on homepage scroll-tops.
 * - Restores solid luxury background on scroll down or on child page routes.
 * - iPhone notch safe-area offset built-in natively.
 */
export function MobileHeader({ scrollDir: _scrollDir, onOpenSearch }: { scrollDir?: string; onOpenSearch?: () => void }) {
  // const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const totalItems = (useHydratedStore(useCartStore, (state) => state.getTotalItems()) as number) || 0;

  // isTransparent: disabled on mobile to ensure header remains always dark
  const isTransparent = false;

  return (
    <>
      <header
        className={cn(
          "w-full select-none transition-colors duration-300 ease-out-quart",
          isTransparent
            ? "bg-transparent border-b border-transparent pt-[calc(1.5rem+env(safe-area-inset-top))] pb-5"
            : "bg-[#121212] border-b border-neutral-800/40 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5"
        )}
      >
        <div className="w-full px-6 flex items-center justify-between">
          {/* Logo on Left */}
          <div className="flex items-center">
            <Link href="/" aria-label="Modeon home" className="rounded-xs block">
              <span
                className={cn(
                  "font-display text-[22px] font-normal tracking-[0.15em] transition-colors uppercase leading-none block",
                  "text-white"
                )}
              >
                Modeon
              </span>
            </Link>
          </div>

          {/* Right Utilities Icons - 16px Spacing (gap-4) */}
          <div
            className={cn(
              "flex items-center gap-4 transition-colors",
              "text-white"
            )}
          >
            {/* Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Open search search overlay"
              className="p-1 hover:opacity-75 transition-opacity focus-visible:outline-hidden cursor-pointer"
            >
              <Search className="h-5 w-5 stroke-[1.5px]" />
            </button>

            {/* Shopping Bag (Cart) */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`View shopping selection. ${totalItems} items`}
              className="p-1 hover:opacity-75 transition-opacity focus-visible:outline-hidden relative cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-background text-[9px] rounded-full flex items-center justify-center font-bold leading-none transform translate-x-1.5 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-1 hover:opacity-75 transition-opacity focus-visible:outline-hidden cursor-pointer"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-5 w-5 stroke-[1.5px]" />
                ) : (
                  <Moon className="h-5 w-5 stroke-[1.5px]" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Nav Menu Drawer */}
            <MobileNav isTransparentHeader={isTransparent} />
          </div>
        </div>
      </header>

      {/* Cart slide drawer overlay panel */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

MobileHeader.displayName = "MobileHeader";
