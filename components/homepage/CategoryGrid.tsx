import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { HeadingH2, HeadingH3, TextSmall } from "@/components/ui/Typography";

/**
 * CategoryGrid component.
 * Renders 3-column asymmetric landing links pointing to main demographic selections.
 */
export function CategoryGrid() {
  const categoriesList = [
    {
      id: "men",
      name: "Men",
      tagline: "Tailored structures & knits.",
      image: "/assets/collections/signature.jpg",
      href: "/collections/men",
      cols: "md:col-span-1"
    },
    {
      id: "women",
      name: "Women",
      tagline: "Spacious silhouettes & silk.",
      image: "/assets/collections/seasonal.jpg",
      href: "/collections/women",
      cols: "md:col-span-1"
    },
    {
      id: "accessories",
      name: "Accessories",
      tagline: "Fine leather & accents.",
      image: "/assets/collections/limited-edition.jpg",
      href: "/collections/accessories",
      cols: "md:col-span-1"
    }
  ];

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark select-none">
      <Container className="flex flex-col gap-space-4">
        {/* Header titles */}
        <div className="flex flex-col gap-1">
          <HeadingH2 className="text-h2 font-semibold">
            Shop by Category
          </HeadingH2>
          <TextSmall className="text-muted">
            Explore demographic-specific edits.
          </TextSmall>
        </div>

        {/* Categories Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-4 md:gap-space-5">
          {categoriesList.map((cat) => (
            <Link key={cat.id} href={cat.href} className="group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-base">
              <Card className="relative overflow-hidden aspect-3/4 w-full border border-border/20 group-hover:shadow-soft transition-all duration-300">
                {/* Visual Cover image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out-quart brightness-[0.93] group-hover:brightness-[0.9]"
                  unoptimized
                />
                
                {/* Floating text details */}
                <div className="absolute inset-0 p-space-4 flex flex-col justify-end bg-gradient-to-t from-primary/60 via-transparent to-transparent text-background">
                  <HeadingH3 className="font-display text-h3 text-background font-medium mb-1">
                    {cat.name}
                  </HeadingH3>
                  <p className="font-sans text-small text-background/80">
                    {cat.tagline}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

CategoryGrid.displayName = "CategoryGrid";
