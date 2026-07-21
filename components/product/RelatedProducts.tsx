import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH2, TextSmall } from "@/components/ui/Typography";

export interface RelatedProductsProps {
  products: Product[];
}

/**
 * RelatedProducts server-compatible layout component.
 * Displays list of recommendations matching the active selection.
 */
export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark border-t border-border dark:border-border-dark select-none">
      <Container className="flex flex-col gap-space-4">
        {/* Title headers */}
        <div className="flex flex-col gap-1">
          <HeadingH2 className="text-h2 font-semibold">
            You May Also Like
          </HeadingH2>
          <TextSmall className="text-muted">
            Considered recommendations matching your edit.
          </TextSmall>
        </div>

        {/* 4-column products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4 md:gap-space-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

RelatedProducts.displayName = "RelatedProducts";
