"use client";

import * as React from "react";
import { Plus, Minus, Info } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { HeadingH1, TextBodyLg } from "@/components/ui/Typography";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils/cn";

export interface ProductInfoProps {
  product: Product;
}

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];

/**
 * ProductInfo Client Component.
 * Orchestrates product variables selection (colors swatches, size inventories, quantity caps).
 * Integrates with useCartStore to add items to selection.
 */
export function ProductInfo({ product }: ProductInfoProps) {
  // Extract unique colors from variants list
  const availableColors = React.useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product.variants]);

  // Zustand Store hooks
  const addItem = useCartStore((state) => state.addItem);

  // States
  const [selectedColor, setSelectedColor] = React.useState(availableColors[0] || "");
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [addedSuccess, setAddedSuccess] = React.useState(false);

  // Filter variants matching the selected color
  const variantsForColor = React.useMemo(() => {
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product.variants, selectedColor]);

  // Determine size stock status
  const sizeStockMap = React.useMemo(() => {
    const map: Record<string, { isAvailable: boolean; qty: number; status: string }> = {};
    
    // Check apparel sizes or custom accessory sizes
    const sizeList = product.variants.some(v => v.size === "One Size") ? ["One Size"] : APPAREL_SIZES;
    
    sizeList.forEach((size) => {
      const match = variantsForColor.find((v) => v.size === size);
      if (match) {
        map[size] = {
          isAvailable: match.quantity > 0 && match.status !== "sold_out",
          qty: match.quantity,
          status: match.status
        };
      } else {
        map[size] = { isAvailable: false, qty: 0, status: "sold_out" };
      }
    });
    return map;
  }, [variantsForColor, product.variants]);

  // Auto-select first in-stock size when color changes
  React.useEffect(() => {
    const sizes = Object.keys(sizeStockMap);
    const firstAvailable = sizes.find((size) => sizeStockMap[size].isAvailable);
    
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        setSelectedSize(firstAvailable || null);
        setQuantity(1);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedColor, sizeStockMap]);

  // Active selected variant
  const activeVariant = React.useMemo(() => {
    return variantsForColor.find((v) => v.size === selectedSize);
  }, [variantsForColor, selectedSize]);

  // Max quantity bounded by stock level
  const maxQty = activeVariant ? activeVariant.quantity : 1;
  const isOutOfStock = !selectedSize || maxQty <= 0;

  // Quantity controllers
  const incrementQty = () => setQuantity((prev) => Math.min(prev + 1, maxQty));
  const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  // Add to Selection Action Handler (Zustand Bindings)
  const handleAddToSelection = () => {
    if (isOutOfStock || !selectedSize || !activeVariant) return;

    setIsAdding(true);

    const price = activeVariant.priceOverride || product.basePrice;

    const cartItem = {
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      image: product.media[0]?.url || "",
      price,
      slug: product.slug,
    };

    // Add item to Zustand store
    addItem(cartItem, quantity);

    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }, 800);
  };

  // Badges logic
  const isBestSeller = product.isBestSeller;
  const hasDiscount = isBestSeller;
  const originalPrice = hasDiscount ? Math.round(product.basePrice * 1.25) : null;

  return (
    <div className="flex flex-col gap-space-4 select-none">
      
      {/* Title & Brand Categories */}
      <div className="flex flex-col gap-1.5 border-b border-border dark:border-border-dark pb-space-3">
        <span className="font-sans text-micro font-medium text-accent uppercase tracking-widest">
          {product.subCategory}
        </span>
        <HeadingH1 className="font-display text-h1 font-medium tracking-tight text-primary leading-tight">
          {product.name}
        </HeadingH1>
        
        {/* Price rows */}
        <div className="flex items-center gap-space-2 mt-2">
          <span className="font-sans text-h3 font-semibold text-accent">
            {formatPrice(product.basePrice)}
          </span>
          {originalPrice && (
            <span className="font-sans text-body text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Description paragraph */}
      <div className="flex flex-col gap-space-2 text-left">
        <TextBodyLg className="text-muted leading-relaxed font-sans text-body">
          {product.description}
        </TextBodyLg>
      </div>

      {/* Variables selection: Colors */}
      <div className="flex flex-col gap-space-2">
        <span className="font-sans text-micro font-semibold text-primary uppercase tracking-wider">
          Color: <span className="text-muted font-normal capitalize">{selectedColor}</span>
        </span>
        <div className="flex flex-wrap gap-space-2" role="radiogroup" aria-label="Choose color">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={cn(
                  "h-8 px-4 rounded-full border text-small font-sans transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent",
                  isSelected
                    ? "bg-primary text-background border-primary dark:bg-primary-dark dark:text-background-dark"
                    : "bg-surface text-muted border-border hover:border-primary dark:bg-surface-dark"
                )}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Variables selection: Sizes */}
      <div className="flex flex-col gap-space-2 mt-space-1">
        <span className="font-sans text-micro font-semibold text-primary uppercase tracking-wider">
          Size
        </span>
        <div className="flex flex-wrap gap-space-2" role="radiogroup" aria-label="Choose size">
          {Object.keys(sizeStockMap).map((size) => {
            const { isAvailable } = sizeStockMap[size];
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                role="radio"
                disabled={!isAvailable}
                aria-checked={isSelected}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "h-10 w-12 rounded-xs border font-sans text-small flex items-center justify-center relative transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent",
                  !isAvailable && "opacity-30 cursor-not-allowed border-border bg-background text-muted line-through",
                  isAvailable && isSelected && "bg-primary text-background border-primary dark:bg-primary-dark dark:text-background-dark",
                  isAvailable && !isSelected && "bg-surface border-border hover:border-primary dark:bg-surface-dark"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
        {selectedSize && sizeStockMap[selectedSize]?.qty < 5 && sizeStockMap[selectedSize]?.qty > 0 && (
          <span className="flex items-center gap-1.5 text-micro text-error font-medium">
            <Info className="h-3.5 w-3.5" /> Only {sizeStockMap[selectedSize].qty} left in stock.
          </span>
        )}
      </div>

      {/* Quantity & Add to Cart Module */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-3 mt-space-2 pt-space-2 border-t border-border/40">
        
        {/* Quantity selector incrementer */}
        <div className="flex items-center justify-between border border-border dark:border-border-dark rounded-xs h-12 w-full sm:w-32 bg-surface dark:bg-surface-dark px-space-2 select-none">
          <button
            onClick={decrementQty}
            disabled={isOutOfStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="p-1 text-muted hover:text-primary disabled:opacity-20 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-sans text-body font-medium min-w-[20px] text-center">
            {isOutOfStock ? 0 : quantity}
          </span>
          <button
            onClick={incrementQty}
            disabled={isOutOfStock || quantity >= maxQty}
            aria-label="Increase quantity"
            className="p-1 text-muted hover:text-primary disabled:opacity-20 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* CTA Submission button */}
        <Button
          onClick={handleAddToSelection}
          disabled={isOutOfStock || isAdding}
          variant="primary"
          className="flex-1 h-12 text-small font-medium font-sans w-full"
        >
          {isAdding
            ? "Adding to Selection..."
            : addedSuccess
            ? "Added to Selection ✓"
            : isOutOfStock
            ? "Sold Out"
            : "Add to Selection"}
        </Button>
      </div>

    </div>
  );
}

ProductInfo.displayName = "ProductInfo";
