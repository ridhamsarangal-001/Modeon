import { ProductService } from "@/lib/services/products";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { SearchClient } from "@/components/search/SearchClient";

export const dynamic = "force-dynamic";

/**
 * Search landing router page.
 * Server component fetching the static catalog dataset and feeding it to the Client search component.
 */
export default async function SearchPage() {
  const allProducts = await ProductService.getProducts();
  const breadcrumbs = [{ label: "Search Catalog" }];

  return (
    <div className="bg-[#F5F3EF] min-h-screen text-black select-none">
      {/* Breadcrumbs path */}
      <div className="border-b border-neutral-200/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Stateful Client Search workspace */}
      <SearchClient products={allProducts} />
    </div>
  );
}
