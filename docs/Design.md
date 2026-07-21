# Design System — Modeon

**Version:** 1.0
**Foundation:** PRD.md
**Motion Reference:** Animation.md (finalized, referenced — not duplicated here)

---

## 1. Design Philosophy

Modeon's design language is **monochrome luxury** — quiet, editorial, and confident rather than loud or trend-driven. The system draws inspiration from premium editorial typography, generous whitespace, and Apple-style minimalism, without copying any specific brand's layout, assets, or content.

Core principles:
- **Restraint over decoration** — every visual element earns its place
- **Editorial hero moments, commercial product moments** — spacious storytelling at the top, efficient browsing below
- **Timeless, not trendy** — typography and shape language should age well
- **Consistency as luxury** — a disciplined, repeatable system feels more premium than novelty

---

## 2. Color Palette

| Token | Value | Usage |
|---|---|---|
| `color-primary` | `#111111` (Near Black) | Text, primary buttons, icons |
| `color-background` | `#F8F7F5` (Off White) | Base background |
| `color-accent` | `#C9A96E` (Warm Gold) | CTAs, highlights, active states, price emphasis |
| `color-surface` | `#FFFFFF` | Cards, modals, elevated surfaces (light mode) |
| `color-border` | `#E5E2DD` | Dividers, input borders, subtle separation |
| `color-muted` | `#6B6862` | Secondary text, captions, metadata |
| `color-error` | `#B3261E` | Form errors, destructive actions |
| `color-success` | `#3C6E47` | Confirmations, success states |

### Dark Mode Palette

| Token | Value | Usage |
|---|---|---|
| `color-primary-dark` | `#F8F7F5` | Text, icons (inverted) |
| `color-background-dark` | `#121212` | Base background (not pure black) |
| `color-surface-dark` | `#1C1C1C` | Cards, modals |
| `color-accent-dark` | `#D4B483` | Slightly lightened gold for contrast on dark |
| `color-border-dark` | `#2E2E2E` | Dividers, input borders |
| `color-muted-dark` | `#A3A099` | Secondary text |

Dark mode is a deliberate reinterpretation, not a simple invert — accent gold is slightly lightened for legibility, and background uses a soft near-black rather than pure black to preserve the editorial, premium feel.

---

## 3. Typography

| Role | Font Style | Usage |
|---|---|---|
| Display/Hero | Refined serif | Hero headlines, editorial section titles, campaign moments only |
| UI/Body | Modern sans-serif | Navigation, buttons, forms, product cards, body copy, all functional UI |

### Type Scale (tokens)

| Token | Size | Usage |
|---|---|---|
| `text-display` | 56–72px | Hero serif headlines |
| `text-h1` | 40px | Page/section titles (sans) |
| `text-h2` | 32px | Sub-section titles |
| `text-h3` | 24px | Card/group titles |
| `text-body-lg` | 18px | Lead paragraphs |
| `text-body` | 16px | Default body text |
| `text-small` | 14px | Captions, metadata |
| `text-micro` | 12px | Labels, tags |

**Principles:** High readability, generous line-height (1.5–1.6 for body), restrained letter-spacing on serif headlines for an editorial feel. Serif is never used for buttons, forms, or navigation.

---

## 4. Design Tokens

```
--radius-base: 8px
--radius-hero: 12px
--shadow-soft: 0 4px 16px rgba(17, 17, 17, 0.06)
--shadow-modal: 0 8px 32px rgba(17, 17, 17, 0.10)
--transition-base: 200ms ease (see Animation.md for full motion tokens)
```

Design tokens should be implemented as Tailwind theme extensions (colors, radius, shadows, spacing) to keep values centralized and consistent across components.

---

## 5. Grid & Layout

- **Hero/editorial sections:** Spacious, asymmetric or full-bleed layouts, generous margins, fewer elements per viewport — magazine-style storytelling
- **Product listings:** Balanced commercial grid — 4 columns desktop, 2–3 tablet, 2 mobile
- **Max content width:** 1440px container, centered, with fluid padding
- **Column gutter:** 24–32px desktop, 16px mobile

---

## 6. Spacing System

8px base unit scale for consistency across all components:

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 16px |
| `space-4` | 24px |
| `space-5` | 32px |
| `space-6` | 48px |
| `space-7` | 64px |
| `space-8` | 96px |

Editorial/hero sections use larger vertical rhythm (`space-7`–`space-8`); commercial/product sections use tighter, consistent spacing (`space-3`–`space-5`).

---

## 7. Border Radius

- **Base radius (system-wide):** 8px — applied to cards, buttons, inputs, modals, dropdowns
- **Hero radius:** 12px — reserved exclusively for large hero images and editorial section imagery where it improves visual balance
- No sharp (0px) or heavily rounded (16px+) elements — consistency is part of the premium feel

---

## 8. Shadows

Shadows are used sparingly and only where they clarify hierarchy:

- **Cards:** `shadow-soft` on hover only (static cards remain flat, separated by spacing/border)
- **Modals/Dropdowns:** `shadow-modal` for clear elevation above content
- **Default/static state:** No shadow — rely on `color-border` and whitespace

---

## 9. Buttons

| Variant | Style |
|---|---|
| Primary | Near Black background, Off White text, 8px radius |
| Secondary | Transparent/outlined, Near Black border and text |
| Accent | Warm Gold background, Near Black text — reserved for key CTAs (Add to Cart, Checkout) |
| Ghost/Text | No background/border, used for tertiary actions |

- Sans-serif typography only, medium weight
- Consistent padding scale (`space-3` vertical, `space-4` horizontal)
- Subtle hover/active states per Animation.md

---

## 10. Forms

- Inputs: 8px radius, `color-border` default, Near Black or Warm Gold focus ring
- Labels: sans-serif, `text-small`, positioned above fields
- Error states: `color-error` border and helper text
- Consistent vertical spacing between fields (`space-4`)
- Checkout and auth forms follow the same input styling for consistency

---

## 11. Cards

- **Product Cards:** Image-forward, 8px radius, minimal border or flat with hover shadow, product name (sans), price (sans, gold accent for emphasis)
- **Editorial Cards:** May use serif headline overlay on imagery, more generous padding
- Consistent aspect ratios within each grid for visual rhythm

---

## 12. Navigation

- **Header:** Minimal, Near Black text on Off White (or transparent over hero imagery), logo left, nav center/right, cart/account icons right
- **Mobile:** Collapses to hamburger/slide-out menu, same typography rules apply
- Sticky on scroll with subtle background transition (per Animation.md)

---

## 13. Footer

- Structured multi-column layout (Shop, Company, Support, Newsletter)
- Off White or Near Black background depending on section context
- Sans-serif throughout, `text-small` for links, generous top padding to separate from content

---

## 14. Icons

- Line-based, minimal, consistent stroke width (1.5–2px)
- Near Black default, Warm Gold for active/selected states
- No filled or decorative icon sets — consistent with restrained visual language

---

## 15. Images & Photography Style

- Clean, editorial product photography — neutral or soft-toned backgrounds
- Consistent lighting and color grading across product imagery
- Lifestyle imagery used in hero/editorial sections only, not product grids
- No busy or cluttered compositions — imagery should breathe, consistent with whitespace philosophy

---

## 16. Responsive Rules

| Breakpoint | Width | Grid Columns (Product) |
|---|---|---|
| Mobile | < 640px | 2 |
| Tablet | 640–1024px | 2–3 |
| Desktop | 1024–1440px | 4 |
| Large Desktop | > 1440px | 4 (max-width container) |

- Typography scales down proportionally on mobile (hero serif reduces ~40%)
- Navigation collapses to mobile menu below 1024px
- Touch targets minimum 44px on mobile

---

## 17. Dark Mode

- **Default theme:** Light
- **Toggle:** User-controlled, persisted across session
- Dark mode is a deliberate re-expression of the same editorial premium aesthetic — not an automatic inversion
- Accent gold is adjusted (lightened) for contrast; backgrounds use soft near-black rather than pure black
- All spacing, radius, and typography rules remain identical between themes — only color tokens change

---

## 18. Accessibility

- WCAG AA contrast minimum for all text/background combinations (including gold accent on both themes)
- Visible focus states on all interactive elements (Near Black or Gold focus ring)
- Semantic HTML structure across components
- Alt text required for all product and editorial imagery
- Keyboard navigability across nav, forms, cart, and checkout flows

---

## 19. Motion Guidelines

Full motion specifications (durations, easing curves, transition patterns) are defined in **Animation.md** and should be treated as the single source of truth for all animated behavior.

This Design.md defines *what* moves conceptually:
- Hero/editorial sections: slow, cinematic entrance transitions
- Product grid: subtle fade/slide-in on scroll, hover elevation on cards
- Navigation: smooth sticky-header transitions
- Modals/dropdowns: soft scale/fade entrances, matching `shadow-modal`
- Buttons: subtle micro-interactions on hover/press

Refer to Animation.md for exact timing, easing functions, and implementation details.

---

## 20. Component Guidelines

- All components must be built as reusable, composable units (per PRD architecture requirements)
- Every component must support both light and dark theme tokens — no hardcoded colors
- Consistent use of design tokens (spacing, radius, shadow, typography) across all components — no one-off values
- Components should be documented with clear prop interfaces to support future scalability and backend integration
- Editorial-style components (hero, campaign banners) are visually distinct but must still respect the base spacing and radius system for overall cohesion

---

## Assumptions

- Animation.md is treated as finalized and authoritative for all motion timing/easing details
- Specific font families (serif and sans-serif) are not locked to exact typefaces in this document — implementation may select any refined serif + modern sans-serif pairing consistent with the described aesthetic
- Icon set library (e.g., Lucide, Phosphor) to be selected during implementation, following the line-based minimal style defined here

---

## Next Document

With PRD.md and Design.md finalized, the next step is component-level implementation planning or a dedicated `Component-Spec.md` if granular UI component documentation is needed before development begins.
