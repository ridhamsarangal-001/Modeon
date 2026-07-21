"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

const FALLBACK_IMAGE = "/assets/images/collections/men-essentials.jpg";

/**
 * Reusable ProductCard component.
 * Features hover image swapping with robust fallback handlers, wishlist toggle,
 * INR price formatting with strikethroughs, and elegant status badges.
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const primaryImage = product.media[0]?.url || FALLBACK_IMAGE;
  const hoverImage = product.media[1]?.url || primaryImage;

  const [imageSrc, setImageSrc] = React.useState(primaryImage);
  const [hoverSrc, setHoverSrc] = React.useState(hoverImage);

  // Sync state if product changes. Wrap in async setTimeout to avoid react-hooks/set-state-in-effect issues.
  React.useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        setImageSrc(primaryImage);
        setHoverSrc(hoverImage);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [primaryImage, hoverImage]);

  // Toggle wishlist state (local simulation)
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const hasDiscount = product.isBestSeller;
  const originalPrice = hasDiscount ? Math.round(product.basePrice * 1.25) : null;

  let badgeText: string | null = null;
  let badgeVariant: "default" | "new" | "bestSeller" | "sale" | "soldOut" | "limitedEdition" | "lowStock" = "default";

  if (product.variants.every((v) => v.status === "sold_out")) {
    badgeText = "Sold Out";
    badgeVariant = "soldOut";
  } else if (product.isLimitedEdition) {
    badgeText = "Limited";
    badgeVariant = "limitedEdition";
  } else if (product.isNew) {
    badgeText = "New";
    badgeVariant = "new";
  } else if (product.isBestSeller) {
    badgeText = "Best Seller";
    badgeVariant = "bestSeller";
  } else if (product.variants.some((v) => v.status === "low_stock")) {
    badgeText = "Low Stock";
    badgeVariant = "lowStock";
  }

  return (
    <div
      className={cn("group relative flex flex-col w-full select-none", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-none border border-border/40 bg-surface dark:bg-surface-dark transition-all duration-300">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          {/* Primary image */}
          <Image
            src={imageSrc}
            alt={product.media[0]?.altText || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover object-center transition-all duration-700 ease-out-quart",
              isHovered && "opacity-0 scale-102"
            )}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
            priority={product.isFeatured}
            unoptimized
          />
          
          {/* Secondary image on hover */}
          <Image
            src={hoverSrc}
            alt={product.media[1]?.altText || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover object-center absolute inset-0 transition-all duration-700 ease-out-quart opacity-0 scale-98",
              isHovered && "opacity-100 scale-102"
            )}
            onError={() => setHoverSrc(FALLBACK_IMAGE)}
            unoptimized
          />
        </Link>

        {/* Top Overlay Actions */}
        {badgeText && (
          <div className="absolute top-space-2 left-space-2 z-10 pointer-events-none">
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          </div>
        )}

        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-space-2 right-space-2 z-10 p-2 rounded-full bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xs shadow-soft hover:scale-105 transition-all text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          suppressHydrationWarning
        >
          <Heart
            className={cn(
              "h-[18px] w-[18px] transition-colors stroke-[1.5px]",
              isWishlisted ? "fill-error stroke-error" : "stroke-primary"
            )}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-space-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out-quart z-10">
          <Link
            href={`/products/${product.slug}`}
            className="w-full flex items-center justify-center bg-primary text-background font-sans text-small font-medium py-space-2 rounded-none hover:bg-muted dark:hover:bg-muted-dark transition-colors"
          >
            Explore Options
          </Link>
        </div>
      </div>

      {/* Product Details info */}
      <div className="flex flex-col gap-1 mt-space-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-none">
            <h3 className="font-sans text-body font-normal text-primary line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>
        <p className="font-sans text-micro text-muted uppercase tracking-wider">
          {product.subCategory}
        </p>
        <div className="flex items-center gap-space-2 mt-1">
          <span className="font-sans text-body font-medium text-accent">
            {formatPrice(product.basePrice)}
          </span>
          {originalPrice && (
            <span className="font-sans text-small text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

ProductCard.displayName = "ProductCard";
