import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-xs px-space-2 py-0.5 text-micro font-medium uppercase tracking-wider font-sans select-none border",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-primary dark:bg-surface-dark",
        new: "border-primary bg-primary text-background dark:border-primary-dark dark:text-background-dark",
        bestSeller: "border-accent/40 bg-accent/5 text-primary",
        sale: "border-accent bg-accent text-primary font-semibold",
        soldOut: "border-border bg-border/20 text-muted line-through opacity-80",
        limitedEdition: "border-primary bg-primary/5 text-accent dark:border-primary-dark",
        lowStock: "border-error/40 bg-error/5 text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
