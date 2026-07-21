"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useHydratedStore } from "@/store/useHydratedStore";
import { formatPrice } from "@/lib/utils/format";
import { HeadingH3 } from "@/components/ui/Typography";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_IMAGE = "/assets/images/collections/men-essentials.jpg";

/**
 * CartDrawer slide-out panel from the right.
 * Fully keyboard accessible (traps focus, locks body scroll, handles escape clicks).
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const drawerRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  
  const [shouldRender, setShouldRender] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Zustand Store hooks. Cast hydrated store value to CartItem[] to prevent compiler typecheck errors.
  const items = (useHydratedStore(useCartStore, (state) => state.items) as CartItem[]) || [];
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle focus trapping and scroll locking
  React.useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus close button on open
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const closeBtn = drawerRef.current.querySelector<HTMLElement>('button[aria-label="Close cart"]');
          if (closeBtn) closeBtn.focus();
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Escape key listener & focus loop trap
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input, textarea, [tabindex="0"]'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-primary/20 backdrop-blur-xs z-40 transition-opacity duration-300 ease-out-quart pointer-events-none opacity-0",
          isOpen && "pointer-events-auto opacity-100"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        id="cart-drawer-panel"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Selection"
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#F8F7F5] dark:bg-[#121212] border-l border-border dark:border-border-dark z-50 flex flex-col justify-between shadow-modal",
          "transition-[transform,visibility] duration-300 ease-out-quart",
          isOpen ? "visible translate-x-0" : "invisible translate-x-full",
          !shouldRender && "hidden"
        )}
      >
        {/* Header Section */}
        <div className="p-space-4 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent stroke-[1.5px]" />
            <HeadingH3 className="font-sans text-body font-semibold uppercase tracking-wider">
              Your Selection ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </HeadingH3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1 text-muted hover:text-primary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable list items panel */}
        <div className="flex-1 overflow-y-auto p-space-4 flex flex-col gap-space-3 scrollbar-none">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-space-3 py-space-6">
              <ShoppingBag className="h-8 w-8 text-muted/60 stroke-[1.2px]" />
              <p className="font-sans text-small text-muted">
                Your selection is currently empty.
              </p>
              <button
                onClick={onClose}
                className="font-sans text-micro text-accent font-semibold uppercase tracking-wider hover:underline"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => {
              const handleQuantityChange = (newQty: number) => {
                if (newQty < 1) return;
                updateQuantity(item.variantId, newQty);
              };

              return (
                <div key={item.variantId} className="flex gap-space-3 items-start border-b border-border/30 pb-space-3 last:border-b-0 last:pb-0">
                  
                  {/* Thumbnail frame */}
                  <div className="relative aspect-3/4 w-16 overflow-hidden rounded-xs border border-border/20 shrink-0">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  {/* Meta descriptions */}
                  <div className="flex-1 flex flex-col gap-1 text-left">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="hover:underline text-small font-medium text-primary line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="font-sans text-micro text-muted uppercase tracking-wider">
                      Size: {item.size} • Color: {item.color}
                    </p>

                    {/* Quantity selectors */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border dark:border-border-dark rounded-xs h-7 bg-background dark:bg-background-dark px-1 select-none">
                        <button
                          onClick={() => handleQuantityChange(item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-0.5 text-muted hover:text-primary disabled:opacity-20"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-sans text-micro px-2 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.quantity + 1)}
                          className="p-0.5 text-muted hover:text-primary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Trash action button */}
                      <button
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Remove ${item.name} from selection`}
                        className="text-muted hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total price for variants */}
                  <div className="flex flex-col items-end text-right">
                    <span className="font-sans text-small font-semibold text-accent">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer calculation summaries */}
        {items.length > 0 && (
          <div className="p-space-4 border-t border-border/40 bg-surface dark:bg-surface-dark flex flex-col gap-space-3">
            <div className="flex items-center justify-between text-small font-sans border-b border-border/20 pb-space-2">
              <span className="text-muted">Estimated Subtotal</span>
              <span className="text-accent font-semibold text-body">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link
                href="/selection"
                onClick={onClose}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full h-11 flex items-center justify-center font-sans text-small"
                )}
              >
                View Full Selection
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "w-full h-11 flex items-center justify-center gap-2 font-sans text-small"
                )}
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

CartDrawer.displayName = "CartDrawer";
