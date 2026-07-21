"use client";

import * as React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH1, TextSmall } from "@/components/ui/Typography";
import { cn } from "@/lib/utils/cn";

export interface ProductListProps {
  initialProducts: Product[];
  categoryLabel: string;
}

type SortType = "featured" | "price-asc" | "price-desc";

/**
 * ProductList Client Component.
 * Orchestrates client-side sorting, subcategory filtering, and animations.
 */
export function ProductList({ initialProducts, categoryLabel }: ProductListProps) {
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<SortType>("featured");
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Extract unique subcategories from products list
  const subcategories = React.useMemo(() => {
    return Array.from(new Set(initialProducts.map((p) => p.subCategory)));
  }, [initialProducts]);

  // Handle subcategory filter toggles
  const handleSubcategoryToggle = (sub: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedSubcategories((prev) => {
        if (prev.includes(sub)) {
          return prev.filter((item) => item !== sub);
        } else {
          return [...prev, sub];
        }
      });
      setIsTransitioning(false);
    }, 200);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedSubcategories([]);
      setIsTransitioning(false);
    }, 200);
  };

  // Filter & Sort logic
  const processedProducts = React.useMemo(() => {
    let list = [...initialProducts];

    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      list = list.filter((p) => selectedSubcategories.includes(p.subCategory));
    }

    // Sort products
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } // "featured" maintains initial seeding order from catalog.json

    return list;
  }, [initialProducts, selectedSubcategories, sortBy]);

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark min-h-[70vh] select-none">
      <Container className="flex flex-col gap-space-4">
        
        {/* Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-3 border-b border-border dark:border-border-dark pb-space-3">
          <div className="flex flex-col gap-1 text-left">
            <HeadingH1 className="font-display text-h1 font-medium tracking-tight text-primary leading-tight">
              {categoryLabel}
            </HeadingH1>
            <TextSmall className="text-muted">
              {processedProducts.length} {processedProducts.length === 1 ? "piece" : "pieces"} found
            </TextSmall>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-space-2 text-small font-sans text-primary">
            <label htmlFor="plp-sort" className="font-medium shrink-0">
              Sort By:
            </label>
            <select
              id="plp-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xs px-3 py-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Layout split: Sidebar Filters (left) & Products Grid (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 items-start">
          
          {/* Filters Panel (3-cols span) */}
          <aside className="lg:col-span-3 flex flex-col gap-space-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-base p-space-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-space-2">
              <h2 className="font-sans text-body font-semibold text-primary uppercase tracking-wider">
                Filters
              </h2>
              {selectedSubcategories.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="font-sans text-micro text-accent hover:underline focus-visible:outline-hidden"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Subcategories Filter options */}
            <div className="flex flex-col gap-space-2">
              <span className="font-sans text-micro font-semibold text-muted uppercase tracking-wider mb-1">
                Subcategory
              </span>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {subcategories.map((sub) => {
                  const isChecked = selectedSubcategories.includes(sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => handleSubcategoryToggle(sub)}
                      className={cn(
                        "font-sans text-small px-3 py-1.5 lg:px-2 lg:py-1 rounded-full lg:rounded-xs border text-left flex items-center justify-between transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent",
                        isChecked
                          ? "bg-primary text-background border-primary dark:bg-primary-dark dark:text-background-dark font-medium"
                          : "bg-surface border-border text-muted hover:border-primary dark:bg-surface-dark"
                      )}
                    >
                      <span>{sub}</span>
                      {isChecked && <span className="hidden lg:inline text-micro">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Products Grid (9-cols span) */}
          <main
            className={cn(
              "lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-space-4 md:gap-space-5 transition-all duration-300 ease-out-quart transform",
              isTransitioning ? "opacity-0 scale-[0.98] blur-xs" : "opacity-100 scale-100 blur-none"
            )}
          >
            {processedProducts.length === 0 ? (
              <div className="col-span-full py-space-6 text-center">
                <p className="font-sans text-body text-muted">
                  No selections match your active filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="font-sans text-small text-accent font-semibold hover:underline mt-2"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              processedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </main>

        </div>
      </Container>
    </Section>
  );
}

ProductList.displayName = "ProductList";
