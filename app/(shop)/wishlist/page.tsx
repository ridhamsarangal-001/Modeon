"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";

export default function WishlistPage() {
  const breadcrumbs = [{ label: "Wishlist" }];

  return (
    <div className="bg-[#F5F3EF] min-h-screen text-black select-none">
      {/* Breadcrumbs path */}
      <div className="border-b border-neutral-200/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-10 md:py-space-12 flex flex-col items-center text-center">
        
        {/* Wishlist Placeholder Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md flex flex-col items-center gap-space-4"
        >
          <span className="font-sans text-micro tracking-widest uppercase text-neutral-400 font-semibold">
            Saved Edits
          </span>
          <h1 className="font-display text-display leading-tight font-normal text-neutral-900">
            Your Wishlist
          </h1>
          <p className="font-sans text-body text-neutral-500 leading-relaxed max-w-xs">
            Your saved items list is empty. Explore our signature edits and collections to save items for future selections.
          </p>
          <div className="mt-space-4">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white font-sans text-small font-semibold uppercase tracking-wider py-space-3 px-space-8 rounded-none transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
