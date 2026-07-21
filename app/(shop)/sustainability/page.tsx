"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Container } from "@/components/ui/Container";

export default function SustainabilityPage() {
  const breadcrumbs = [{ label: "Sustainability" }];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  } as const;

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true, margin: "-50px" }
  } as const;

  return (
    <div className="bg-[#F5F3EF] [.dark_&]:bg-[#121212] min-h-screen text-primary select-none transition-colors duration-300 pb-space-7">
      {/* Breadcrumbs link path */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Container className="py-space-5 md:py-space-6 flex flex-col gap-space-7 md:gap-space-8">
        
        {/* Editorial Page Header */}
        <div className="flex flex-col items-center text-center mt-space-3 md:mt-space-4">
          <span className="font-sans text-micro tracking-[0.25em] uppercase text-muted font-semibold mb-2 md:mb-3">
            Our Commitments
          </span>
          <h1 className="font-display text-[36px] md:text-[54px] lg:text-[72px] tracking-tight font-light text-primary uppercase leading-none">
            Sustainability
          </h1>
          <p className="font-sans text-body-lg md:text-h3 text-muted max-w-[650px] font-light leading-relaxed tracking-wide mt-space-3">
            Longevity as the ultimate form of resistance. A deliberate study in materials, ethical craft, and circular horizons.
          </p>
        </div>

        {/* Thin Divider */}
        <div className="w-full border-b border-border/80" />

        {/* 1. Our Philosophy */}
        <motion.div {...fadeIn} className="flex flex-col gap-space-4">
          <div className="relative w-full aspect-16/9 md:aspect-21/9 overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900">
            <Image
              src="/assets/editorial/mountain-bg.png"
              alt="Serene mountain backdrop representing slow nature and longevity"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-95"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-space-4 md:p-space-6 text-white">
              <span className="font-sans text-micro tracking-[0.2em] uppercase text-neutral-300 font-semibold mb-1">
                The Slow Manifesto
              </span>
              <h2 className="font-display text-h1 md:text-[32px] lg:text-[44px] leading-tight font-light">
                Our Philosophy
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-4 mt-space-2">
            <div className="lg:col-span-4">
              <h3 className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
                01 / Longevity & Intention
              </h3>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-space-3">
              <p className="font-sans text-body-lg leading-relaxed text-muted font-light">
                We believe that the most sustainable garment is the one that already exists—and the ones built to last generations. Our design process rejects the hyper-accelerated cycles of trend-based fashion in favor of timeless, structurally sound objects.
              </p>
              <p className="font-sans text-body leading-relaxed text-muted/80">
                By investing heavily in fiber quality, premium tailoring, and classic shapes, we aim to build a wardrobe that is shared across generations. True luxury is not disposable; it is a long-term partnership with the earth and its makers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Horizontal separator */}
        <div className="w-full border-b border-border/40" />

        {/* 2. Responsible Materials */}
        <motion.div
          {...fadeIn}
          className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-center"
        >
          {/* Image Block */}
          <div className="lg:col-span-6 relative aspect-4/5 md:aspect-[3/2] lg:aspect-[4/5] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900 lg:order-1">
            <Image
              src="/assets/editorial/editorial-male-2.jpg"
              alt="Close-up of premium raw knit texture"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
              unoptimized
            />
          </div>
          {/* Text Block */}
          <div className="lg:col-span-6 flex flex-col items-start gap-space-3 lg:pl-space-5 lg:order-2">
            <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
              02 / Fiber Provenance
            </span>
            <h2 className="font-display text-h1 md:text-[32px] lg:text-[44px] leading-tight font-light text-primary">
              Responsible Materials
            </h2>
            <p className="font-sans text-body-lg leading-relaxed text-muted mt-space-1 font-light">
              We source only natural, regenerative, or recycled fibers. Our core collections center on undyed mongolian cashmere, GOTS-certified organic linen, and bio-derived silk.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted/80">
              By utilizing undyed wools and organic plant fibers, we significantly reduce water contamination and chemical use in dye processing. Every material is selected for its biodegradability, texture, and ability to grow softer over years of wear.
            </p>
          </div>
        </motion.div>

        {/* Horizontal separator */}
        <div className="w-full border-b border-border/40" />

        {/* 3. Craftsmanship */}
        <motion.div
          {...fadeIn}
          className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-center"
        >
          {/* Text Block */}
          <div className="lg:col-span-6 flex flex-col items-start gap-space-3 lg:pr-space-5 lg:order-1">
            <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
              03 / Heritage & Scale
            </span>
            <h2 className="font-display text-h1 md:text-[32px] lg:text-[44px] leading-tight font-light text-primary">
              Craftsmanship
            </h2>
            <p className="font-sans text-body-lg leading-relaxed text-muted mt-space-1 font-light">
              Our garments are created in small, family-owned heritage ateliers in Italy and Japan. We prioritize human craft and manual intelligence over industrial speed.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted/80">
              Each piece is assembled in small batches. This reduces textile waste from overproduction and supports specialized techniques like hand-rolled hems, hand-linked knitwear, and custom brass hardware. We preserve generational knowledge, ensuring craftsmen are valued as true artisans.
            </p>
          </div>
          {/* Image Block */}
          <div className="lg:col-span-6 relative aspect-4/5 md:aspect-[3/2] lg:aspect-[4/5] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900 lg:order-2">
            <Image
              src="/assets/editorial/editorial-female-1.jpg"
              alt="Designer working inside a bright creative studio space"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
              unoptimized
            />
          </div>
        </motion.div>

        {/* Horizontal separator */}
        <div className="w-full border-b border-border/40" />

        {/* 4. Ethical Production */}
        <motion.div
          {...fadeIn}
          className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-center"
        >
          {/* Image Block */}
          <div className="lg:col-span-6 relative aspect-4/5 md:aspect-[3/2] lg:aspect-[4/5] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900 lg:order-1">
            <Image
              src="/assets/editorial/editorial-male-1.jpg"
              alt="Portrait of an artisan designer in minimalist apparel"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
              unoptimized
            />
          </div>
          {/* Text Block */}
          <div className="lg:col-span-6 flex flex-col items-start gap-space-3 lg:pl-space-5 lg:order-2">
            <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
              04 / Human Dignity
            </span>
            <h2 className="font-display text-h1 md:text-[32px] lg:text-[44px] leading-tight font-light text-primary">
              Ethical Production
            </h2>
            <p className="font-sans text-body-lg leading-relaxed text-muted mt-space-1 font-light">
              We stand for safe environments, clear traceability, and living wages. Our production partners sign a strict Code of Conduct upholding highest labor standards.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted/80">
              We audit each atelier multiple times a year, verifying workers are paid above the living wage and work in supportive, safe conditions. By fostering deep, long-term relationships with our factories, we ensure true collaboration, security, and stability.
            </p>
          </div>
        </motion.div>

        {/* Horizontal separator */}
        <div className="w-full border-b border-border/40" />

        {/* 5. Packaging & Shipping */}
        <motion.div
          {...fadeIn}
          className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-center"
        >
          {/* Text Block */}
          <div className="lg:col-span-6 flex flex-col items-start gap-space-3 lg:pr-space-5 lg:order-1">
            <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
              05 / Circulated Operations
            </span>
            <h2 className="font-display text-h1 md:text-[32px] lg:text-[44px] leading-tight font-light text-primary">
              Packaging & Shipping
            </h2>
            <p className="font-sans text-body-lg leading-relaxed text-muted mt-space-1 font-light">
              Our packaging is designed to return to the earth. We ship inside FSC-certified, 100% recycled paper boxes and secure garments in organic cotton dustbags.
            </p>
            <p className="font-sans text-body leading-relaxed text-muted/80">
              We never use plastic polybags. Furthermore, all customer shipping is carbon offset through investments in regional forest management projects. Our logistical partners are selected exclusively for their commitment to circular, low-carbon transport.
            </p>
          </div>
          {/* Image Block */}
          <div className="lg:col-span-6 relative aspect-4/5 md:aspect-[3/2] lg:aspect-[4/5] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900 lg:order-2">
            <Image
              src="/assets/editorial/editorial-female-3.jpg"
              alt="Modern geometric visual crop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
              unoptimized
            />
          </div>
        </motion.div>

        {/* Horizontal separator */}
        <div className="w-full border-b border-border/40" />

        {/* 6. Future Commitments */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col gap-space-5"
        >
          <div className="flex flex-col gap-space-2 text-center max-w-[600px] mx-auto mb-space-3">
            <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
              06 / Looking Forward
            </span>
            <h2 className="font-display text-h1 md:text-[32px] leading-tight font-light text-primary">
              Future Commitments
            </h2>
            <p className="font-sans text-body text-muted">
              We hold ourselves accountable to measurable, progressive change. These are our targets for the next five years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-4">
            <motion.div
              variants={fadeIn}
              className="flex flex-col gap-space-2 p-space-4 border border-border/80 [.dark_&]:border-border/20 rounded-none bg-surface/30 [.dark_&]:bg-surface-dark/30 hover:border-accent transition-colors duration-300"
            >
              <span className="font-sans text-micro uppercase text-accent font-semibold tracking-wider">
                Target 2027
              </span>
              <h3 className="font-display text-h3 font-normal text-primary">
                100% Traceable Fibers
              </h3>
              <p className="font-sans text-small text-muted leading-relaxed">
                Expanding digital product passports (DPPs) to 100% of our products, enabling customers to scan a code and trace every step from farm to atelier.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col gap-space-2 p-space-4 border border-border/80 [.dark_&]:border-border/20 rounded-none bg-surface/30 [.dark_&]:bg-surface-dark/30 hover:border-accent transition-colors duration-300"
            >
              <span className="font-sans text-micro uppercase text-accent font-semibold tracking-wider">
                Target 2028
              </span>
              <h3 className="font-display text-h3 font-normal text-primary">
                Circular Lifetime Care
              </h3>
              <p className="font-sans text-small text-muted leading-relaxed">
                Implementing a formal lifetime repair, recycle, and buyback program for all Modeon items, ensuring no garment from our brand ends up in a landfill.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col gap-space-2 p-space-4 border border-border/80 [.dark_&]:border-border/20 rounded-none bg-surface/30 [.dark_&]:bg-surface-dark/30 hover:border-accent transition-colors duration-300"
            >
              <span className="font-sans text-micro uppercase text-accent font-semibold tracking-wider">
                Target 2030
              </span>
              <h3 className="font-display text-h3 font-normal text-primary">
                Absolute Net Zero
              </h3>
              <p className="font-sans text-small text-muted leading-relaxed">
                Achieving absolute carbon neutrality across our entire supply chain (Scope 1, 2, and 3 emissions), with no reliance on carbon offset credits.
              </p>
            </motion.div>
          </div>
        </motion.div>

      </Container>
    </div>
  );
}
