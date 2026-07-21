import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CartPageContent } from "@/components/cart/CartPageContent";

/**
 * Cart main page overview route.
 * Renders the stateful client shopping selection items and summaries.
 */
export default function CartPage() {
  const breadcrumbs = [
    { label: "Your Selection" }
  ];

  return (
    <div className="bg-[#F5F3EF] min-h-screen select-none text-black">
      {/* Breadcrumbs link path */}
      <div className="border-b border-neutral-200/50 py-1">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Stateful shopping list details */}
      <div className="max-w-[1440px] mx-auto py-space-4">
        <CartPageContent />
      </div>
    </div>
  );
}
