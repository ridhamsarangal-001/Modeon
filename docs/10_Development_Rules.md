# Development Rules — Modeon

**Version:** 1.0
**Foundation:** All prior Modeon documents (01_PRD → 09_Security, 11_Catalog)
**Audience:** Human developers and AI development agents (Claude Code, Z.ai, Gemini, Cursor)
**Purpose:** This document is the binding coding standard for Modeon. Any code — human-written or AI-generated — must conform to these rules. Where a rule references another document (e.g., Design.md, TRD.md), that document remains the source of truth for its domain; this document governs *how code is written*, not *what the product does*.

---

## 1. Code Philosophy

- **Clarity over cleverness.** Code should read like well-organized prose. If a reviewer needs to pause to decode intent, simplify it.
- **Restraint mirrors the brand.** Modeon's design philosophy (quiet luxury, minimal, intentional) extends to code: no unnecessary abstraction, no speculative complexity, no unused flexibility "just in case."
- **Server-first by default.** Favor Server Components and server-side logic; reach for client-side interactivity only when the UI genuinely requires it (per 07_TRD.md).
- **Consistency beats personal preference.** Every contributor — human or AI — follows the same patterns defined here, even if a different approach is equally valid in isolation.
- **Built to be replaced.** Mock data, mock auth, and the API layer must remain cleanly swappable for Supabase (already true per 08_Supabase_Backend.md) — code should never assume mock data is permanent.

---

## 2. Folder Structure Rules

Feature-based organization, aligned with the App Router route groups defined in 07_TRD.md:

```
app/
  (shop)/
  (checkout)/
  (auth)/
  (account)/
  (admin)/
  api/
components/
  ui/              # Shared primitives: Button, Input, Card, Modal, Badge
  product/         # Product card, gallery, variant selector
  cart/            # Cart drawer, cart line item
  checkout/        # Checkout form sections
  account/         # Dashboard widgets, order history, address forms
  admin/           # Admin-only components
  layout/          # Header, footer, navigation shell
config/
  brand.ts         # Brand name, tagline, contact, social links
  site.ts          # SEO defaults, metadata, legal info
  navigation.ts    # Nav labels and structure
lib/
  supabase/        # Supabase client setup (browser + server)
  services/        # Data-access service functions (per 07_TRD.md API layer)
  validation/      # Zod schemas
  utils/           # Pure utility functions
  constants/       # Non-brand constants (e.g., badge types, size charts)
store/
  cart-store.ts
  wishlist-store.ts
  ui-store.ts
types/
  product.ts
  order.ts
  user.ts
  ...
data/              # Mock JSON (pre-Supabase-migration data)
```

**Rules:**
- A component belongs in a feature folder (`components/product/`, etc.) if it's specific to that domain; it belongs in `components/ui/` only if it's genuinely generic and reused across 2+ features.
- Route-specific, non-reusable components may be colocated inside their route folder (e.g., `app/(checkout)/checkout/_components/`) if they will never be reused elsewhere.
- No file exceeds ~250 lines as a soft guideline; if a component grows beyond that, it likely needs to be decomposed.

---

## 3. Component Architecture

- **Server Components are the default.** Add `"use client"` only when a component needs interactivity, browser APIs, hooks like `useState`/`useEffect`, or a Zustand store.
- **Push client boundaries down.** If only a small part of a component needs interactivity (e.g., a wishlist icon on a product card), extract that piece into its own small Client Component rather than converting the whole parent.
- **One component, one responsibility.** A component should do one clear thing (display a product card, render a form field) — compose larger UI from smaller components rather than building monoliths.
- **Props over context, context over global state.** Prefer passing props for local data; use React Context only for truly global concerns (theme); use Zustand for cross-cutting client state (cart, wishlist, UI state).
- **No business logic inside components.** Data transformation, price calculations, and validation logic live in `lib/utils/` or `lib/services/`, not inline in JSX-adjacent code — this keeps components testable and readable.

---

## 4. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Component files | PascalCase | `ProductCard.tsx` |
| Utility/hook files | camelCase | `formatPrice.ts`, `useCartStore.ts` |
| Folders | kebab-case | `product-detail/` |
| React components | PascalCase | `function ProductCard()` |
| Functions/variables | camelCase | `getProductBySlug()` |
| Types/interfaces | PascalCase | `interface ProductVariant` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_CART_QUANTITY` |
| Zustand stores | camelCase, `use` prefix | `useCartStore` |
| Zod schemas | camelCase, `Schema` suffix | `checkoutFormSchema` |

These conventions match the database naming rules in 08_Supabase_Backend.md (snake_case) — a mapping layer in `lib/services/` converts between snake_case (Supabase) and camelCase (TypeScript) at the data-access boundary, never leaking snake_case into components.

---

## 5. TypeScript Rules

- `strict: true` enforced in `tsconfig.json` (per 07_TRD.md) — no exceptions.
- `any` is disallowed except in rare, explicitly commented edge cases (e.g., typing an untyped third-party callback) — prefer `unknown` with type narrowing.
- All shared data shapes (Product, Order, User, etc.) are defined once in `types/` and imported everywhere — never redefined inline or duplicated.
- Component props are always typed with an explicit `interface` or `type`, never implicit `any` via missing annotations.
- Prefer `type` for unions/utility compositions, `interface` for object shapes that may be extended — used consistently, not interchangeably at random.
- Zod schemas are the single source of truth for form/API input types — infer TypeScript types from schemas (`z.infer<typeof schema>`) rather than maintaining parallel manual types.

---

## 6. React Best Practices

- Functional components only — no class components.
- Hooks follow the Rules of Hooks strictly (no conditional hooks, no hooks in loops).
- Derive state where possible instead of duplicating it (`useMemo` for computed values, not `useState` + `useEffect` to sync).
- Keys in lists are stable, unique identifiers (e.g., `product.id`), never array index, unless the list is guaranteed static and unordered.
- Avoid `useEffect` for logic that can be handled during render or via event handlers — reserve `useEffect` for genuine side effects (subscriptions, external syncing).
- Co-locate related state; avoid prop-drilling more than 2–3 levels — if it goes deeper, reconsider whether that state belongs in a Zustand store instead.

---

## 7. Next.js Conventions

- **App Router only** — no Pages Router patterns.
- Route groups (`(shop)`, `(checkout)`, `(auth)`, `(account)`, `(admin)`) organize features without affecting URLs, per 07_TRD.md.
- Metadata (SEO) defined via the App Router's `generateMetadata` / `metadata` export, sourced from `config/site.ts` — never hardcoded per page.
- Loading and error states use Next.js's `loading.tsx` and `error.tsx` conventions per route segment, working in tandem with the skeleton/empty/error patterns defined in 05_UI_UX.md.
- Dynamic routes (e.g., `products/[slug]`) use descriptive, typed params — no untyped `any` route params.
- Images always use `next/image`; fonts always use `next/font` (per 11_Catalog.md media rules and 07_TRD.md performance section).

---

## 8. State Management (Zustand)

- Stores are **modular and feature-scoped** — separate stores for cart, wishlist, and UI state (drawers/overlays/filters), never one monolithic global store (per 07_TRD.md).
- Each store lives in its own file in `store/`, exporting a single typed hook (e.g., `useCartStore`).
- Store actions (add, remove, update) are defined inside the store itself — components call actions, they never mutate store state directly.
- Persisted state (cart, wishlist for guests) uses Zustand's `persist` middleware backed by `localStorage`, per the guest-to-account merge flow in 06_App_Flow.md and 08_Supabase_Backend.md.
- Server data (fetched via Server Components) is never duplicated into Zustand unless it needs to be mutated client-side — avoid redundant state copies.

---

## 9. API / Route Handler Rules

- Route Handlers (`app/api/*`) act as the mock REST layer wrapping Supabase/mock data, per 07_TRD.md and 08_Supabase_Backend.md.
- Every Route Handler validates input with a Zod schema before processing — no unvalidated request bodies reach service functions.
- Every Route Handler checks authentication/role where relevant, consistent with 09_Security.md's API Security rules — no endpoint trusts client-supplied `user_id` without cross-checking the session.
- Responses follow a consistent shape: `{ data, error }` — never a bare object on success and a different shape on failure.
- Route Handlers contain **no business logic** — they call functions from `lib/services/`, keeping the handler itself a thin, predictable layer.
- Rate limiting middleware applies to sensitive Route Handlers (search, checkout) per 09_Security.md.

---

## 10. Supabase Integration Rules

- Two Supabase clients: a browser client (anon key, respects RLS) and a server client (used in Server Components/Route Handlers, session-aware).
- The **service role key** is never used outside secure, necessary server-side operations, and never bundled into client code (per 09_Security.md).
- All Supabase queries go through `lib/services/` functions — components and Route Handlers never call the Supabase client directly. This preserves the swap-ready abstraction from 07_TRD.md and 08_Supabase_Backend.md.
- Table/column names (snake_case) are mapped to camelCase TypeScript types at the service layer boundary — never leaked upward.
- RLS is always assumed to be the primary access control; service functions do not attempt to duplicate authorization logic that RLS already enforces.

---

## 11. Database Access Guidelines

- No raw SQL in application code — use Supabase's query builder or typed RPC calls only.
- Every query that could return "no results" handles that case explicitly (empty state), never assumes data presence.
- Pagination used for any list that could exceed ~24–48 items (product grids, order history) rather than fetching unbounded result sets.
- Mutations (insert/update/delete) always go through a service function that also handles the corresponding error case — never a bare, unguarded Supabase call in a component or handler.

---

## 12. Error Handling

- Errors are caught at the boundary closest to where they occur (service function, Route Handler) and normalized into a consistent shape before reaching the UI.
- Route-segment `error.tsx` boundaries handle unexpected rendering errors per route group, preventing full-app crashes (per 07_TRD.md).
- User-facing error messages follow the calm, non-alarming tone defined in 04_Content.md and 05_UI_UX.md — never raw error strings or stack traces shown to users.
- All errors are logged server-side (console in development; see Section 22) with enough context to debug, without logging sensitive data (per 09_Security.md).
- Network/data errors always provide the user a clear next step (retry, go back, contact support) — never a dead end.

---

## 13. Form Validation

- **Zod + React Hook Form** for all forms (auth, checkout, admin, newsletter) — this is the locked standard for the project.
- Each form has a single Zod schema in `lib/validation/`, reused for both client-side validation and server-side Route Handler validation — no duplicated validation logic.
- Validation is inline and real-time (per 05_UI_UX.md), surfacing field-level errors as the user completes the form, not only on submit.
- Server-side validation is mandatory even when client-side validation exists — the client is never trusted alone (per 09_Security.md).

---

## 14. Styling Conventions (Tailwind)

- Tailwind CSS utility classes are the default styling method — no separate CSS files per component unless a genuinely complex animation/layout requires it.
- All design tokens (colors, spacing, radius, shadows, typography scale) are defined in `tailwind.config.ts`, sourced directly from 02_Design.md — never hardcoded hex values or magic numbers in component code.
- Class ordering follows a consistent logical grouping (layout → spacing → typography → color → state) for readability; a tool like `prettier-plugin-tailwindcss` auto-sorts classes.
- Repeated utility combinations (e.g., a card's base styling) are extracted into a shared component or a `cva` (class-variance-authority) variant definition — not copy-pasted across files.
- Dark mode styling uses Tailwind's `dark:` variant, driven by the token swap defined in 02_Design.md — components never branch dark/light logic in JavaScript.

---

## 15. Responsive Design Rules

- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`, `xl`) applied consistently, matching the breakpoint table in 05_UI_UX.md.
- Every new component is built and verified at mobile, tablet, and desktop widths before being considered complete.
- Layout-shifting patterns (drawers, bottom sheets on mobile vs. side panels on desktop) follow the specific behaviors defined in 05_UI_UX.md — not ad-hoc per component.

---

## 16. Accessibility Basics

- Semantic HTML first — `<button>` for actions, `<a>` for navigation, proper heading hierarchy (`h1`–`h6`) per page.
- All interactive elements are keyboard-reachable with visible focus states (per 09_Security.md and 05_UI_UX.md).
- Images require meaningful `alt` text; decorative images use empty `alt=""`.
- Form inputs are always programmatically associated with labels (via `htmlFor`/`id` or wrapping).
- Modals, drawers, and overlays trap focus and are dismissible via `Escape`, per 05_UI_UX.md.
- Color is never the sole means of conveying information (e.g., stock status also uses text/icon, not just a color badge).

---

## 17. Performance Guidelines

- Server Components used by default to minimize client-side JavaScript (per 07_TRD.md).
- `next/image` used for all product/editorial imagery with correct `sizes` and priority hints for above-the-fold images.
- Heavy Client Components (search overlay, checkout form) are dynamically imported where it meaningfully reduces initial bundle size.
- Zustand store slices remain feature-scoped so unrelated state changes don't trigger unnecessary re-renders across unrelated components.
- Avoid unnecessary client-side data fetching for data that could be fetched once on the server and passed down as props.

---

## 18. Animation Implementation Rules

- All motion timing, easing, and interaction patterns follow **03_Animation.md** as the single source of truth — this document does not redefine motion specifics.
- Framer Motion is used only in Client Components; animated components stay as small and isolated as possible to avoid forcing large sections of the tree into client-side rendering.
- Respect `prefers-reduced-motion` — all animation must degrade gracefully (per 05_UI_UX.md accessibility rules), never a hard requirement for usability.
- Animations enhance state changes (hover, add-to-cart, drawer open) — they never gate core functionality (i.e., content/actions must remain usable if animation fails to load).

---

## 19. Image & Media Handling

- All media paths and organization follow the folder structure and naming convention defined in **11_Catalog.md** exactly — no deviation, so assets remain swappable without code changes.
- `next/image` is mandatory for all raster images; native `<video>` with `muted`, `loop`, and `playsInline` for background/showcase videos, per 11_Catalog.md's video content rules.
- Aspect ratios per media type follow 11_Catalog.md's Aspect Ratio Standards table — enforced via consistent container/CSS classes, not per-instance overrides.
- Alt text for product images is generated from the product name and context (e.g., "The Essential Coat — front view") — never left empty for meaningful content images.

---

## 20. Environment Variables

- Public Supabase config (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) exposed via `NEXT_PUBLIC_*` prefix.
- Service role key and any future secrets (payment provider keys, etc.) are server-only env variables, never `NEXT_PUBLIC_*`-prefixed, per 09_Security.md.
- `.env.local` is git-ignored; a `.env.example` file documents required variables (names only, no real values) for any developer or AI agent setting up the project.
- Environment variables are accessed through a typed config accessor (not scattered `process.env.X` calls throughout the codebase) to catch missing variables early and consistently.

---

## 21. Git / Code Organization

- **Conventional Commits**, committed directly to `main` (per project decision): `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `style:`, `perf:`, `test:`.
- Commit messages are scoped and specific (e.g., `feat(cart): add quantity update logic`) rather than vague (`update stuff`).
- Each commit represents one logical unit of work — avoid bundling unrelated changes into a single commit, even when committing directly to `main`.
- Feature branches may be introduced later without changing the commit message convention, if collaborators join (per project decision).

---

## 22. Logging & Debugging

- Development: `console.log`/`console.error` permitted for local debugging but must be removed or gated before commit — no debug logs left in committed code.
- Server-side errors are logged with route/context information (per 09_Security.md) — never logging sensitive data (tokens, passwords, full PII).
- Production logging remains minimal at this project stage; no external logging service is required now, but the logging call sites are structured so a service (e.g., Sentry) could be introduced later without refactoring call sites throughout the app.

---

## 23. Reusable Utility Functions

- Pure, single-purpose functions live in `lib/utils/` (e.g., `formatPrice`, `formatDate`, `getStockStatusLabel`) — no side effects, fully typed inputs/outputs.
- If a formatting or calculation pattern is used in more than one place, it is extracted into `lib/utils/` immediately — not duplicated "temporarily."
- Utility functions are covered by the minimal unit testing strategy where they involve business-critical logic (pricing, inventory, cart totals), per the project's testing decision.

---

## 24. Constants & Configuration

Two distinct layers, per the project's locked architecture decision:

- **`config/`** — business/brand-specific values: `brand.ts` (name, tagline, contact, social links), `site.ts` (SEO defaults, legal info), `navigation.ts` (nav structure/labels). These are the values that would change if Modeon were adapted into a different niche.
- **`lib/constants/`** — non-brand technical constants: badge type enums, size chart values, filter options, pagination limits. These stay stable regardless of branding.
- **Design tokens** (colors, typography, spacing, shadows, breakpoints) live exclusively in `tailwind.config.ts`, never duplicated into `config/brand.ts` — Design.md is their single source of truth.

This separation directly supports the PRD's long-term vision: rebranding Modeon into a new niche means editing `config/` and `tailwind.config.ts` — not touching component logic.

---

## 25. Code Comments & Documentation

- Code should be self-explanatory through clear naming; comments are reserved for genuinely non-obvious logic (e.g., a specific RLS-related query behavior, an intentional workaround).
- Shared service functions, Zustand stores, and utility functions in `lib/` and `store/` include a brief JSDoc-style summary (what it does, key params/returns) — UI components generally do not need this level of documentation.
- Any deliberate deviation from these Development Rules must be commented inline explaining why, so future developers/AI agents don't "fix" an intentional exception.

---

## 26. Testing Expectations

- **Minimal unit testing only**, scoped to critical business logic: cart total calculations, price/discount logic, inventory status derivation, and shared utility functions (per project decision).
- No component testing or end-to-end testing at this project stage — manual QA and TypeScript's compile-time checks cover UI correctness.
- Tests live alongside the logic they cover (e.g., `formatPrice.test.ts` next to `formatPrice.ts`) using a standard test runner (Vitest recommended for Next.js/TypeScript projects).
- This scope may expand later (e.g., adding checkout E2E tests) if the project moves toward real payment integration — not required for the current demo stage.

---

## 27. Future Scalability Guidelines

- The service-function abstraction (Section 10–11) is what allows Supabase, real payments, or a real backend to be integrated later without touching UI code — this boundary must never be bypassed for convenience.
- The `config/` layer (Section 24) is what allows Modeon to be rebranded into a new niche with minimal code changes — brand values must never leak into component logic or hardcoded strings.
- New features should default to the existing patterns in this document rather than introducing new architectural approaches — consistency compounds into maintainability as the codebase grows.
- If a new pattern is genuinely needed (not covered here), it should be added to this document before being used a second time, so the standard stays current and AI agents continue generating consistent code.

---

## Assumptions

- Vitest is recommended as the test runner for the minimal unit testing scope (Section 26), as the modern standard for Next.js/TypeScript projects; no strong project requirement dictated otherwise.
- `prettier-plugin-tailwindcss` and `class-variance-authority` (`cva`) are assumed as standard tooling for class sorting and variant management, consistent with modern Tailwind/Next.js best practice.
- These are implementation-level tooling choices, not architectural decisions, and can be swapped for equivalent tools without affecting this document's core rules.
