import { Truck, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH3, TextSmall } from "@/components/ui/Typography";

/**
 * TrustBadges component.
 * Renders brand benefits flex list utilizing Lucide micro-icons.
 */
export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Complimentary Delivery",
      desc: "Worldwide shipping on selections over ₹15,000"
    },
    {
      icon: RotateCcw,
      title: "Considered Returns",
      desc: "Simplicity in exchange, within 14 calendar days"
    },
    {
      icon: ShieldCheck,
      title: "Secured Checkout",
      desc: "Data-isolated processing keys & transfers"
    },
    {
      icon: HelpCircle,
      title: "Personal Styling Support",
      desc: "Quiet advice, concierge assistance on demand"
    }
  ];

  return (
    <Section rhythm="standard" className="bg-surface dark:bg-surface-dark border-y border-border dark:border-border-dark select-none">
      <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-4 md:gap-space-5">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex gap-space-3 items-start">
            <div className="p-2 rounded-full bg-background dark:bg-background-dark text-accent border border-border/10 shrink-0">
              <badge.icon className="h-5 w-5 stroke-[1.5px]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <HeadingH3 className="font-semibold text-primary text-small">
                {badge.title}
              </HeadingH3>
              <TextSmall className="text-muted leading-snug">
                {badge.desc}
              </TextSmall>
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}

TrustBadges.displayName = "TrustBadges";
