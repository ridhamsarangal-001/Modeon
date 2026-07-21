"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * DesktopHero - Homepage Hero section specifically isolated for desktop viewports.
 * Restored to the exact premium layout shown in the reference photo:
 * - 40% / 60% split proportions.
 * - Background color: #F5F3EF (dark:bg-[#121212]).
 * - Eyebrow in italic serif font.
 * - Entire heading is "An edit of essentials, refined for everyday. Where less becomes more, crafted with quiet luxury."
 * - Uppercase "SHOP NEW ARRIVALS" CTA button.
 * - Smooth transition blending mask (transparent 0% to black 8%).
 */
export function DesktopHero() {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1.05, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="w-full bg-[#F5F3EF] dark:bg-[#121212] text-black dark:text-white min-h-[calc(100vh-6rem)] flex items-stretch select-none overflow-hidden rounded-none m-0 border-none p-0 shadow-none relative">
      
      {/* Left Side (40%): Premium Typography, Spacing, and CTA */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-[40%] flex flex-col justify-center items-start text-left pl-[50px] pr-space-5 bg-[#F5F3EF] dark:bg-[#121212] gap-space-5 rounded-none border-none shadow-none m-0 p-0"
      >
        <motion.span
          variants={textVariants}
          className="font-display text-[16px] italic font-normal text-[#1a1a1a] dark:text-[#F8F7F5] leading-none"
        >
          Considered pieces, quietly made.
        </motion.span>
        
        <motion.h1
          variants={textVariants}
          className="font-display text-[40px] leading-[1.3] font-normal tracking-tight text-[#1a1a1a] dark:text-[#F8F7F5] max-w-lg"
        >
          An edit of essentials, refined for everyday. Where less becomes more, crafted with quiet luxury.
        </motion.h1>
        
        <motion.div variants={textVariants} className="mt-space-3">
          <Link 
            href="/collections/men" 
            className="inline-flex items-center justify-center bg-[#1a1a1a] hover:bg-neutral-800 text-white font-sans text-small font-semibold uppercase tracking-[0.1em] py-[16px] px-[32px] rounded-none transition-colors duration-300 ease-out-quart"
          >
            SHOP NEW ARRIVALS
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Side (60%): Large Full-Height Editorial Photograph with CSS Blending Mask */}
      <div 
        className="w-[60%] relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-none border-none shadow-none m-0 p-0"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%)"
        }}
      >
        <motion.div
          variants={imageVariants}
          initial="initial"
          animate="animate"
          className="w-full h-full relative"
        >
          <Image
            src="/assets/hero/hero-modeon-main.png"
            alt="Modeon Editorial Campaign Look"
            fill
            priority
            sizes="60vw"
            className="object-cover object-center rounded-none"
            unoptimized
          />
        </motion.div>
        
        {/* Season Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1.0 }}
          className="absolute bottom-space-5 right-space-5 z-10 text-white font-sans text-[12px] font-semibold uppercase tracking-[0.1em]"
        >
          SPRING / SUMMER 24
        </motion.div>
      </div>

      {/* Floating Brand Mark "N" Badge at bottom-left */}
      <motion.div
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        className="absolute bottom-6 left-[60px] h-9 w-9 rounded-full bg-[#1a1a1a] text-[#F5F3EF] flex items-center justify-center font-display text-[15px] select-none shadow-xs z-10"
      >
        N
      </motion.div>
    </section>
  );
}

DesktopHero.displayName = "DesktopHero";
