# UI/UX Guide — Modeon

## Navigation Behavior
Header hides on scroll down and reappears immediately on scroll up, keeping navigation accessible without permanently occupying screen space. Header remains fully visible at the top of the page and on page load. Active section/page indicated subtly in nav state. Mobile nav collapses into a slide-out menu, following the same hide/reveal scroll behavior.

## Search Experience
Full-screen search overlay triggered from header icon. Includes:
- Live suggestions as the user types (products, categories)
- Recent searches (session-based)
- Trending searches (curated/mock)
- Instant visual product previews within results
- Clear empty state when no matches found
Overlay closes via close icon, outside click, or escape key.

## Filter & Sort Behavior
- Filters accessible via a persistent bar or slide-in panel (mobile: bottom sheet or drawer)
- Multiple filters can be applied simultaneously with visible active filter tags
- Applied filters removable individually or via "Clear All"
- Sort options (e.g., price, newest) in a simple dropdown
- Product grid updates in place without full page reload
- Filter/sort state persists during the session

## Product Card Interaction
- Hover reveals secondary product image (desktop)
- Quick "Add to Selection" and wishlist icon appear on hover/tap
- Tapping card (mobile) or clicking (desktop) navigates to product page
- Wishlist icon toggles state with immediate visual feedback
- Out-of-stock items clearly indicated on the card itself

## Product Page UX
- Sticky product info panel: images scroll independently in a gallery; product info, price, and primary CTA remain fixed/visible
- Variant selection (size/color) with clear selected-state feedback
- "Add to Selection" CTA always accessible without scrolling back up
- Secondary actions (wishlist, share) positioned near primary CTA
- Related/complete-the-look products shown below main content

## Cart & Checkout UX

**Cart:** Slide-in drawer from the right. Users can update quantities, remove items, view subtotal, continue shopping, or proceed to checkout — all without leaving the current page. Drawer shows empty state when no items are present.

**Checkout:** Single-page layout with clearly separated sections (Shipping, Payment, Order Summary). Inline validation per field. Order summary remains visible/sticky while completing the form. Distraction-free — no navigation away from the flow once initiated.

## Authentication UX
- Login/Signup presented as a focused modal or dedicated minimal page (no distracting navigation)
- Clear toggle between "Log In" and "Sign Up"
- Inline validation with immediate, specific feedback
- Password visibility toggle
- Clear path to password recovery
- Post-auth, user returns to the page/action they initiated (e.g., checkout)

## Form Validation
- Inline, real-time validation as the user completes each field (not only on submit)
- Errors shown directly beneath the relevant field, specific and actionable
- Success indication (e.g., checkmark) for correctly completed required fields
- Submit action disabled/blocked until required fields are valid
- Validation tone matches brand voice — calm, clear, never alarming

## Loading States
- Skeleton loaders for product grids, product pages, and cart contents (not spinners)
- Subtle inline loading indicator for button actions (e.g., "Add to Selection" while processing)
- Full-page loading reserved only for initial app load

## Empty States
- Empty cart, empty wishlist, and empty search results each have a distinct, calm message with a clear next action (e.g., "Explore the Collection")
- Empty states never feel like errors — framed as an invitation to browse

## Error Handling
- Errors communicated inline and contextually, never via disruptive full-page takeovers unless critical
- Network/system errors show a calm retry option
- Out-of-stock or unavailable actions clearly explained at the point of interaction
- Checkout errors highlight the specific field/section needing correction without clearing entered data

## Success Feedback
- Lightweight confirmation for micro-actions (add to cart, wishlist) via subtle toast or inline state change — no full-page interruption
- Order confirmation after checkout shown as a dedicated, clear success state with order summary
- Newsletter signup and form submissions confirmed with brief, calm messaging

## Mobile UX
- Bottom-accessible primary actions where relevant (e.g., sticky "Add to Selection" bar on product page)
- Filters and cart use bottom sheet/drawer patterns suited to touch
- Search overlay optimized for full-screen mobile use with easy dismissal
- Minimum comfortable touch target sizing throughout
- Single-column layouts for product pages and checkout on mobile

## Accessibility Guidelines
- All interactive elements reachable and operable via keyboard
- Focus states clearly visible at all times
- Modals, drawers, and overlays trap focus appropriately and are dismissible via keyboard (Escape)
- Form fields programmatically associated with labels and error messages
- Sufficient touch target sizing and spacing on mobile
- Motion-based UI (drawers, overlays) respects reduced-motion preferences

## General Interaction Rules
- Every user action receives clear, immediate feedback (visual state change, message, or transition)
- No destructive action (e.g., remove from cart) occurs without being easily reversible or confirmed
- Consistent interaction patterns across similar components (all drawers behave the same way, all overlays behave the same way)
- Interface prioritizes clarity and calm over density — when in doubt, simplify
