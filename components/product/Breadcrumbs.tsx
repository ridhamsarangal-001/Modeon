import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable Breadcrumbs navigation widget.
 * Complies with semantic markup and WCAG AA accessibility standards.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-space-2 text-micro font-sans select-none">
      <Container className="flex items-center flex-wrap gap-1 text-muted">
        <Link href="/" className="hover:text-primary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs">
          Home
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 stroke-[1.5px]" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="text-primary font-medium truncate" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors truncate focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </Container>
    </nav>
  );
}

import * as React from "react";
Breadcrumbs.displayName = "Breadcrumbs";
