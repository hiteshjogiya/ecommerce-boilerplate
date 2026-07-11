# Database and Supabase

## Core tables

- categories
- products
- cart_items
- wishlist_items
- orders
- order_items
- user_profiles
- reviews
- coupons
- coupon_usages
- stock_notifications

## Security model

- RLS policies applied in migrations.
- API write handlers perform origin checks.
- Admin operations enforce role verification.

## Migrations

- Baseline schema and phase migrations in `supabase/migrations/`.

## Seed

- Initial catalog seed in `supabase/seed/001_seed_catalog.sql`.
