"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Featured Campaign banner component for the Homepage.
 * Mirror layout of Study No. 01: transparent text panel on left (showing mountains)
 * and campaign image on right with a slow zoom-out entrance reveal.
 */
export function FeaturedCampaign() {
  return (
    <section 
      className="w-full bg-[#F5F3EF] dark:bg-[#121212] text-black py-space-6 md:py-space-8 select-none relative overflow-hidden transition-colors duration-300"
      style={{ clipPath: "inset(0)" }}
    >
      
      {/* Fixed Parallax Mountain Background Layer (Light mode: 80% opacity, Dark mode: 15% opacity blending) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-80 dark:opacity-15 transition-opacity duration-300"
        style={{
          backgroundImage: "url('/assets/editorial/mountain-bg.png')",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 relative z-10">
        
        {/* Campaign showcase container - transparent & matching editorial margin/gap spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center">
          
          {/* Text panel (5-cols) - Transparent background showing the mountain parallax */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start text-left lg:pr-space-5 gap-space-4">
            <span className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
              Preview Collection
            </span>
            <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
              Autumn / Winter 24
            </h2>
            <p className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300 transition-colors">
              A first glance at the incoming collection. Exploring heavier structures, draped silhouettes, and double-ply alpaca cardigans tailored for the colder months ahead.
            </p>
            <div className="mt-space-2">
              <Link 
                href="/collections/men"
                className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
              >
                Explore Campaign
              </Link>
            </div>
          </div>

          {/* Image panel (7-cols) - Identical aspect ratios and zoom-out entrance reveal */}
          <div className="lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <motion.div
              initial={{ scale: 1.12, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              className="w-full h-full relative"
            >
              <Image
                src="/assets/hero/hero-1.jpg"
                alt="Autumn Winter Campaign Look"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center hover:scale-102 transition-transform duration-700 ease-out-quart"
                unoptimized
              />
            </motion.div>
            {/* Corner visual text */}
            <div className="absolute top-space-4 right-space-4 z-20 text-white font-sans text-[11px] font-semibold uppercase tracking-[0.15em]">
              AW / 24 Preview
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

FeaturedCampaign.displayName = "FeaturedCampaign";
