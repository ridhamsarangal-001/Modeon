import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-base border border-border bg-surface px-space-3 py-space-2 text-body font-sans transition-all placeholder:text-muted/60 focus:border-transparent focus:outline-hidden focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-surface-dark",
          error && "border-error focus:ring-error",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
