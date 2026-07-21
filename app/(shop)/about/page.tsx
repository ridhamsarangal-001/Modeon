"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

export default function AboutPage() {
  const breadcrumbs = [{ label: "About" }];

  return (
    <div className="bg-[#F5F3EF] [.dark_&]:bg-[#121212] min-h-screen text-primary select-none transition-colors duration-300">
      {/* Breadcrumbs path */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-6 md:py-space-8 flex flex-col gap-space-8 md:gap-space-10">
        
        {/* Core Header */}
        <div className="flex flex-col items-start gap-space-2 max-w-2xl">
          <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
            Our Story
          </span>
          <h1 className="font-display text-display leading-tight font-normal text-primary">
            Considered Pieces, Quietly Made
          </h1>
          <p className="font-sans text-body text-muted leading-relaxed mt-space-2">
            Modeon was founded on the belief that everyday clothing should be a quiet statement of character. We build garments that balance form and utility, crafted from the highest grade natural fibers.
          </p>
        </div>

        {/* Section 1: Philosophy Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900"
          >
            <Image
              src="/assets/collections/essentials.jpg"
              alt="About Campaign visual"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              unoptimized
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col items-start gap-space-4 lg:pl-space-5"
          >
            <h2 className="font-display text-h1 md:text-[36px] font-normal leading-tight text-primary">
              The Aesthetic of Silence
            </h2>
            <p className="font-sans text-body leading-relaxed text-muted">
              We design with restraint. By removing loud branding and superficial details, the focus is returned to the line, the structure, and the absolute quality of the fabric. Every shirt, trouser, and jacket is an edit of essentials, engineered to serve you daily.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted">
              Our color palette is strictly curated in stone, clay, olive, charcoal, beige, and warm neutrals, ensuring every seasonal capsule integrates seamlessly into previous releases.
            </p>
          </motion.div>
        </div>

        {/* Campaign full-width divider visual (uses hero-2.jpg) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative aspect-16/9 md:aspect-21/9 lg:aspect-[2.5/1] bg-neutral-200 [.dark_&]:bg-neutral-900 overflow-hidden"
        >
          <Image
            src="/assets/hero/hero-2.jpg"
            alt="Atelier Campaign Lookbook Portrait"
            fill
            sizes="100vw"
            className="object-cover object-top"
            unoptimized
          />
        </motion.div>

        {/* Section 2: Craftsmanship Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col items-start gap-space-4 lg:pr-space-5 order-2 lg:order-1"
          >
            <h2 className="font-display text-h1 md:text-[36px] font-normal leading-tight text-primary">
              Honoring Material Integrity
            </h2>
            <p className="font-sans text-body leading-relaxed text-muted">
              We source only natural fibers—organic linen, silk, merino wool, and pure cashmere. Our partners are boutique mills that honor heritage weaving techniques, ensuring that every garment has a distinct hand-feel and falls elegantly on the body.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted">
              Designed in-house, we release small capsule edits rather than massive collections, minimizing environmental waste and prioritizing durability above fast fashion trends.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/5 overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900 order-1 lg:order-2"
          >
            <Image
              src="/assets/collections/signature.jpg"
              alt="Tailoring details"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              unoptimized
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
