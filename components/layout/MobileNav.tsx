"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { HeadingH3 } from "@/components/ui/Typography";

/**
 * MobileNav full-screen navigation menu.
 * Fully accessible (WCAG AA): traps focus, handles escape close, blocks body scroll, and restores focus.
 */
export function MobileNav({ isTransparentHeader: _isTransparentHeader }: { isTransparentHeader?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const drawerRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  // Toggle drawer open state
  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  // Handle body scroll lock & focus restoration
  React.useEffect(() => {
    if (isOpen) {
      // Store trigger element to restore focus later
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus first link in drawer after transition
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, input, textarea, [tabindex="0"]'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      // Restore focus to trigger when closing
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle keyboard events (Escape to close, Tab to trap focus)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        closeDrawer();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, [tabindex="0"]'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab -> Wrap around to last element
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab -> Wrap around to first element
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close drawer when the pathname changes (user clicked a link)
  React.useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        closeDrawer();
      }
    }, 0);
    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <div className="lg:hidden">
      {/* Menu Hamburger Trigger Button (hidden when open to prevent overlap) */}
      {!isOpen && (
        <button
          ref={triggerRef}
          onClick={toggleDrawer}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          aria-label="Toggle navigation menu"
          className={cn(
            "p-space-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-base relative z-50 select-none cursor-pointer",
            "text-white"
          )}
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center relative">
            <span className="w-full h-[1.5px] bg-current transition-all duration-300 ease-out-quart origin-left" />
            <span className="w-full h-[1.5px] bg-current transition-all duration-200 ease-out-quart" />
            <span className="w-full h-[1.5px] bg-current transition-all duration-300 ease-out-quart origin-left" />
          </div>
        </button>
      )}

      {/* Backdrop overlay (rendered behind full-screen drawer for fade effect) */}
      <div
        className={cn(
          "fixed inset-0 bg-primary/20 backdrop-blur-xs z-40 transition-opacity duration-300 ease-out-quart pointer-events-none opacity-0",
          isOpen && "pointer-events-auto opacity-100"
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Navigation Slide-Out Drawer - Full Screen (100vw x 100vh) */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={cn(
          "fixed inset-0 w-screen h-screen bg-[#121212] z-50 flex flex-col justify-between shadow-modal overflow-hidden",
          "transition-[transform,visibility] duration-300 ease-out-quart",
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full",
          !shouldRender && "hidden"
        )}
      >
        {/* Drawer Header: Logo on left, Close icon on right */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-800/40 shrink-0 pt-[calc(1.25rem+env(safe-area-inset-top))]">
          <span className="font-display text-[24px] font-normal tracking-[0.15em] text-[#F8F7F5] uppercase leading-none">
            Modeon
          </span>
          <button
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            className="p-2 text-[#F8F7F5] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-base cursor-pointer"
          >
            <X className="h-6 w-6 stroke-[1.5px]" />
          </button>
        </div>

        {/* Drawer Content: Vertical links (24px space), scrollable if height is restricted */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 flex flex-col gap-8 scrollbar-none">
          <div className="flex flex-col gap-6">
            <HeadingH3 className="font-semibold text-accent uppercase tracking-widest text-micro text-left">
              Menu Selection
            </HeadingH3>
            <nav className="flex flex-col gap-6" aria-label="Mobile Main Navigation">
              {NAV_LINKS.header.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-sans text-body-lg text-neutral-400 hover:text-[#F8F7F5] transition-colors py-1 select-none text-left",
                      isActive && "text-[#F8F7F5] font-medium"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer links within mobile drawer */}
          <div className="flex flex-col gap-6 border-t border-neutral-800/40 pt-6">
            <HeadingH3 className="font-semibold text-accent uppercase tracking-widest text-micro text-left">
              Account & Lists
            </HeadingH3>
            <div className="flex flex-col gap-6">
              <Link href="/wishlist" className="font-sans text-body text-neutral-400 hover:text-[#F8F7F5] text-left">
                Wishlist
              </Link>
              <Link href="/selection" className="font-sans text-body text-neutral-400 hover:text-[#F8F7F5] text-left">
                Selection (Cart)
              </Link>
              <Link href="/account" className="font-sans text-body text-neutral-400 hover:text-[#F8F7F5] text-left">
                Account Settings
              </Link>
            </div>
          </div>
        </div>

        {/* CTA fixed at bottom */}
        <div className="p-6 shrink-0 border-t border-neutral-800/40 bg-[#121212] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <Link
            href="/collections/new-arrivals"
            className="w-full bg-[#F8F7F5] text-black py-4 text-center font-sans font-semibold text-small uppercase tracking-widest block hover:bg-neutral-200 transition-colors"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
}

MobileNav.displayName = "MobileNav";
