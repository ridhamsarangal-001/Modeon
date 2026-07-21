import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CartPageContent } from "@/components/cart/CartPageContent";

/**
 * Cart/Selection dynamic overview page.
 * Server Component aggregating breadcrumbs and hydrated client views.
 */
export default function SelectionPage() {
  const breadcrumbs = [
    { label: "Your Selection" }
  ];

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen select-none">
      {/* Breadcrumbs link path */}
      <div className="border-b border-border/40 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Stateful shopping list details */}
      <CartPageContent />
    </div>
  );
}
