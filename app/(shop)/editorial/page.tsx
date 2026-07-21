"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

const JOURNAL_POSTS = [
  {
    id: "journal-1",
    category: "Sartorial Study",
    title: "The Art of Slow Living",
    date: "July 12, 2026",
    excerpt: "Exploring the intersections of deliberate design, quiet spaces, and structured organic textures that form the foundation of our Autumn capsule.",
    image: "/assets/editorial/editorial-female-2.jpg"
  },
  {
    id: "journal-2",
    category: "Materiality",
    title: "Deliberate Textures & Natural Hues",
    date: "June 28, 2026",
    excerpt: "An in-depth look at our textile sourcing guidelines, prioritizing undyed wool, pure cashmere, and GOTS-certified organic linen.",
    image: "/assets/editorial/editorial-male-2.jpg"
  },
  {
    id: "journal-3",
    category: "Campaigns",
    title: "A Study in Silhouette: Modern Workwear",
    date: "May 15, 2026",
    excerpt: "Transitioning traditional tailored frameworks into fluid, unrestrictive cuts designed to flow with standard daily movements.",
    image: "/assets/editorial/editorial-female-3.jpg"
  },
  {
    id: "journal-4",
    category: "Detailing",
    title: "Sculpted Eyewear: Shape & Focus",
    date: "April 02, 2026",
    excerpt: "Highlighting the minimalist metal details, warm amber acetate shades, and balanced dimensions defining our seasonal accessories capsule.",
    image: "/assets/editorial/editorial-male-3.jpg"
  }
];

export default function EditorialPage() {
  const breadcrumbs = [{ label: "Editorial" }];

  return (
    <div className="bg-[#F5F3EF] min-h-screen text-black select-none">
      {/* Breadcrumbs link path */}
      <div className="border-b border-neutral-200/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Top Editorial Visual Banner (uses hero-main.jpg) */}
      <div className="w-full relative h-[40vh] md:h-[50vh] bg-neutral-200 overflow-hidden">
        <Image
          src="/assets/hero/hero-main.jpg"
          alt="Editorial Lookbook Header visual"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-space-4 md:p-space-6 lg:p-space-8 text-white">
          <span className="font-sans text-micro tracking-[0.25em] uppercase text-neutral-300 font-semibold mb-1">
            ATELIER READINGS
          </span>
          <h2 className="font-display text-[32px] md:text-[44px] lg:text-[56px] font-normal leading-none text-white tracking-tight">
            Modeon Journal
          </h2>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-6 md:py-space-8 flex flex-col gap-space-8 md:gap-space-10">
        
        {/* Page Banner Header */}
        <div className="flex flex-col items-start gap-space-2 max-w-lg mt-space-2">
          <span className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
            Essays & Studies
          </span>
          <p className="font-sans text-body text-neutral-600 leading-relaxed">
            A repository of seasonal lookbooks, reflections on organic fabric sourcing, and our core philosophy of quiet luxury.
          </p>
        </div>

        {/* Alternate Editorial Row Blocks */}
        <div className="flex flex-col gap-space-8 md:gap-space-10">
          {JOURNAL_POSTS.map((post, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 lg:gap-space-8 items-center"
              >
                {/* Image Block */}
                <div className={`lg:col-span-7 relative aspect-4/5 md:aspect-3/2 lg:aspect-4/3 overflow-hidden bg-neutral-100 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center hover:scale-102 transition-transform duration-700 ease-out-quart"
                    unoptimized
                  />
                </div>

                {/* Text Block */}
                <div className={`lg:col-span-5 flex flex-col items-start gap-space-3 ${isEven ? "lg:order-2 lg:pl-space-5" : "lg:order-1 lg:pr-space-5"}`}>
                  <span className="font-sans text-micro tracking-widest uppercase text-neutral-500 font-semibold">
                    {post.category}
                  </span>
                  <h2 className="font-display text-h1 md:text-[32px] leading-tight font-normal text-neutral-900">
                    {post.title}
                  </h2>
                  <span className="font-sans text-micro text-neutral-400">
                    {post.date}
                  </span>
                  <p className="font-sans text-body leading-relaxed text-neutral-600 mt-space-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-space-2">
                    <span className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-black pb-0.5 cursor-pointer hover:text-neutral-600 hover:border-neutral-600 transition-colors">
                      Read Essay
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Campaign visual banner (uses hero-3.jpg) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative aspect-16/9 md:aspect-21/9 lg:aspect-[3/1] bg-neutral-200 overflow-hidden flex flex-col justify-end p-space-4 md:p-space-6 lg:p-space-8 text-white mt-space-4"
        >
          <Image
            src="/assets/hero/hero-3.jpg"
            alt="Autumn Campaign visual"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-95"
            unoptimized
          />
          <div className="relative z-10 flex flex-col items-start gap-space-1 max-w-md">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
              Seasonal Preview
            </span>
            <h3 className="font-display text-h1 font-normal leading-tight text-white">
              The Essential Edit
            </h3>
            <p className="font-sans text-small text-neutral-200 leading-relaxed">
              Quiet confidence, structural purity, and fabrics woven to breathe.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
