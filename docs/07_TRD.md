# Technical Requirements Document (TRD) — Modeon

**Version:** 1.0
**Foundation:** PRD.md, Design.md, 05_UI_UX.md, 06_App_Flow.md

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Animation | Framer Motion (per Animation.md) |
| State Management | Zustand (client state), React Context (global providers) |
| Data Fetching | Native fetch via Server Components |
| API Layer | Next.js Route Handlers (mock REST API) |
| Linting/Formatting | ESLint + Prettier |

---

## 2. Project Architecture

Server-first architecture using Next.js App Router. Server Components handle data fetching and rendering by default; Client Components are used only where interactivity or client-side state is required (cart drawer, wishlist toggles, forms, search overlay, filters).

The frontend is fully decoupled from data sourcing via a dedicated API layer, allowing the mock backend to be replaced with a real backend (e.g., Supabase) without changes to UI or component logic.

---

## 3. Folder Structure

Organized by route groups (feature-based) under the App Router, with shared logic separated from route-specific code:

- `app/(shop)` — homepage, collections, product pages
- `app/(checkout)` — cart, checkout flow
- `app/(auth)` — login, signup
- `app/(account)` — account dashboard, orders, wishlist, addresses
- `app/(admin)` — admin dashboard (UI only)
- `app/api` — Route Handlers (mock REST endpoints)
- `components/` — shared, reusable UI components
- `lib/` — service functions, API client, utilities
- `store/` — Zustand stores (cart, wishlist, UI state)
- `types/` — shared TypeScript types/interfaces
- `data/` — local JSON/mock data sources

---

## 4. Routing Strategy

Next.js App Router with route groups for feature-based organization: `(shop)`, `(checkout)`, `(auth)`, `(account)`, `(admin)`. Route groups do not affect the URL structure but keep the codebase organized and scalable as features grow. Nested layouts used for shared UI (e.g., account dashboard layout, admin layout) within each group.

---

## 5. Component Architecture

Components are built as small, reusable, composable units following a clear separation:
- **Server Components (default):** Data-driven, non-interactive UI (product grids, product details, static sections)
- **Client Components (explicit `"use client"`):** Interactive UI requiring state or browser APIs (cart drawer, search overlay, forms, filters, wishlist toggles)

Shared components (buttons, cards, inputs, modals) live in a common `components/` directory and are theme- and token-driven per Design.md — no one-off styling.

---

## 6. State Management

- **Zustand:** Cart, wishlist, UI state (drawers, overlays, filters), and client-side session state
- **React Context:** Reserved for global providers only (e.g., theme/dark mode)
- No server state is duplicated into client state unnecessarily — Server Components fetch and pass data directly where possible

---

## 7. Data Fetching Strategy

Server Components fetch data natively via `fetch`, leveraging Next.js built-in caching and revalidation. Client Components fetch only when interactivity requires it (e.g., live search suggestions, filter updates), calling the internal API layer directly.

---

## 8. API Layer

Next.js Route Handlers (`app/api/*`) act as a mock REST API, wrapping local JSON data and service functions. This mimics a real backend's request/response structure, keeping the frontend fully decoupled. Service functions in `lib/` abstract all data access so Route Handlers — and eventually a real backend such as Supabase — can be swapped in without changes to components or pages.

---

## 9. Environment Variables

Environment variables reserved for future backend/service integration (e.g., API base URL, auth provider keys, payment provider keys). Not required for current mock-data implementation, but the config pattern (`.env.local`, typed access via a config module) should be established early to ease future integration.

---

## 10. Error Handling Strategy

- Server Components: handle fetch errors gracefully with fallback UI (per Empty/Error states in 05_UI_UX.md)
- Client Components: catch and surface errors via consistent inline messaging, never unhandled exceptions
- Route Handlers: return consistent, predictable error response structures (status + message) to simulate real API behavior
- Global error boundaries used at route-group level to prevent full-app crashes

---

## 11. Performance Optimization

- Server Components minimize client-side JavaScript by default
- Next.js Image component for all product/editorial imagery (optimized, lazy-loaded)
- Code-splitting via route groups and dynamic imports for heavy Client Components (e.g., search overlay, checkout)
- Avoid unnecessary re-renders by scoping Zustand store slices per feature (cart store separate from wishlist/UI store)
- Font optimization via Next.js font system

---

## 12. Code Standards

- TypeScript strict mode enabled (`strict: true`); avoid `any` wherever possible
- ESLint + Prettier enforced for consistent formatting and code quality
- Consistent naming conventions across components, hooks, and service functions
- Shared types/interfaces centralized in `types/` to avoid duplication
- Husky pre-commit hooks deferred — to be added later if team collaboration or project scale requires it

---

## 13. Scalability Guidelines

- Route-group structure supports adding new feature areas without disrupting existing ones
- Service-function/API-layer abstraction allows real backend (e.g., Supabase) integration without UI rework
- Component library designed for reuse across future niches/themes (per PRD's scalable-foundation goal)
- Zustand stores kept modular and feature-scoped to scale cleanly as new client state is introduced
- Admin dashboard structured independently so it can later connect to real management APIs

---

## 14. AI Development Guidelines

- All architectural decisions in this document should be treated as binding context for AI-assisted development (e.g., Claude Code)
- AI-generated code must follow the folder structure, component architecture, and state management patterns defined here
- AI should default to Server Components unless interactivity explicitly requires a Client Component
- AI should use the existing service/API layer pattern for any new data-dependent feature rather than fetching directly in components
- AI should maintain strict TypeScript typing and avoid introducing `any` types
- AI should reference Design.md, 05_UI_UX.md, and 06_App_Flow.md for any UI/UX-related implementation decisions rather than inferring new patterns
