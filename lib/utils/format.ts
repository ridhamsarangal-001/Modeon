/**
 * Formats a numeric value into an Indian Rupee (₹) currency string.
 * Decimal points are omitted by default for clean styling.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
