# Product & Media Catalog — Modeon

**Version:** 1.0
**Purpose:** Defines the complete frontend product and media catalog prior to backend/Supabase integration. Implementation-ready for AI coding tools (Z.ai, Antigravity, Claude Code) — no clarification on assets, structure, or data shape should be required.

---

# Product Catalog

## Categories
Top-level categories (5):
- Men
- Women
- Accessories
- New Arrivals *(dynamic — aggregates recent products across all categories)*
- Sale *(dynamic — aggregates discounted products across all categories)*

## Collections
Nested within Men and Women (not top-level nav items):
- Essentials
- Signature
- Limited Edition
- Seasonal Collection

Each product belongs to one category and one collection.

## Number of Products
**Total: 72 products**

| Category | Count |
|---|---|
| Men | 28 |
| Women | 28 |
| Accessories | 10 |
| New Arrivals | Dynamic subset (flagged products across categories) |
| Sale | Dynamic subset (flagged products across categories) |

Suggested subcategory split within Men/Women (7 each per subcategory type, adjustable): T-Shirts, Shirts, Trousers, Knitwear, Outerwear.

## Product Naming Rules
Editorial, article-led naming (per 04_Content.md). Format: **"The [Descriptor] [Item]"**
Examples: "The Essential Coat", "The Signature Shirt", "The Tailored Trouser", "The Classic Knit"
Material/technical details appear only in description/specifications — never in the title.

## Description Style
Short, refined, editorial paragraph (2–3 sentences) followed by a structured specifications list (material, fit, origin, care). Tone: quiet luxury — restrained, confident, no exaggeration (per Content.md brand voice).

## Price Range (₹ INR)

| Product Type | Price Range |
|---|---|
| T-Shirts | ₹1,999–₹3,499 |
| Shirts | ₹2,999–₹5,999 |
| Trousers | ₹3,499–₹6,999 |
| Knitwear | ₹4,999–₹8,999 |
| Outerwear | ₹7,999–₹14,999 |
| Accessories | ₹999–₹5,999 |

## Sizes
- **Apparel:** XS, S, M, L, XL
- **Accessories:** One Size, or numeric sizing where applicable (e.g., belts, rings)

## Colors
Core palette (10 colors, shared across most products):
Black, White, Ivory, Charcoal, Grey, Beige, Camel, Navy, Olive, Brown

Seasonal/Limited Edition additions: Burgundy, Forest Green, Chocolate Brown, Stone

Each product includes **2–5 curated color options** — never the full palette, to preserve a curated luxury feel.

## Inventory Rules
- Each product has a stock status: **In Stock**, **Low Stock**, or **Sold Out**
- Stock is tracked per size/color variant (mock data structure only at this stage)
- "Low Stock" triggers when remaining units fall below a defined threshold (mock value, e.g., <5 units)
- "Sold Out" variants remain visible but disabled for selection

## Featured Products
A curated, manually flagged subset (mock: `isFeatured: true`) used on homepage and category landing sections — not automatically derived from sales/newness.

## Best Sellers
Manually flagged subset (mock: `isBestSeller: true`) — displayed in dedicated homepage/collection sections. Not derived from real sales data at this stage.

## New Arrivals
Automatically derived from `createdAt`/`releaseDate` field (most recent products), supplemented by a manual `isNew` flag for merchandising control.

---

# Product Media

## Product Images
Primary product image: clean studio photography, minimal/neutral background, consistent lighting, front-facing garment or flat-lay/on-model shot. One primary image per product minimum.

## Product Gallery Images
3–5 images per product: primary studio shot, alternate angle, detail/texture close-up, on-model lifestyle shot, back view (where relevant). Consistent aspect ratio across all gallery images per product.

## Editorial Images
Cinematic fashion photography used in homepage storytelling sections and collection intros — clean composition, minimal backgrounds, magazine-style framing (REPEAT CULTURE-inspired direction).

## Lifestyle Images
On-model, real-setting imagery (studio or minimal environmental context) used within product galleries and homepage "Complete the Look" sections.

## Campaign Images
Seasonal/collection campaign imagery used on homepage hero sections and dedicated collection landing pages — highest production-value tier, cinematic lighting.

## Collection Cover Images
One cover image per collection (Essentials, Signature, Limited Edition, Seasonal), used on collection listing/navigation cards.

## Lookbook Images
Full-outfit, styled editorial imagery grouped into lookbook sets, used in a dedicated Lookbook section or homepage feature.

## Banner Images
Wide-format imagery for homepage section banners, category headers, and promotional (Sale) banners — minimal text overlay, luxury composition.

## Thumbnail Rules
Product card thumbnails are a cropped/optimized version of the primary product image, consistent aspect ratio (e.g., 3:4 portrait) across the entire grid — no mixed aspect ratios within a listing.

---

# Video Content

## Hero Background Videos
Cinematic, slow-motion or subtle-motion loop for homepage hero section — muted, no audio dependency, minimal/editorial in tone.

## Collection Videos
Short cinematic videos representing each collection (Essentials, Signature, Limited Edition, Seasonal), used on collection landing pages.

## Editorial Fashion Videos
Magazine-style motion content supporting storytelling sections on the homepage or brand/about content.

## Campaign Videos
Highest production-value video content tied to seasonal campaigns, used in hero or dedicated campaign sections.

## Lookbook Videos
Motion counterpart to lookbook imagery — short styled sequences showing full outfits.

## Product Showcase Videos
Optional per-product video (360° turn, fabric movement, close-up detail) used within the product detail gallery.

## Category Banner Videos
Optional short looping video used in place of a static banner image for category headers.

## Homepage Section Videos
Supporting video content for homepage storytelling blocks (e.g., "Our Craft", "The Edit").

## Short Loop Videos
Very short (3–6 second), seamless looping clips used for subtle motion accents (e.g., product card hover video, small homepage tiles).

## Loading Videos
Not required. Loading states use skeleton loaders per 05_UI_UX.md — no video-based loading screens.

---

# Media Rules

- All placeholder assets must closely match a premium cinematic fashion editorial aesthetic (REPEAT CULTURE-inspired): clean compositions, minimal backgrounds, cinematic lighting, magazine-style storytelling.
- No generic stock imagery that breaks the luxury aesthetic — placeholder quality bar must be treated as equivalent to final brand assets.
- All media must be structured so it is **easily replaceable later** — no hardcoded assumptions about specific filenames beyond the defined naming convention.
- Aspect ratios must remain **consistent within each media type** across the entire site (see below).

### Aspect Ratio Standards

| Media Type | Aspect Ratio |
|---|---|
| Product card/thumbnail | 3:4 (portrait) |
| Product gallery image | 3:4 or 4:5 (portrait) |
| Editorial/campaign image | 16:9 or 4:5 (context-dependent, consistent per section) |
| Collection cover | 3:4 |
| Banner (hero/promo) | 21:9 or 16:9 (wide) |
| Lookbook image | 4:5 |
| Video (hero/campaign) | 16:9 |
| Short loop video | 1:1 or 4:5 |

### Naming Convention

Format: `{type}-{category/collection}-{identifier}-{index}.{ext}`

Examples:
- `product-men-essential-coat-01.jpg`
- `gallery-women-signature-shirt-03.jpg`
- `editorial-seasonal-collection-01.jpg`
- `campaign-limited-edition-hero.mp4`
- `banner-sale-promo-01.jpg`
- `lookbook-women-signature-02.jpg`

### Folder Structure

```
assets/
  images/
    hero/
    products/
      men/
      women/
      accessories/
    collections/
      essentials/
      signature/
      limited-edition/
      seasonal/
    editorial/
    campaigns/
    lookbook/
    banners/
  videos/
    hero/
    collections/
    campaigns/
    editorial/
    lookbook/
    products/
    homepage/
```

---

# Product Card
- **Image:** Primary product image (thumbnail, 3:4)
- **Hover Image:** Secondary gallery image swapped in on hover (desktop only)
- **Quick View:** Optional modal trigger showing condensed product info without full page navigation
- **Wishlist Icon:** Top-corner overlay icon, toggles filled/outline state
- **Price:** Displayed in ₹ INR, strikethrough original price shown alongside sale price when discounted
- **Badge:** Positioned top-left/top-right corner, subtle monochrome styling per badge rules below

---

# Product Detail Page
- **Image Gallery:** 3–5 images per product, sticky/independent scroll per 05_UI_UX.md
- **Video Gallery:** Optional showcase video included alongside images where available
- **Product Video:** Auto-muted, loop-enabled, positioned within or adjacent to the image gallery
- **Zoom Images:** Click/hover-to-zoom on primary and gallery images for detail inspection

---

# Search
Search indexes product name, category, collection, and color. Live suggestions surface matching products with thumbnail, name, and price (per 05_UI_UX.md search experience). No dedicated media beyond existing product thumbnails.

# Filters
Filterable attributes: Category, Collection, Size, Color, Price Range, Badge (e.g., "Sale", "New"). Filters operate on existing catalog data — no additional media required.

# Sorting
Sort options: Newest, Price (Low to High), Price (High to Low), Best Sellers. Derived from existing product fields (`createdAt`, `price`, `isBestSeller`) — no additional media required.

---

# Future Database Mapping

This catalog structure is designed to map directly to a future Supabase (or equivalent) schema:

| Frontend Concept | Future DB Entity |
|---|---|
| Category | `categories` table |
| Collection | `collections` table |
| Product | `products` table |
| Product Variant (size/color) | `product_variants` table |
| Product Media | `product_media` table (linked to product/variant) |
| Badge flags | Boolean/enum fields on `products` (e.g., `is_new`, `is_best_seller`) |
| Inventory | `inventory` table linked to `product_variants` |

Mock JSON data field names should mirror these future table/column names where practical, to minimize refactor effort during backend integration (per 07_TRD.md API layer strategy).

---

# AI Generation Rules

- AI coding tools must **never prompt the user for images or videos** — all placeholder media must be sourced/generated according to the folder structure, naming convention, and aspect ratio rules defined in this document.
- Placeholder media must visually match the cinematic luxury editorial direction described in **Media Rules** — not generic stock photography.
- All 72 products must be generated with complete mock data: name (editorial style), category, collection, price (₹ INR per range table), 2–5 colors, applicable sizes, stock status, and 3–5 gallery images following the naming convention.
- Badges must be applied using **subtle monochrome styling with elegant accents** — no bright, flashy, or high-saturation badge colors, consistent with Design.md's restrained visual language.
- Badge types are limited strictly to: New, Best Seller, Sale, Sold Out, Limited Edition, Low Stock — no additional badge types should be invented.
- All media paths referenced in generated code must follow the exact folder structure defined above, so assets can be swapped later without touching component code.
- Any ambiguity in product data generation (e.g., exact product names within a subcategory) should default to editorial-style naming consistent with the examples provided, rather than prompting the user.
