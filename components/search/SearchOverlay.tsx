"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchProducts } from "@/lib/actions/search-actions";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_KEYWORDS = ["Knitwear", "Outerwear", "Shirt", "Trouser", "Sunglasses", "Bag"];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Fetch products when overlay opens
  React.useEffect(() => {
    if (isOpen) {
      getSearchProducts().then((res) => {
        setProducts(res);
      });
      // Autofocus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    inputRef.current?.focus();
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 backdrop-blur-xs"
          />

          {/* Slide down search panel */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 max-h-[85vh] bg-[#F5F3EF] dark:bg-[#121212] border-b border-neutral-200 dark:border-neutral-800 z-55 overflow-y-auto pt-[calc(1.5rem+env(safe-area-inset-top))] pb-space-8 px-space-4 md:px-space-6 shadow-modal select-none scrollbar-none"
          >
            <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
              {/* Close Button */}
              <div className="flex justify-end items-center">
                <button
                  onClick={onClose}
                  aria-label="Close search overlay"
                  className="p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-base cursor-pointer"
                >
                  <X className="h-6 w-6 stroke-[1.5px]" />
                </button>
              </div>

              {/* Input container */}
              <div className="max-w-2xl mx-auto w-full flex flex-col items-center gap-space-4 mt-space-2">
                <h2 className="font-display text-[22px] md:text-[28px] font-normal text-neutral-900 dark:text-white tracking-widest uppercase text-center">
                  Search Catalog
                </h2>

                <div className="relative w-full border-b border-neutral-300 dark:border-neutral-800 focus-within:border-black dark:focus-within:border-white transition-colors duration-300 py-space-2.5 flex items-center gap-space-2 bg-transparent">
                  <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500 stroke-[1.5px]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by category, item name or silhouettes..."
                    className="w-full bg-transparent text-neutral-900 dark:text-white font-sans text-body placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-hidden"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search query"
                      className="text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors p-1"
                    >
                      <X className="h-4 w-4 stroke-[2px]" />
                    </button>
                  )}
                </div>

                {/* Trending tags */}
                <div className="flex flex-wrap items-center justify-center gap-x-space-3 gap-y-space-2 text-micro text-neutral-500">
                  <span className="font-sans font-medium uppercase tracking-wider text-[10px]">Trending:</span>
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => handleKeywordClick(kw)}
                      className="font-sans border border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors py-1 px-space-3 text-neutral-600 dark:text-neutral-400 rounded-none cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results area */}
              <div className="mt-space-4 w-full">
                {query && (
                  <div className="flex flex-col gap-space-4">
                    <div className="border-b border-neutral-200 dark:border-neutral-800 pb-space-2">
                      <span className="font-sans text-small text-neutral-500 font-medium">
                        Showing {filteredProducts.length} results for &quot;{query}&quot;
                      </span>
                    </div>

                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-4 md:gap-space-5">
                        {filteredProducts.slice(0, 8).map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-space-6 flex flex-col items-center text-center gap-space-2">
                        <p className="font-sans text-body text-neutral-500">
                          No items match your search for &quot;{query}&quot;.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
