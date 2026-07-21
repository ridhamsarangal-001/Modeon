import { notFound } from "next/navigation";
import { ProductService } from "@/lib/services/products";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

export const dynamic = "force-dynamic";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Product Detail Page (PDP).
 * Server Component fetching database-level entries asynchronously and composing the layouts.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch primary product details
  const product = await ProductService.getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  // Fetch recommendations (Related Products) from the same category slug
  const allInCategory = await ProductService.getProductsByCategory(product.categoryId);
  const relatedProducts = allInCategory
    .filter((p) => p.id !== product.id)
    .slice(0, 4); // Limit to 4 related products

  // Build breadcrumbs structures
  const categoryLabel =
    product.categoryId === "cat-men"
      ? "Men"
      : product.categoryId === "cat-women"
      ? "Women"
      : "Accessories";

  const categorySlug =
    product.categoryId === "cat-men"
      ? "men"
      : product.categoryId === "cat-women"
      ? "women"
      : "accessories";

  const breadcrumbs = [
    { label: categoryLabel, href: `/collections/${categorySlug}` },
    { label: product.subCategory, href: `/collections/${categorySlug}?sub=${encodeURIComponent(product.subCategory)}` },
    { label: product.name },
  ];

  return (
    <article className="bg-background dark:bg-background-dark select-none min-h-screen">
      {/* Dynamic breadcrumbs bar */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Main product showcase grid */}
      <Section rhythm="standard">
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-space-5 lg:gap-space-6 items-start">
          
          {/* Gallery block (Left 6-col span on desktop) */}
          <div className="lg:col-span-6 w-full">
            <ProductGallery media={product.media} productName={product.name} />
          </div>

          {/* Configuration options details (Right 6-col span on desktop) */}
          <div className="lg:col-span-6 w-full lg:sticky lg:top-20">
            <ProductInfo product={product} />
          </div>

        </Container>
      </Section>

      {/* Related recommendations section */}
      <RelatedProducts products={relatedProducts} />
    </article>
  );
}
