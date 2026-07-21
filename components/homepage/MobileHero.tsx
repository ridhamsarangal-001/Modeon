"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * MobileHero - Dedicated mobile homepage hero section.
 * - Rebuilt from scratch specifically for mobile screens.
 * - Full viewport height (100svh).
 * - Focused image alignment to prevent subject clipping.
 */
export function MobileHero() {
  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-neutral-900 flex flex-col justify-end select-none">
      {/* Background Image - Object-position set to 72% X-axis to keep model's head fully visible */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/hero/hero-modeon-main.png"
          alt="Modeon Campaign Look"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
          unoptimized
        />
      </div>

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 z-10" />

      {/* Floating Brand Mark "N" Badge at bottom-left */}
      <div className="absolute bottom-6 left-6 h-9 w-9 rounded-full bg-[#1a1a1a] text-[#F5F3EF] flex items-center justify-center font-display text-[15px] z-20">
        N
      </div>

      {/* Editorial Content - Lower Third Placement */}
      <div className="relative z-20 flex flex-col items-center justify-end px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] w-full text-center gap-5 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent">
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-neutral-300 font-semibold">
          Considered pieces, quietly made.
        </span>
        
        <h1 className="font-display text-[28px] sm:text-[32px] leading-[1.35] font-light tracking-tight max-w-sm">
          An edit of essentials, refined for everyday.
        </h1>
        
        {/* Luxury CTA Button - 40px spacing below heading */}
        <div className="mt-10 w-full max-w-[260px]">
          <Link 
            href="/collections/men" 
            className="w-full inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 font-sans text-micro font-semibold uppercase tracking-[0.2em] py-[18px] px-[24px] rounded-none transition-colors duration-300"
          >
            SHOP NEW ARRIVALS
          </Link>
        </div>
      </div>
    </div>
  );
}

MobileHero.displayName = "MobileHero";
