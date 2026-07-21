"use client";

import * as React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH2, TextSmall } from "@/components/ui/Typography";
import { cn } from "@/lib/utils/cn";

export interface BestSellersProps {
  products: Product[];
}

type TabType = "all" | "cat-men" | "cat-women" | "cat-accessories";

/**
 * BestSellers Client Component.
 * Implements category tabs with client-side filtering and scale/fade transition states.
 */
export function BestSellers({ products }: BestSellersProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("all");
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(products);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Categories definitions (mapping to catalog category IDs)
  const tabs = [
    { id: "all", label: "All Selections" },
    { id: "cat-men", label: "Men" },
    { id: "cat-women", label: "Women" },
    { id: "cat-accessories", label: "Accessories" },
  ] as const;

  // Handle Tab filter selections with delay animation state (Animation.md Section 60)
  const handleTabChange = (tabId: TabType) => {
    if (tabId === activeTab) return;
    
    setIsTransitioning(true);
    
    // Animate scale down and fade out, swap items, then scale up and fade in
    setTimeout(() => {
      setActiveTab(tabId);
      if (tabId === "all") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products.filter((p) => p.categoryId === tabId));
      }
      setIsTransitioning(false);
    }, 250); // Matches transition delays
  };

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark select-none">
      <Container className="flex flex-col gap-space-4">
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-3 border-b border-border dark:border-border-dark pb-space-3">
          <div className="flex flex-col gap-1">
            <HeadingH2 className="text-h2 font-semibold">
              Signature Pieces
            </HeadingH2>
            <TextSmall className="text-muted">
              Most considered selections of the week.
            </TextSmall>
          </div>

          {/* Filtering Tabs (horizontal scrollable on mobile) */}
          <div 
            className="flex items-center gap-space-1 overflow-x-auto scrollbar-none py-1 -mx-space-3 px-space-3 md:mx-0 md:px-0"
            role="tablist"
            aria-label="Filter best sellers"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "font-sans text-small px-space-3 py-space-1.5 rounded-full border border-transparent transition-all select-none hover:text-primary whitespace-nowrap",
                    isActive
                      ? "bg-primary text-background font-medium dark:bg-primary-dark dark:text-background-dark"
                      : "text-muted hover:border-border hover:bg-surface dark:hover:bg-surface-dark"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Products Grid with scale/fade animations */}
        <div
          className={cn(
            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-4 md:gap-space-5 transition-all duration-300 ease-out-quart transform",
            isTransitioning ? "opacity-0 scale-[0.96] blur-xs" : "opacity-100 scale-100 blur-none"
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

BestSellers.displayName = "BestSellers";
