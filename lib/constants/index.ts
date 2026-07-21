/**
 * Technical, non-brand constants for the Modeon platform.
 * Sourced from Catalog.md.
 */
export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const ACCESSORY_SIZES = ["One Size"] as const;

export const BADGE_TYPES = [
  "New",
  "Best Seller",
  "Sale",
  "Sold Out",
  "Limited Edition",
  "Low Stock"
] as const;

export type BadgeType = typeof BADGE_TYPES[number];

export const MOCK_API_DELAY_MS = 300; // Standard simulated network lag for mock-first services
