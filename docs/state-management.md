# State Management

## Approach

- Prefer server data fetching in App Router pages/components.
- Use local component state for isolated UI concerns.
- Use Zustand stores for cross-component client state (cart, compare, etc.).

## Stores

- `store/cart-store.ts`
- `store/compare-store.ts`

## Sync boundaries

- Feature hooks coordinate server/client sync where needed (cart/wishlist flows).
- Keep business rules in services; keep stores focused on client state.
