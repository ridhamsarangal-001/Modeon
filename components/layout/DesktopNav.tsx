"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Desktop inline navigation panel.
 * Sized at 15px, sans-serif, color #333.
 * Highlights the active route with an underline in #1a1a1a.
 */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-space-5" aria-label="Main Navigation">
      {NAV_LINKS.header.map((link) => {
        const isActive = pathname === link.path;
        return (
          <Link
            key={link.path}
            href={link.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-sans text-[15px] text-[#333] dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors relative py-1 select-none",
              isActive && "text-[#1a1a1a] dark:text-white font-medium"
            )}
          >
            {link.label}
            {isActive && (
              <span 
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] dark:bg-white"
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

DesktopNav.displayName = "DesktopNav";
