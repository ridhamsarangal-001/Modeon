"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/config/navigation";
import { BRAND_CONFIG } from "@/config/brand";
import { HeadingH3, TextSmall } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Divider } from "@/components/ui/Divider";
import { Container } from "@/components/ui/Container";

/**
 * Global Page Footer.
 * Incorporates brand column directories and the visual newsletter module.
 * Mark as client component to support client-side form event handling.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark pt-space-6 pb-space-5 select-none">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-5">
        
        {/* Columns: Shop, Company, Support (Directly mapped from NAV_LINKS) */}
        {NAV_LINKS.footer.map((column) => (
          <div key={column.title} className="flex flex-col gap-space-3">
            <HeadingH3 className="font-semibold text-primary text-small uppercase tracking-wider">
              {column.title}
            </HeadingH3>
            <ul className="flex flex-col gap-space-2" aria-label={`${column.title} links`}>
              {column.links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="font-sans text-small text-muted hover:text-primary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter column (occupies 2 cols on wide viewports) */}
        <div className="flex flex-col gap-space-3 lg:col-span-2">
          <HeadingH3 className="font-semibold text-primary text-small uppercase tracking-wider">
            Join the Modeon Circle
          </HeadingH3>
          <TextSmall className="text-muted leading-relaxed max-w-sm">
            Considered arrivals, quiet updates. No noise — just what matters.
          </TextSmall>
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex flex-col gap-space-2 mt-space-1 max-w-sm"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="newsletter-email" className="sr-only">
                Enter your email
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>

      {/* Bottom section with copyright and branding information */}
      <Divider className="my-space-5" />

      <Container className="flex flex-col md:flex-row items-center justify-between gap-space-3">
        <TextSmall className="text-muted/80">
          © {currentYear} {BRAND_CONFIG.name}. All rights reserved.
        </TextSmall>
        <TextSmall className="text-muted/60 font-serif italic text-small">
          {BRAND_CONFIG.tagline}
        </TextSmall>
      </Container>

      {/* Developer credit */}
      <Container className="flex justify-center mt-space-3">
        <TextSmall className="text-muted/50 text-center tracking-wider text-[11px] font-sans">
          Designed & Developed with ❤️ by <span className="text-primary/80 font-medium">Shery Sarangal</span>
        </TextSmall>
      </Container>
    </footer>
  );
}

Footer.displayName = "Footer";
