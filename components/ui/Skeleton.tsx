import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-base bg-border/60 dark:bg-border-dark/60",
        className
      )}
      {...props}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
