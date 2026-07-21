import { notFound } from "next/navigation";
import { ProductService } from "@/lib/services/products";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductList } from "@/components/product/ProductList";
import { Product } from "@/types/product";

export async function generateStaticParams() {
  return [
    { slug: "men" },
    { slug: "women" },
    { slug: "accessories" },
    { slug: "the-edit" },
    { slug: "new-arrivals" }
  ];
}

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  let categoryLabel = "";
  let products: Product[] = [];

  if (slug === "men") {
    categoryLabel = "Men's Collection";
    products = await ProductService.getProductsByCategory("cat-men");
  } else if (slug === "women") {
    categoryLabel = "Women's Collection";
    products = await ProductService.getProductsByCategory("cat-women");
  } else if (slug === "accessories") {
    categoryLabel = "Accessories";
    products = await ProductService.getProductsByCategory("cat-accessories");
  } else if (slug === "the-edit") {
    categoryLabel = "The Edit";
    // Retrieve featured items for the edit capsule
    products = await ProductService.getFeaturedProducts();
    if (products.length === 0) {
      const all = await ProductService.getProducts();
      products = all.slice(0, 10);
    }
  } else if (slug === "new-arrivals") {
    categoryLabel = "New Arrivals";
    // Retrieve new items
    const all = await ProductService.getProducts();
    products = all.filter((p) => p.isNew);
    if (products.length === 0) {
      products = all.slice(0, 10);
    }
  } else {
    notFound();
  }

  const breadcrumbs = [
    { label: "Collections", href: "/collections" },
    { label: categoryLabel },
  ];

  return (
    <div className="bg-background min-h-screen select-none">
      {/* Breadcrumbs path */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Main filter list panel */}
      <ProductList initialProducts={products} categoryLabel={categoryLabel} />
    </div>
  );
}
