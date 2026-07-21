"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Editorial Image component with a slow, cinematic parallax shift.
 * Keeps the translation subtle and performant (using GPU-accelerated style transforms).
 */
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Very subtle translation to create premium 3D depth without layout shift
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <motion.div
        style={{ y, height: "110%", top: "-5%", willChange: "transform" }}
        className="absolute inset-0 w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center"
          unoptimized
        />
      </motion.div>
    </div>
  );
}

/**
 * Editorial sections with magazine-inspired alternating layouts.
 * All images use the premium viewport zoom-out entry reveal.
 */
export function EditorialSections() {
  // Cascading stagger variants for text rows
  const textContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const textItem = {
    initial: { opacity: 0, y: 15 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  // Common image reveal configuration
  const imageReveal = {
    initial: { scale: 1.12, opacity: 0 },
    whileInView: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 1.6, 
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] 
      }
    }
  };

  return (
    <section 
      className="w-full bg-[#F5F3EF] dark:bg-[#121212] relative py-space-8 select-none flex flex-col gap-space-8 md:gap-space-10 overflow-hidden transition-colors duration-300"
      style={{ clipPath: "inset(0)" }}
    >
      
      {/* Fixed Parallax Mountain Background Layer (Light mode: 80% opacity, Dark mode: 15% opacity blending) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-80 dark:opacity-15 transition-opacity duration-300"
        style={{
          backgroundImage: "url('/assets/editorial/mountain-bg.png')",
        }}
      />

      {/* 1. Women's Structured Leather Campaign */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <div className="lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-female-1.jpg"
              alt="Structured Leather campaign details"
            />
          </motion.div>
        </div>

        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="lg:col-span-5 flex flex-col items-start gap-space-4 lg:pl-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 01 — Structure
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            Structured Leather & Silhouette
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            A study in raw tailoring, soft-crouch leather structures, and dark tortoiseshell accents designed to sit cleanly on the form. Re-engineered classics built for seasonal transition.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/women"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Explore Women&apos;s Edit
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Men's Modern Tailoring */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start gap-space-4 lg:pr-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 02 — Sartorial
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            Modern Tailoring, Reimagined
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Form meets utility in modern menswear essentials. Classic structures softened by premium draping and lightweight textures, refined for comfortable everyday dressing without sacrificing luxury styling.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/men"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Explore Men&apos;s Edit
            </Link>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2 lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-male-1.jpg"
              alt="Editorial Campaign Look Menswear"
            />
          </motion.div>
        </div>
      </div>

      {/* 3. The Art of Slow Living */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <div className="lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-female-2.jpg"
              alt="Draped knitwear visual"
            />
          </motion.div>
        </div>

        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="lg:col-span-5 flex flex-col items-start gap-space-4 lg:pl-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 03 — Draping
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            The Art of Slow Living
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Exploring the intersections of deliberate design, quiet spaces, and structured organic textures that form the foundation of our seasonal edits. Light wool pullovers and cotton trousers meant for slow days.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/women"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Shop Knitwear Edits
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. Natural Textures & Tones */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start gap-space-4 lg:pr-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 04 — Sourcing
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            Natural Textures & Hues
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            An in-depth look at our textile sourcing guidelines, prioritizing undyed wool, pure cashmere, and GOTS-certified organic linen. Soft neutrals that sit comfortably against the skin.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/men"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Shop Menswear
            </Link>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2 lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-male-2.jpg"
              alt="Menswear knitwear fabric detailing"
            />
          </motion.div>
        </div>
      </div>

      {/* 5. A Study in Silhouette */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <div className="lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-female-3.jpg"
              alt="Modern womenswear styling silhouette"
            />
          </motion.div>
        </div>

        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="lg:col-span-5 flex flex-col items-start gap-space-4 lg:pl-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 05 — Silhouette
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            A Study in Silhouette
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Transitioning traditional tailored frameworks into fluid, unrestrictive cuts. Outerwear wraps and tailored shirts designed to flow with standard daily movements while retaining their structure.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/women"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Shop Structured Edits
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 6. Sculpted Eyewear */}
      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center relative z-10">
        <motion.div 
          variants={textContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10px" }}
          className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start gap-space-4 lg:pr-space-5"
        >
          <motion.span variants={textItem} className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Study No. 06 — Finish
          </motion.span>
          <motion.h2 variants={textItem} className="font-display text-[28px] md:text-[36px] lg:text-[44px] leading-tight font-normal text-neutral-900 dark:text-[#F8F7F5] transition-colors">
            Sculpted Eyewear & Details
          </motion.h2>
          <motion.p variants={textItem} className="font-sans text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
            Highlighting the minimalist metal details, warm amber acetate shades, and balanced dimensions defining our seasonal accessories. Made to complete the quiet luxury look.
          </motion.p>
          <motion.div variants={textItem} className="mt-space-2">
            <Link 
              href="/collections/accessories"
              className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black dark:border-[#F8F7F5] pb-1 text-neutral-900 dark:text-[#F8F7F5] hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors"
            >
              Shop Accessories
            </Link>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2 lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <motion.div
            variants={imageReveal}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10px" }}
            className="w-full h-full"
          >
            <ParallaxImage
              src="/assets/editorial/editorial-male-3.jpg"
              alt="Acetate eyewear details visual"
            />
          </motion.div>
        </div>
      </div>

    </section>
  );
}

EditorialSections.displayName = "EditorialSections";
