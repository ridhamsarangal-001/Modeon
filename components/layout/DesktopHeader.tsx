"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { DesktopNav } from "./DesktopNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/store/useCartStore";
import { useHydratedStore } from "@/store/useHydratedStore";

/**
 * DesktopHeader - Pixel-perfect header specifically isolated for desktop viewports.
 * EXACTLY matches the legacy brand layout, sizing, backgrounds, and margins.
 */
export function DesktopHeader({ onOpenSearch }: { onOpenSearch?: () => void }) {
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

  return (
    <>
      <header className="w-full bg-[#F5F3EF] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-800 select-none py-[24px]">
        <div className="mx-auto w-full max-w-[1440px] px-space-4 lg:px-space-5 flex items-center justify-between">
          {/* Left Side: Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Modeon home"
              className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs block"
            >
              <span className="font-display text-[24px] font-normal tracking-[0.15em] text-[#1a1a1a] dark:text-[#F8F7F5] transition-colors select-none uppercase leading-none block">
                Modeon
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation links */}
          <DesktopNav />

          {/* Right Side: Utilities */}
          <div className="flex items-center gap-space-2 md:gap-space-3 text-[#1a1a1a] dark:text-[#F8F7F5] transition-colors">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              aria-label="Open search search overlay"
              className="p-space-2 hover:text-[#333] dark:hover:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#F8F7F5] rounded-base cursor-pointer"
            >
              <Search className="h-5 w-5 stroke-[1.5px]" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="View wishlist"
              className="p-space-2 hover:text-[#333] dark:hover:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#F8F7F5] rounded-base"
            >
              <Heart className="h-5 w-5 stroke-[1.5px]" />
            </Link>

            {/* Selection (Cart) Button Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`View shopping selection. ${totalItems} items in selection`}
              aria-controls="cart-drawer-panel"
              aria-expanded={isCartOpen}
              className="p-space-2 hover:text-[#333] dark:hover:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#F8F7F5] rounded-base relative cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4.5 w-4.5 bg-[#1a1a1a] dark:bg-[#F8F7F5] text-white dark:text-black text-[10px] rounded-full flex items-center justify-center font-bold tracking-normal leading-none transform translate-x-1.5 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account Settings Link */}
            <Link
              href="/account"
              aria-label="View customer account"
              className="p-space-2 hover:text-[#333] dark:hover:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#F8F7F5] rounded-base"
            >
              <User className="h-5 w-5 stroke-[1.5px]" />
            </Link>

            {/* Dark Mode Toggle Option */}
            <button
              onClick={toggleTheme}
              aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-space-2 hover:text-[#333] dark:hover:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#F8F7F5] rounded-base cursor-pointer"
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
          </div>
        </div>
      </header>

      {/* Cart slide drawer overlay panel */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

DesktopHeader.displayName = "DesktopHeader";
