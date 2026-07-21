# Supabase Backend Architecture — Modeon

**Version:** 1.0
**Foundation:** PRD.md, 07_TRD.md, 11_Catalog.md
**Backend Stack:** Supabase (PostgreSQL, Auth, Storage, RLS). Edge Functions deferred — not used in this version.

---

## 1. Authentication

Supabase Auth handles all authentication via:
- **Email/Password**
- **Google OAuth**

No custom backend auth logic — Supabase Auth is the single source of truth for identity. Session handling on the frontend follows the flow defined in 06_App_Flow.md (return-to-origin redirect after login).

---

## 2. User Profiles

A `profiles` table extends Supabase's built-in `auth.users`, storing application-specific user data.

**`profiles`**
- `id` (uuid, references `auth.users.id`, primary key)
- `full_name` (text)
- `email` (text)
- `avatar_url` (text, nullable — references private storage bucket)
- `role` (text, default `'customer'`)
- `created_at` (timestamp)
- `updated_at` (timestamp)

A trigger on `auth.users` insert automatically creates a corresponding `profiles` row with `role = 'customer'`.

---

## 3. Customer & Admin Roles

Role management uses a single `role` column on `profiles` (e.g., `customer`, `admin`), enforced entirely through RLS policies — no JWT custom claims required at this stage.

Design is intentionally extensible: additional roles (e.g., `super_admin`) can be introduced later by adding new RLS policy conditions referencing `role`, without altering table structure.

---

## 4. Database Tables

Core tables:

| Table | Purpose |
|---|---|
| `profiles` | User profile + role data |
| `categories` | Top-level categories (Men, Women, Accessories) |
| `collections` | Collections within categories (Essentials, Signature, etc.) |
| `products` | Core product data |
| `product_variants` | Size/color combinations per product |
| `inventory` | Stock levels per variant |
| `product_media` | Images/videos per product/variant |
| `wishlists` | Logged-in user wishlist items |
| `cart_items` | Logged-in user cart items |
| `orders` | Order records (guest and logged-in) |
| `order_items` | Line items per order |
| `addresses` | Saved addresses for logged-in users |

---

## 5. Table Relationships

- `products.category_id` → `categories.id`
- `products.collection_id` → `collections.id`
- `product_variants.product_id` → `products.id`
- `inventory.variant_id` → `product_variants.id` (one-to-one)
- `product_media.product_id` → `products.id`
- `product_media.variant_id` → `product_variants.id` (nullable — some media is product-level, not variant-specific)
- `wishlists.user_id` → `profiles.id`
- `wishlists.product_id` → `products.id`
- `cart_items.user_id` → `profiles.id`
- `cart_items.variant_id` → `product_variants.id`
- `orders.user_id` → `profiles.id` (nullable — guest orders have no user)
- `order_items.order_id` → `orders.id`
- `order_items.variant_id` → `product_variants.id`
- `addresses.user_id` → `profiles.id`
- `orders.address_id` → `addresses.id` (nullable — guest orders store address inline, not via FK)

---

## 6. Product Catalog

**`categories`**
- `id`, `name`, `slug`, `created_at`

**`collections`**
- `id`, `category_id` (FK), `name`, `slug`, `cover_image_url`, `created_at`

**`products`**
- `id`, `category_id` (FK), `collection_id` (FK), `name`, `slug`, `description`, `base_price`, `is_new`, `is_best_seller`, `is_featured`, `is_limited_edition`, `created_at`, `updated_at`

Matches the 72-product structure defined in 11_Catalog.md (Men: 28, Women: 28, Accessories: 10).

---

## 7. Product Variants

**`product_variants`**
- `id`, `product_id` (FK), `size` (text), `color` (text), `sku` (text, unique), `price_override` (nullable, for variant-specific pricing), `created_at`

Each size/color combination is a distinct row — fully normalized, per catalog requirements (2–5 colors × applicable sizes per product).

---

## 8. Inventory

**`inventory`**
- `id`, `variant_id` (FK, unique), `quantity` (integer), `status` (enum: `in_stock`, `low_stock`, `sold_out`), `updated_at`

`status` is derived/updated based on `quantity` thresholds (e.g., `low_stock` when quantity < 5), managed via application logic or a database trigger.

---

## 9. Wishlist

**`wishlists`**
- `id`, `user_id` (FK), `product_id` (FK), `created_at`

Applies to **logged-in users only**. Guest wishlist remains client-side (Zustand/localStorage) and is inserted into `wishlists` upon login/signup, per the merge flow defined in 06_App_Flow.md.

---

## 10. Shopping Cart

**`cart_items`**
- `id`, `user_id` (FK), `variant_id` (FK), `quantity`, `created_at`, `updated_at`

Applies to **logged-in users only**. Guest cart remains client-side and merges into `cart_items` upon login, matching existing quantities where variants overlap.

---

## 11. Orders

**`orders`**
- `id`, `user_id` (FK, nullable for guests), `guest_email` (nullable, used when `user_id` is null), `status` (enum: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`), `total_amount`, `address_id` (FK, nullable), `guest_address` (jsonb, nullable — used when no saved address applies), `created_at`, `updated_at`

**`order_items`**
- `id`, `order_id` (FK), `variant_id` (FK), `quantity`, `price_at_purchase`, `created_at`

Guests place orders using a one-time `guest_address` (jsonb snapshot) — never written to the `addresses` table. Logged-in users' orders reference a saved `addresses` row via `address_id`.

---

## 12. Addresses

**`addresses`**
- `id`, `user_id` (FK), `label` (text, e.g., "Home", "Work"), `full_name`, `phone`, `line1`, `line2`, `city`, `state`, `postal_code`, `country`, `is_default` (boolean), `created_at`

Available only to logged-in users, managed from the Account Dashboard (per 06_App_Flow.md).

---

## 13. Product Media

**`product_media`**
- `id`, `product_id` (FK), `variant_id` (FK, nullable), `media_type` (enum: `image`, `video`), `url`, `alt_text`, `sort_order`, `created_at`

Supports the gallery structure defined in 11_Catalog.md (3–5 images per product, optional showcase video). `sort_order` controls gallery sequence.

---

## 14. Storage Buckets

| Bucket | Access | Purpose |
|---|---|---|
| `product-images` | Public | Product photography (studio, gallery, detail shots) |
| `product-videos` | Public | Product showcase/gallery videos |
| `editorial-media` | Public | Editorial, campaign, lookbook, banner images/videos |
| `user-uploads` | Private | Future user-generated content (e.g., profile avatars) |

Public buckets align with 11_Catalog.md's folder structure (`assets/images/*`, `assets/videos/*`) for a direct migration path from mock data to Supabase Storage. The private bucket is scoped per-user via RLS, accessible only to the owning user (and admins).

---

## 15. Row Level Security Policies

RLS enabled on all tables. Core policy patterns:

| Table | Policy Summary |
|---|---|
| `profiles` | User can read/update own row; admin can read/update all |
| `products`, `product_variants`, `inventory`, `product_media`, `categories`, `collections` | Public read access; write access restricted to `role = 'admin'` |
| `wishlists`, `cart_items`, `addresses` | User can read/write only their own rows (`user_id = auth.uid()`) |
| `orders`, `order_items` | User can read own orders (`user_id = auth.uid()`); guest orders not readable via RLS (handled via secure order-confirmation token/session instead); admin can read/write all |
| `user-uploads` bucket | User can read/write only their own folder path; admin can read all |
| `product-images`, `product-videos`, `editorial-media` buckets | Public read; write restricted to admin |

---

## 16. Admin Permissions

Admin (`role = 'admin'`) permissions, enforced via RLS:
- Full CRUD on `products`, `product_variants`, `inventory`, `product_media`, `categories`, `collections`
- Read/update access on all `orders` and `order_items` (e.g., updating order status)
- Read access to all `profiles` (for customer support/order management)
- Write access to public storage buckets (`product-images`, `product-videos`, `editorial-media`)

Admin dashboard UI (per PRD/UI-UX docs) consumes these permissions directly — no separate admin API layer required, since RLS enforces access at the database level.

---

## 17. Mock Data to Supabase Migration

Migration path from current mock JSON (per 11_Catalog.md) to Supabase:

1. Mock `categories` and `collections` JSON → seed `categories`/`collections` tables
2. Mock `products` (72 items) → seed `products` table, preserving `slug` as stable identifier
3. Mock size/color combinations per product → generate `product_variants` rows programmatically
4. Mock stock values → seed `inventory` rows per variant
5. Mock image/video paths (per catalog folder structure) → upload to corresponding Storage buckets, insert matching `product_media` rows with resulting public URLs
6. Field names in mock JSON should mirror final table/column names (already established in 11_Catalog.md's Future Database Mapping) to minimize transformation logic during migration
7. Service functions in `lib/` (per 07_TRD.md API layer) are updated to query Supabase instead of local JSON — no changes required to components or pages, since the API layer already abstracts data access

---

## 18. Naming Conventions

- Table names: plural, snake_case (e.g., `product_variants`, `order_items`)
- Column names: snake_case (e.g., `created_at`, `is_best_seller`)
- Foreign keys: `{referenced_table_singular}_id` (e.g., `product_id`, `user_id`)
- Enum values: lowercase snake_case (e.g., `in_stock`, `low_stock`)
- Storage bucket names: kebab-case (e.g., `product-images`, `user-uploads`)
- Storage file paths mirror 11_Catalog.md's folder/naming convention (e.g., `products/men/essential-coat-01.jpg`)

---

## 19. Backend Best Practices

- RLS enabled on every table from day one — no table left publicly writable by default
- All timestamps stored in UTC (`timestamptz`)
- Foreign keys enforced with proper `ON DELETE` behavior (e.g., `CASCADE` for `product_variants` on product deletion, `RESTRICT` for `order_items` to preserve order history)
- Inventory updates (decrement on order) handled via a database function/trigger to avoid race conditions, without requiring a full Edge Function
- No business logic duplicated between client and database — validation rules (e.g., required fields) enforced at the database level via constraints, not solely in the frontend
- Edge Functions deliberately deferred; revisit only when real payment processing or multi-step atomic workflows (e.g., payment + inventory + order creation as one transaction) are introduced
- Keep public and private storage access strictly separated — never store user-identifiable content in public buckets
