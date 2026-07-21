# Security Architecture — Modeon

**Version:** 1.0
**Foundation:** 07_TRD.md, 08_Supabase_Backend.md
**Stack:** Next.js, Supabase (Auth, PostgreSQL, Storage, RLS)

---

## 1. Authentication Security

- Supabase Auth handles all authentication (email/password + Google OAuth) — no custom auth logic implemented
- Passwords never touch application code directly; Supabase manages hashing and storage
- OAuth (Google) uses Supabase's managed provider flow — no client secrets exposed in frontend code
- All auth state changes (login, logout, token refresh) handled via the official Supabase client SDK

---

## 2. Authorization & Roles

- Single `role` column on `profiles` (`customer` / `admin`) is the source of truth for authorization
- Role checks enforced at two levels: **database** (via RLS) and **application/middleware** (route protection)
- No role logic duplicated or hardcoded in frontend components — role state read from the authenticated session/profile only
- Design remains extensible for future roles (e.g., `super_admin`) without structural changes

---

## 3. Row Level Security (RLS)

- RLS enabled on **every table** — no table is publicly writable by default
- Policies follow the model defined in 08_Supabase_Backend.md:
  - Public read on catalog data (products, variants, categories, collections, media)
  - User-scoped read/write on personal data (cart, wishlist, addresses) via `user_id = auth.uid()`
  - Admin-only write on catalog/product management tables
  - Order data readable only by the owning user or an admin
- RLS is treated as the **primary enforcement layer** — frontend/UI restrictions are a UX convenience, never the sole security control

---

## 4. Database Security

- All database access goes through Supabase's managed PostgreSQL instance — no direct external DB connections from the client
- Service role key (bypasses RLS) is used **only** in secure server-side contexts (Route Handlers), never exposed to the client
- Foreign key constraints enforced with appropriate `ON DELETE` behavior to maintain referential integrity (per 08_Supabase_Backend.md)
- Sensitive fields (e.g., `guest_address` jsonb) are scoped to order ownership only — not globally readable

---

## 5. Storage Security

- Public buckets (`product-images`, `product-videos`, `editorial-media`): public read, admin-only write, enforced via Storage RLS policies
- Private bucket (`user-uploads`): access restricted to the owning user's folder path (`user_id`-scoped), plus admin read access
- No public bucket ever stores user-identifiable or sensitive content
- Storage policies mirror database RLS patterns for consistency

---

## 6. Environment Variables

- Supabase public keys (`anon` key, project URL) exposed via `NEXT_PUBLIC_*` env vars — safe by design, protected by RLS
- Supabase **service role key** stored as a server-only env variable, never prefixed with `NEXT_PUBLIC_`, never bundled into client code
- All secrets managed via `.env.local` (excluded from version control) and platform-level environment configuration in production
- No API keys, secrets, or credentials hardcoded in source files

---

## 7. Input Validation

- All form inputs (checkout, auth, admin forms) validated **client-side** for immediate feedback (per 05_UI_UX.md) and **server-side** in Route Handlers before any database write
- Server-side validation uses a schema validation library (e.g., Zod) to enforce types, required fields, and formats before data reaches Supabase
- Database-level constraints (`NOT NULL`, `CHECK`, enums) act as a final safeguard against invalid data, independent of application logic

---

## 8. Session Management

- Supabase default session handling: JWT access token + refresh token, auto-refreshed by the Supabase client SDK
- Session tokens stored via Supabase's secure client-side storage mechanism (handled by the SDK, not custom cookie/localStorage logic)
- Server Components/Route Handlers validate the session on each request via Supabase's server-side auth helpers — no manual token parsing
- Logout invalidates the session via Supabase Auth's sign-out method, clearing tokens client-side

---

## 9. Password Policy

- Minimum 8 characters, using Supabase Auth's default validation rules
- No custom complexity rules enforced beyond Supabase defaults, keeping friction low for a demo/portfolio context while remaining a reasonable baseline
- Password reset handled entirely through Supabase Auth's built-in recovery flow (email-based)

---

## 10. Rate Limiting

- Supabase Auth's built-in rate limiting protects login/signup/password-reset attempts
- Additional basic rate limiting applied at the middleware level to sensitive Route Handlers (e.g., search, checkout submission) to prevent abuse/spam
- Rate limiting is lightweight and request-count-based — sufficient for a demo-scale application, not a full WAF-level solution

---

## 11. Admin Security

- Admin routes (`app/(admin)`) protected by **middleware-level checks** that verify the user's session and `role = 'admin'` before any admin page renders — unauthorized users are redirected before reaching admin content
- RLS provides a second, independent layer of protection at the database level, so even a bypassed frontend check cannot expose or mutate admin-only data
- Admin actions (product/inventory management, order status updates) are only ever performed through authenticated, role-checked requests — never via publicly writable endpoints

---

## 12. API Security

- Next.js Route Handlers (mock REST API layer, per 07_TRD.md) validate the caller's session and role where relevant before processing requests
- No Route Handler trusts client-supplied identifiers (e.g., `user_id`) without cross-checking against the authenticated session
- Service role key usage confined to specific, necessary server-side operations — standard requests use the user's own session-scoped Supabase client, relying on RLS
- Error responses avoid leaking internal implementation details (e.g., raw database errors) to the client

---

## 13. File Upload Security

- Admin product media uploads restricted **client-side** (accepted file types: image/video, max file size) for immediate UX feedback
- **Server-side validation** re-checks file type, size, and MIME type before accepting any upload into Supabase Storage — client-side checks are never trusted alone
- Uploaded files are renamed/validated against the naming convention defined in 11_Catalog.md before storage, avoiding path traversal or naming conflicts
- Only authenticated admin sessions can trigger upload actions, enforced by both middleware and Storage RLS policies

---

## 14. Security Headers

Applied via Next.js configuration:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` — restricts allowed script/style/image/font/connect sources to trusted origins (self, Supabase project domain, required CDNs)
- `Referrer-Policy: strict-origin-when-cross-origin`

This "standard" tier balances strong baseline protection with practical implementation complexity appropriate for the project's scale.

---

## 15. Logging & Error Handling

- Server-side errors logged with enough context to debug (route, error type) without logging sensitive user data (passwords, tokens, full payment details)
- Client-facing error messages remain generic and calm (per 05_UI_UX.md tone) — detailed error information is never exposed to the end user
- Authentication and authorization failures are logged distinctly from general application errors, to support future monitoring/alerting if the project scales
- No sensitive data (tokens, service role key, raw request bodies with PII) written to logs

---

## 16. Security Best Practices

- Principle of least privilege applied throughout: RLS policies, storage access, and service role key usage all default to the minimum necessary access
- Security enforced at multiple independent layers (RLS + middleware + validation) so no single failure point compromises the system
- No security logic ever relies solely on frontend/UI restrictions — every sensitive action is backed by a database- or server-level check
- Environment separation maintained between development and production Supabase projects/keys
- Dependencies kept up to date; no use of deprecated or unmaintained auth/security-related packages
- This security posture is calibrated for a modern premium e-commerce demo/portfolio project — appropriately robust without introducing unnecessary complexity (e.g., no Edge Functions, no WAF, no malware scanning at this stage), consistent with 08_Supabase_Backend.md's phased approach
