import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-base font-sans font-medium text-body transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-background hover:bg-muted dark:hover:bg-muted-dark",
        secondary: "border border-border bg-transparent text-primary hover:border-primary hover:bg-primary/5 dark:hover:bg-primary-dark/5",
        accent: "bg-accent text-primary hover:bg-accent-dark",
        ghost: "bg-transparent text-primary hover:bg-primary/5 dark:hover:bg-primary-dark/5",
      },
      size: {
        default: "py-space-3 px-space-4",
        sm: "py-space-2 px-space-3 text-small",
        lg: "py-space-4 px-space-5 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, disabled, loading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && <Spinner className="mr-space-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
