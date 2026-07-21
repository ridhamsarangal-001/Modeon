"use client";

import { DesktopHero } from "./DesktopHero";
import { MobileHero } from "./MobileHero";

/**
 * Hero - Switcher component separating Mobile and Desktop layouts.
 * - DesktopHero: Kept 100% pixel-perfect matching original code design.
 * - MobileHero: Rebuilt from scratch optimized for mobile viewports.
 */
export function Hero() {
  return (
    <>
      {/* Desktop Hero Layout */}
      <div className="hidden lg:block">
        <DesktopHero />
      </div>

      {/* Mobile Hero Layout */}
      <div className="block lg:hidden">
        <MobileHero />
      </div>
    </>
  );
}

Hero.displayName = "Hero";
