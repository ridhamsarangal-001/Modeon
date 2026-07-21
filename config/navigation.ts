/**
 * Navigation configuration definitions.
 * Sourced from Content.md.
 */
export const NAV_LINKS = {
  header: [
    { label: "Home", path: "/" },
    { label: "The Edit", path: "/collections/the-edit" },
    { label: "New Arrivals", path: "/collections/new-arrivals" },
    { label: "Collections", path: "/collections" }
  ],
  user: [
    { label: "Wishlist", path: "/wishlist" },
    { label: "Selection", path: "/selection" },
    { label: "Account", path: "/account" }
  ],
  footer: [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", path: "/collections/new-arrivals" },
        { label: "The Edit", path: "/collections/the-edit" },
        { label: "Men", path: "/collections/men" },
        { label: "Women", path: "/collections/women" },
        { label: "Accessories", path: "/collections/accessories" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", path: "/about" },
        { label: "Sustainability", path: "/sustainability" },
        { label: "Journal", path: "/journal" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Concierge", path: "/contact" },
        { label: "Shipping & Returns", path: "/shipping-returns" },
        { label: "Care Guide", path: "/care-guide" }
      ]
    }
  ]
} as const;
