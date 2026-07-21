import { ProductService } from "@/lib/services/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeadingH2, TextSmall } from "@/components/ui/Typography";

/**
 * ProductCarousel component.
 * Fetches and displays products flagged as isNew in a native horizontal scroll row.
 * Implemented as a Server Component for optimal rendering performance.
 */
export async function ProductCarousel() {
  const products = await ProductService.getProducts();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8); // Display first 8 new arrivals

  return (
    <Section rhythm="standard" className="bg-background dark:bg-background-dark select-none">
      <Container className="flex flex-col gap-space-4">
        {/* Title Group */}
        <div className="flex flex-col gap-1">
          <HeadingH2 className="text-h2 font-semibold">
            New Arrivals
          </HeadingH2>
          <TextSmall className="text-muted">
            The latest Considered selections.
          </TextSmall>
        </div>

        {/* Horizontal Scroll wrapper */}
        <div className="w-full overflow-x-auto scrollbar-none pb-space-2 -mx-space-3 px-space-3 md:-mx-space-4 md:px-space-4 lg:-mx-space-5 lg:px-space-5">
          <div className="flex gap-space-4 md:gap-space-5 w-max">
            {newArrivals.map((product) => (
              <div key={product.id} className="w-[260px] sm:w-[300px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

ProductCarousel.displayName = "ProductCarousel";
