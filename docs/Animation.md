# ECOM* Theme Blueprint & Motion Specification

## 1. Overall Design Style & Visual Language

### Theme & Aesthetics
* **Design Philosophy:** Ultra-modern, premium minimalist, fashion-forward editorial layout. Employs strong asymmetric typographic weights, generous negative space, crisp structural lines, and content-driven visual scaling.
* **Mood:** Elegant, high-end, responsive, structured.

### Color Palette
- **Background Primary:** `#FFFFFF`
- **Background Secondary:** `#F9F9F9`
- **Text Primary:** `#000000`
- **Text Muted:** `#666666`
- **Accent/Sale:** `#FF0000`
- **Borders:** `#E5E5E5`

### Typography & Structure
* **Headings:** Bold, geometric sans-serif (e.g., Inter) with tight tracking (`-0.03em`).
* **Body:** Clean, medium-to-light weight sans-serif.
* **Grid:** Standard 12-column desktop grid.
* **Borders & Shadows:** `0px` border radius across all elements. No box shadows. Depth relies entirely on solid borders (`1px solid #E5E5E5`) and background shifts.

---

## 2. Page Structure

1. **Top Announcement:** Full-width marquee banner.
2. **Header:** Sticky flex-row (Logo, Nav Links, Cart/Search utilities).
3. **Hero Section:** Asymmetrical 2-column split. Oversized typography left, main asset right with a floating sub-card.
4. **Product Carousels:** Horizontal overflow rows for New Arrivals and Drops.
5. **Typographic Divider:** Full-width infinite text marquee belt.
6. **Categories:** 3-column asymmetric grid for demographic sorting.
7. **Best Sellers Grid:** Dynamic 4-column CSS grid controlled by upper flex-tabs.
8. **Trust Badges:** 4-column flex row with micro-icons.
9. **Instagram Gallery:** Compact, seamless multi-image grid.
10. **Footer:** Multi-column directory and newsletter input.

---

## 3. Motion & Animation Detail

**Global Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Quart) for ultra-smooth structural reveals.

* **Infinite Marquees (Top Bar & Divider):**
  - **Trigger:** Auto-run on mount.
  - **Action:** `transform: translateX(0%)` to `-50%`. 
  - **Duration:** 15s - 25s (Linear ease).
* **Scroll Reveals (Sections & Grids):**
  - **Trigger:** Intersection Observer.
  - **Action:** `opacity: 0; transform: translateY(30px)` to `opacity: 1; translateY(0)`.
  - **Duration:** 0.8s (Staggered by 0.08s for grids).
* **Hero Floating Card:**
  - **Trigger:** Auto-run.
  - **Action:** Sinusoidal Y-axis oscillation (`translateY(-6px)` to `6px`). Duration: 4.5s (Ease-in-out, infinite).
* **Product Card Hover:**
  - **Trigger:** Pointer hover.
  - **Action:** Image scales (`scale(1.00)` to `1.04`). Quick-add button slides up from bottom (`translateY(100%)` to `0%`).
* **Dynamic Grid Filtering:**
  - **Trigger:** Click on category tab.
  - **Action:** Current items scale down and fade (`scale: 0.96, opacity: 0`), new items scale up and fade in.

---

## 4. Component Inventory

* `MarqueeTicker`
* `StickyNavigation`
* `HeroStage`
* `CarouselWrapper`
* `ProductCard`
* `FilterTabs`
* `DynamicGrid`
* `InputGroup`

---

## 5. Responsive Behavior

* **Mobile (< 768px):** 1-column layout. Carousels use native horizontal touch scrolling (`overflow-x: scroll`). Navigation collapses into a full-screen overlay menu.
* **Tablet (768px - 1024px):** 2-column arrays. Core padding system locks cleanly to uniform tracking margins.
* **Desktop (> 1024px):** 12-column grids, 4-column product displays, full structural expansion.

---

## 6. Prompt Instructions for Claude

**Copy the text below into Claude to generate the code:**

> Act as a Principal Frontend Engineer and Lead Motion UI Designer. Build a production-ready, highly responsive e-commerce web platform inspired by premium editorial design systems.
> 
> Strict Architectural Restraints:
> 1. Color Palette: Clean white backgrounds (#ffffff), secondary accents (#f9f9f9), deep black primary typography (#000000), subtle gray structural elements (#666666), and vivid red flags (#ff0000) for active promotional indicators.
> 2. Structure & Contours: Enforce strict 0px border-radius values across all structural components (buttons, text inputs, graphic containers). Do not introduce box-shadow definitions; separate layered sections using clear background shifts or thin border lines (1px solid #e5e5e5).
> 3. Typographic Styling: Implement heavy, tightly tracked headings alongside geometric, highly legible modern sans-serif body copy.
> 4. Key Interactive Modules:
>    - An infinite looping ticker banner running horizontally along the top margin.
>    - A fully sticky navigational header using a backdrop-blur mask filter effect.
>    - An asymmetrical two-column Hero display integrating a floating accent element executing an automatic vertical float cycle.
>    - Product rows rendering clear product visual stages, item titles, and active tracking components.
>    - A robust category collection section sorting items seamlessly on the client side using micro-interactions.
>    - A clean layout footer incorporating an input box that responds dynamically to user focus events.
> 
> Deliver standard, highly maintainable code implementations utilizing modern component workflows (React/Next.js preferred). Integrate Framer Motion mapped directly against premium easing vectors (e.g., cubic-bezier(0.16, 1, 0.3, 1)). Ensure code logic handles grid shifts cleanly across standard mobile, tablet, and desktop breakpoints.