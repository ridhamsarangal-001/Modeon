"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Container } from "@/components/ui/Container";

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
  const breadcrumbs = [{ label: "Journal" }];
  const featuredPost = JOURNAL_POSTS[0];
  const remainingPosts = JOURNAL_POSTS.slice(1);

  return (
    <div className="bg-[#F5F3EF] [.dark_&]:bg-[#121212] min-h-screen text-primary select-none transition-colors duration-300">
      {/* Breadcrumbs link path */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Container className="py-space-5 md:py-space-6 flex flex-col">
        {/* Minimal Editorial Header */}
        <div className="flex flex-col items-center text-center mt-space-3 md:mt-space-4 mb-space-5 md:mb-space-6">
          <span className="font-sans text-micro tracking-[0.25em] uppercase text-muted font-semibold mb-2 md:mb-3">
            Atelier Readings
          </span>
          <h1 className="font-display text-[36px] md:text-[54px] lg:text-[72px] tracking-tight font-light text-primary uppercase leading-none">
            Modeon Journal
          </h1>
          <p className="font-sans text-body-lg md:text-h3 text-muted max-w-[650px] font-light leading-relaxed tracking-wide mt-space-3">
            A curated archive of seasonal reflections, material studies, and design philosophies from our creative atelier.
          </p>
        </div>

        {/* Thin Divider */}
        <div className="w-full border-b border-border/80 mb-space-6 md:mb-space-7" />

        {/* Featured Article (Top) */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-center mb-space-7 md:mb-space-8"
          >
            {/* Image Block */}
            <div className="lg:col-span-7 relative aspect-4/5 md:aspect-[3/2] lg:aspect-[1.5/1] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
                unoptimized
              />
            </div>

            {/* Text Block */}
            <div className="lg:col-span-5 flex flex-col items-start gap-space-3 lg:pl-space-5">
              <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
                {featuredPost.category}
              </span>
              <h2 className="font-display text-h1 md:text-[36px] lg:text-[44px] leading-tight font-light text-primary">
                {featuredPost.title}
              </h2>
              <span className="font-sans text-micro text-muted">
                {featuredPost.date}
              </span>
              <p className="font-sans text-body-lg leading-relaxed text-muted mt-space-1">
                {featuredPost.excerpt}
              </p>
              <div className="mt-space-2">
                <span className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-primary hover:text-accent hover:border-accent hover:border-b-accent pb-0.5 cursor-pointer transition-colors duration-300">
                  Read Essay
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clean Magazine-Style Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-space-5 gap-y-space-6 md:gap-y-space-7">
          {remainingPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col gap-space-3"
            >
              {/* Image Block */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 [.dark_&]:bg-neutral-900">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center hover:scale-[1.015] transition-transform duration-700 ease-out-quart"
                  unoptimized
                />
              </div>

              {/* Text Block */}
              <div className="flex flex-col items-start gap-space-2 mt-space-1">
                <span className="font-sans text-micro tracking-widest uppercase text-muted font-semibold">
                  {post.category}
                </span>
                <h3 className="font-display text-h2 md:text-h3 leading-snug font-normal text-primary hover:text-accent transition-colors duration-300 cursor-pointer">
                  {post.title}
                </h3>
                <span className="font-sans text-micro text-muted">
                  {post.date}
                </span>
                <p className="font-sans text-body leading-relaxed text-muted line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-space-2">
                  <span className="inline-flex items-center text-small font-semibold tracking-wider uppercase border-b border-primary hover:text-accent hover:border-accent hover:border-b-accent pb-0.5 cursor-pointer transition-colors duration-300">
                    Read Essay
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
