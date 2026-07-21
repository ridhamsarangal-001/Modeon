import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-base border border-border bg-surface text-primary transition-all duration-300 dark:bg-surface-dark",
          interactive && "cursor-pointer hover:shadow-soft hover:border-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
