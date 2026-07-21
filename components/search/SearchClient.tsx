"use client";

import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface SearchClientProps {
  products: Product[];
}

const TRENDING_KEYWORDS = ["Knitwear", "Outerwear", "Shirt", "Trouser", "Sunglasses", "Bag"];

export function SearchClient({ products }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
  };

  const filteredProducts = products.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return false;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.categoryId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1440px] mx-auto px-space-4 md:px-space-5 lg:px-space-6 py-space-6 md:py-space-8 select-none">
      
      {/* Search Bar Input Container */}
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-space-4 mb-space-8">
        <h1 className="font-display text-[28px] md:text-[36px] font-normal text-neutral-950 tracking-tight text-center">
          Search Modeon
        </h1>
        
        <div className="relative w-full border-b border-neutral-300 focus-within:border-black transition-colors duration-300 py-space-2.5 flex items-center gap-space-2 bg-transparent">
          <Search className="h-5 w-5 text-neutral-400 stroke-[1.5px]" />
          <input
            type="text"
            value={query}
            onChange={(e) => startTransition(() => setQuery(e.target.value))}
            placeholder="Search by category, item name or silhouettes..."
            className="w-full bg-transparent text-neutral-900 font-sans text-body placeholder-neutral-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="text-neutral-400 hover:text-black transition-colors p-1"
            >
              <X className="h-4 w-4 stroke-[2px]" />
            </button>
          )}
        </div>

        {/* Trending Tags suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-x-space-3 gap-y-space-2 text-small text-neutral-500">
          <span className="font-sans font-medium uppercase tracking-wider text-[11px]">Trending:</span>
          {TRENDING_KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => handleKeywordClick(kw)}
              className="font-sans border border-neutral-300 hover:border-black hover:text-black transition-colors py-1 px-space-3 text-neutral-600 rounded-none cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results Block */}
      <div>
        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-space-8 flex flex-col items-center text-center gap-space-2"
            >
              <p className="font-sans text-body text-neutral-500">
                Begin typing to search our curated catalog.
              </p>
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key="results-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-space-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-space-3">
                <span className="font-sans text-small text-neutral-500 font-medium">
                  Showing {filteredProducts.length} results for &quot;{query}&quot;
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-4 md:gap-space-5 lg:gap-space-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-space-10 flex flex-col items-center text-center gap-space-3"
            >
              <p className="font-sans text-body text-neutral-500">
                No items match your search for &quot;{query}&quot;.
              </p>
              <button
                onClick={() => setQuery("")}
                className="font-sans text-small font-semibold border-b border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors uppercase tracking-wider"
              >
                Clear Search & Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
