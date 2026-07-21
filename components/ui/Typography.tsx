import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function HeadingDisplay({ as: Component = "h1", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-display text-display font-medium tracking-tight text-primary leading-tight",
        className
      )}
      {...props}
    />
  );
}

export function HeadingH1({ as: Component = "h1", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-h1 font-semibold tracking-tight text-primary leading-normal",
        className
      )}
      {...props}
    />
  );
}

export function HeadingH2({ as: Component = "h2", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-h2 font-semibold tracking-tight text-primary leading-normal",
        className
      )}
      {...props}
    />
  );
}

export function HeadingH3({ as: Component = "h3", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-h3 font-medium tracking-normal text-primary leading-snug",
        className
      )}
      {...props}
    />
  );
}

export function TextBodyLg({ as: Component = "p", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-body-lg text-primary leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function TextBody({ as: Component = "p", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-body text-primary leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function TextSmall({ as: Component = "span", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-small text-muted leading-normal",
        className
      )}
      {...props}
    />
  );
}

export function TextMicro({ as: Component = "span", className, ...props }: TypographyProps) {
  return (
    <Component
      className={cn(
        "font-sans text-micro text-muted uppercase tracking-wider leading-none",
        className
      )}
      {...props}
    />
  );
}
