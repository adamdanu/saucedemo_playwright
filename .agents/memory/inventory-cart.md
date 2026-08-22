# Memory: Inventory, Cart & Checkout Quirks

## Products Page & Sorting
- 6 standard products listed on `inventory.html`.
- Sort dropdown options: `az` (A to Z), `za` (Z to A), `lohi` (Price low to high), `hilo` (Price high to low).

## Cart & Badges
- Cart badge locator: `[data-test="shopping-cart-badge"]` (only visible when cart count > 0).
- When cart is empty, badge element is removed from DOM (use `toBeHidden()` or count assertion).

## Checkout Flow
- Step One: `/checkout-step-one.html` (First Name, Last Name, Postal Code).
- Step Two: `/checkout-step-two.html` (Summary, subtotal, tax calculation).
- Complete: `/checkout-complete.html` (Heading: `"Thank you for your order!"`).
