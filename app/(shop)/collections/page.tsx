"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

const COLLECTIONS = [
  {
    num: "01",
    title: "Men's Collection",
    slug: "men",
    description: "Considered structures, minimal outerwear, and premium cashmere knitwear tailored for the modern frame.",
    image: "/assets/collections/men-collection-cover.jpg",
    link: "/collections/men"
  },
  {
    num: "02",
    title: "Women's Collection",
    slug: "women",
    description: "Sartorial tailoring, fluid silk dresses, and quiet cashmeres designed with structural purity.",
    image: "/assets/collections/women-collection-cover.jpg",
    link: "/collections/women"
  },
  {
    num: "03",
    title: "Accessories Collection",
    slug: "accessories",
    description: "Fine calfskin leather goods, hand-polished bio-acetate eyewear, and travel watch cases.",
    image: "/assets/collections/accessories-collection-cover.jpg",
    link: "/collections/accessories"
  }
];

export default function CollectionsLandingPage() {
  const breadcrumbs = [{ label: "Collections" }];

  return (
    <div className="bg-background min-h-screen text-primary select-none">
      {/* Breadcrumbs path */}
      <div className="border-b border-border/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-6 md:py-space-8 flex flex-col gap-space-8 md:gap-space-10">
        
        {/* Editorial Header Block */}
        <div className="flex flex-col items-start gap-space-2 max-w-xl">
          <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
            Catalog Overview
          </span>
          <h1 className="font-display text-[44px] md:text-[56px] leading-[1.1] font-normal text-primary tracking-tight">
            The Collections
          </h1>
          <p className="font-sans text-body text-muted leading-relaxed mt-space-2">
            An edit of everyday essentials, structural outerwear, and premium leather accessories. Hand-selected and quietly crafted to endure across seasons.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6 lg:gap-space-8">
          {COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="group flex flex-col items-start gap-space-4 relative"
            >
              {/* Image Frame with Zoom Overlay */}
              <Link href={col.link} className="w-full relative aspect-3/4 overflow-hidden bg-surface block">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out-quart"
                  unoptimized
                />
              </Link>

              {/* Text Metadata Panel */}
              <div className="flex flex-col items-start gap-space-2 mt-space-1 w-full">
                <div className="flex items-baseline justify-between w-full">
                  <span className="font-sans text-[11px] font-semibold text-muted uppercase tracking-widest">
                    {col.num}
                  </span>
                </div>
                <h2 className="font-display text-[24px] md:text-[28px] font-normal leading-tight text-primary group-hover:text-muted transition-colors">
                  {col.title}
                </h2>
                <p className="font-sans text-[14px] text-muted leading-relaxed min-h-[50px]">
                  {col.description}
                </p>
                <Link
                  href={col.link}
                  className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-primary pb-0.5 mt-space-2 group-hover:text-muted group-hover:border-muted transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Editorial Campaign Banner (uses campaign-hero.png) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative aspect-16/9 md:aspect-21/9 lg:aspect-[3/1] bg-surface overflow-hidden flex flex-col justify-end p-space-4 md:p-space-6 lg:p-space-8 text-primary mt-space-4"
        >
          <Image
            src="/assets/hero/campaign-hero.png"
            alt="Atelier Campaign Lookbook"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-90"
            unoptimized
          />
          <div className="relative z-10 flex flex-col items-start gap-space-2 max-w-md">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Visual Diary
            </span>
            <h3 className="font-display text-[28px] md:text-[36px] font-normal leading-tight text-primary">
              The Atelier Lookbook
            </h3>
            <p className="font-sans text-[14px] text-muted leading-relaxed">
              Sartorial compositions, hand-woven wool coats, and modern draping styled for the daily frame.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
