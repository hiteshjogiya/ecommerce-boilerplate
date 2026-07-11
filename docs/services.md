# Services Documentation

## Categories and Products

- `src/services/category.service.ts`
- `src/services/product.service.ts`

Responsibilities:

- Catalog reads.
- Filtering, pagination, and sort behavior.
- Cached public query access.

## Cart and Wishlist

- `src/services/cart.service.ts`
- `src/services/wishlist.service.ts`

Responsibilities:

- Client-safe line item normalization.
- Guest persistence.
- Remote sync and wishlist transitions.

## Orders and Checkout

- `src/services/order.service.ts`
- `src/services/coupon.service.ts`

Responsibilities:

- Order placement orchestration and input normalization.
- Coupon validation and usage recording.

## Admin services

- `src/services/admin-*.service.ts`
- `src/services/admin-auth.service.ts`

Responsibilities:

- Admin role assertions.
- CRUD operations for products, categories, and orders.
