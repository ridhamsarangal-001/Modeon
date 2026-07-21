"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useHydratedStore } from "@/store/useHydratedStore";
import { formatPrice } from "@/lib/utils/format";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { buttonVariants } from "@/components/ui/Button";
import { HeadingH2, TextSmall } from "@/components/ui/Typography";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

const FREE_SHIPPING_THRESHOLD = 15000;
const STANDARD_SHIPPING_FEE = 500;
const FALLBACK_IMAGE = "/assets/images/collections/men-essentials.jpg";

/**
 * CartPageContent Client Component.
 * Integrates hydration guards, checkout calculators, free-shipping meters,
 * and quantity controllers.
 */
export function CartPageContent() {
  // Hydrated Zustand hooks. Cast hydrated store value to CartItem[] to prevent compiler typecheck errors.
  const items = useHydratedStore(useCartStore, (state) => state.items) as CartItem[] | undefined;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Loading state during hydration check
  if (items === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner className="text-accent h-8 w-8" />
        <p className="font-sans text-small text-muted mt-space-3">
          Loading your selection...
        </p>
      </div>
    );
  }

  // Calculate pricing values
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // Free shipping progression meter percentage
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Empty selection drawer state
  if (items.length === 0) {
    return (
      <Section rhythm="standard" className="bg-background dark:bg-background-dark min-h-[60vh] flex flex-col justify-center select-none">
        <Container className="flex flex-col items-center text-center gap-space-4">
          <div className="p-4 rounded-full bg-surface dark:bg-surface-dark border border-border/20 text-muted">
            <ShoppingBag className="h-10 w-10 stroke-[1.2px]" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <HeadingH2 className="font-semibold text-primary">
              Your Selection is Empty
            </HeadingH2>
            <TextSmall className="text-muted leading-relaxed">
              Explore our collections to choose pieces quietly made with premium fabrics.
            </TextSmall>
          </div>
          <Link href="/collections/men" className={cn(buttonVariants({ variant: "primary" }), "mt-space-2")}>
            Discover Men&apos;s Collection
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark select-none min-h-[70vh]">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-start">
        
        {/* Left Column: Cart Items Grid List (8-cols wide) */}
        <div className="lg:col-span-8 flex flex-col gap-space-4">
          
          {/* Shipping Progress bar */}
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-space-4 rounded-base flex flex-col gap-space-2">
            <TextSmall className="font-sans font-medium text-primary">
              {isFreeShipping ? (
                <span className="text-success font-semibold">✓ You qualify for complimentary worldwide delivery</span>
              ) : (
                <span>
                  Add <strong className="text-accent">{formatPrice(amountToFreeShipping)}</strong> more to enjoy complimentary worldwide delivery
                </span>
              )}
            </TextSmall>
            <div className="w-full bg-background dark:bg-background-dark h-2 rounded-full overflow-hidden">
              <div 
                className="bg-accent h-full transition-all duration-500 ease-out-quart" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart items list cards */}
          <div className="flex flex-col border border-border dark:border-border-dark rounded-base overflow-hidden divide-y divide-border/60 bg-surface dark:bg-surface-dark">
            {items.map((item) => {
              const handleQuantityChange = (newQty: number) => {
                if (newQty < 1) return;
                updateQuantity(item.variantId, newQty);
              };

              return (
                <div key={item.variantId} className="p-space-4 flex gap-space-3 md:gap-space-4 items-start">
                  
                  {/* Thumbnail */}
                  <div className="relative aspect-3/4 w-20 overflow-hidden rounded-xs border border-border/20 shrink-0">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  {/* Item Description Meta */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-space-3 h-full">
                    <div className="flex flex-col gap-1 text-left">
                      <Link href={`/products/${item.slug}`} className="hover:underline text-body font-medium text-primary">
                        {item.name}
                      </Link>
                      <p className="font-sans text-micro text-muted uppercase tracking-wider">
                        Color: {item.color} • Size: {item.size}
                      </p>
                      
                      {/* Mobile quantity decrement controllers */}
                      <div className="flex items-center gap-space-3 mt-space-2 md:hidden">
                        <div className="flex items-center border border-border rounded-xs h-8 bg-background px-1 select-none">
                          <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-muted hover:text-primary disabled:opacity-20"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-sans text-small px-3 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            className="p-1 text-muted hover:text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          aria-label="Remove item"
                          className="text-muted hover:text-error transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop quantity controls */}
                    <div className="hidden md:flex flex-col items-end gap-space-2">
                      <div className="flex items-center border border-border dark:border-border-dark rounded-xs h-9 bg-background dark:bg-background-dark px-1 select-none">
                        <button
                          onClick={() => handleQuantityChange(item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-muted hover:text-primary disabled:opacity-20 transition-colors focus-visible:outline-hidden rounded-xs"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-sans text-small px-3 font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.quantity + 1)}
                          className="p-1 text-muted hover:text-primary transition-colors focus-visible:outline-hidden rounded-xs"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="flex items-center gap-1.5 text-micro text-muted hover:text-error transition-colors focus-visible:outline-hidden"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>

                    {/* Item Prices */}
                    <div className="flex flex-col items-start md:items-end text-left md:text-right mt-1 md:mt-0">
                      <span className="font-sans text-body font-semibold text-accent">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="font-sans text-micro text-muted">
                          {formatPrice(item.price)} each
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkout Summary block (4-cols wide) */}
        <div className="lg:col-span-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-space-4 rounded-base flex flex-col gap-space-4">
          <HeadingH2 className="font-sans text-body font-semibold uppercase tracking-wider border-b border-border/40 pb-space-2 text-left">
            Selection Summary
          </HeadingH2>

          <div className="flex flex-col gap-space-2 text-small font-sans">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-primary font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-primary font-medium">
                {shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="border-t border-border/40 my-space-1 pt-space-2 flex justify-between text-body font-semibold">
              <span>Total Amount</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className={cn(buttonVariants({ variant: "primary" }), "w-full h-12 flex items-center justify-center gap-2 mt-2")}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>

          <TextSmall className="text-muted text-center text-micro leading-relaxed">
            Shipping fees and taxes estimated at checkout. Considered edits, packaged with care.
          </TextSmall>
        </div>

      </Container>
    </Section>
  );
}

CartPageContent.displayName = "CartPageContent";
