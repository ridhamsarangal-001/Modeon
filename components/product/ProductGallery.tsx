"use client";

import * as React from "react";
import Image from "next/image";
import { ProductMedia } from "@/types/product";
import { cn } from "@/lib/utils/cn";

export interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
}

const FALLBACK_IMAGE = "/assets/images/collections/men-essentials.jpg";

/**
 * ProductGallery client component.
 * Render thumbnail layouts alongside a primary high-resolution viewer.
 */
export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});

  // Compute active media and fallback state directly during render (no useEffect needed)
  const activeMedia = media[activeIndex];
  const isBroken = imageErrors[activeIndex];
  const mainSrc = activeMedia && !isBroken ? activeMedia.url : FALLBACK_IMAGE;

  const handleImageError = () => {
    setImageErrors((prev) => ({ ...prev, [activeIndex]: true }));
  };

  return (
    <div className="flex flex-col gap-space-3 w-full select-none">
      {/* Active Main View Frame (3:4 aspect ratio as per Design.md) */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-base border border-border/40 bg-surface dark:bg-surface-dark">
        <Image
          src={mainSrc}
          alt={(activeMedia && activeMedia.altText) || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
          onError={handleImageError}
          priority
        />
      </div>

      {/* Thumbnails row (horizontal overflow on narrow viewports) */}
      {media.length > 1 && (
        <div className="flex gap-space-2 overflow-x-auto scrollbar-none py-1">
          {media.map((item, idx) => {
            const isSelected = idx === activeIndex;
            const isThumbBroken = imageErrors[idx];
            const thumbSrc = isThumbBroken ? FALLBACK_IMAGE : item.url;

            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${productName}`}
                className={cn(
                  "relative aspect-3/4 w-16 sm:w-20 overflow-hidden rounded-xs border transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent",
                  isSelected
                    ? "border-accent ring-1 ring-accent"
                    : "border-border hover:border-primary"
                )}
              >
                <Image
                  src={thumbSrc}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover object-center" unoptimized
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [idx]: true }));
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

ProductGallery.displayName = "ProductGallery";
