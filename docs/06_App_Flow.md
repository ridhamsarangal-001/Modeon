# App Flow — Modeon

## Primary User Journey
Homepage → Browse/Search → Product Detail → Add to Cart or Wishlist → Cart Review → Checkout → Order Confirmation → (Optional) Account Creation → Account Dashboard.

Users may enter this journey at any point (e.g., direct product link, search) and are never blocked from progressing due to lack of an account.

## Guest User Flow
Guests can browse, search, filter, use the wishlist (session-based), add to cart, and complete checkout without creating an account. After a successful order, guests are prompted — non-intrusively — to create an account to save their order history, wishlist, and details for future visits. Declining the prompt has no negative impact on the completed order.

## Search Flow
User opens search → full-screen overlay appears with recent/trending searches → user types → live suggestions appear (products/categories) → user selects a suggestion or submits query → results displayed in browse/collection view. If no matches, user is shown an empty state with suggested categories or collections to explore instead.

## Browse & Collection Flow
User enters a collection via navigation, homepage feature, or search → applies filters/sort as desired → browses product grid → selects a product to view details. Filter/sort state persists as the user navigates back from a product page to the same collection.

## Product Detail Flow
User lands on product page (via grid, search, or direct link) → views imagery and details → selects variant (size/color, if applicable) → adds to cart or wishlist → may continue browsing via related/complete-the-look suggestions, or proceed directly to cart/checkout.

## Wishlist Flow
Guest adds items to wishlist → stored for the current session. If the guest logs in or creates an account, the session wishlist is automatically saved and synced to their account. If a logged-in user adds items, they are saved permanently and accessible from the account dashboard on any future visit.

## Cart Flow
User adds item(s) to cart from product page or product card → cart drawer opens, showing current contents → user may update quantities, remove items, continue shopping (close drawer), or proceed to checkout. Cart persists across the session regardless of login state; upon login, guest cart merges with any existing saved cart.

## Checkout Flow
User proceeds from cart → single-page checkout with shipping, payment, and order summary sections → guests may check out directly or log in if desired → user completes required fields with inline validation → submits order → redirected to order confirmation. If the user was prompted to log in mid-flow, they return to checkout exactly where they left off after authentication.

## Authentication Flow
User initiates login/signup (via header, checkout prompt, wishlist prompt, or post-order prompt) → completes login or signup form → upon success, user is returned to the exact page or action that triggered authentication (e.g., checkout, product page, wishlist, cart) — never redirected to an unrelated page such as the homepage by default.

## Account Flow
Logged-in user accesses Account Dashboard from header/navigation → dashboard presents: Order History, Wishlist, Account Details, and Saved Addresses/Payment Methods as distinct, organized sections → user can view past orders, manage wishlist items, update personal details, or manage saved addresses/payment methods independently within the dashboard.

## Order Confirmation Flow
Upon successful checkout, user lands on a confirmation page showing: order summary and email confirmation notice. If the user was a guest, a non-intrusive account creation prompt is shown, allowing them to save this order to a new account. Curated product recommendations ("Complete the Look" / "You May Also Like") are displayed below the core confirmation content, keeping the primary confirmation experience clean and uncluttered.

## Error & Recovery Flow
- **Failed checkout submission:** User remains on checkout page; specific field/section errors are highlighted without losing entered data.
- **Search with no results:** User shown an empty state with alternative browsing suggestions.
- **Session/cart conflicts (e.g., item out of stock at checkout):** User is notified inline and guided to adjust their cart before proceeding.
- **Failed login/signup:** User remains on the auth step with clear inline error feedback and the option to retry or recover their password.
- **Broken/invalid product link:** User is redirected to a relevant fallback (e.g., collection page or homepage) with a clear message, avoiding dead ends.
