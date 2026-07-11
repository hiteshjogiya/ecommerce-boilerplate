# Business Flows

## Authentication flow

1. User submits credentials.
2. Auth action validates schema.
3. Supabase auth endpoint processes request.
4. Session-aware routes enforce access via proxy.

## Cart flow

1. User adds item from product/listing UI.
2. Cart store updates local state.
3. Guest cart persists in local storage.
4. Authenticated cart syncs to `cart_items`.

## Order flow

1. Checkout validates address and pricing.
2. Order service calls `place_order` RPC.
3. Order and line items are persisted.
4. User is redirected to success/account order page.

## Admin CRUD flow

1. Proxy enforces authenticated admin route access.
2. API handlers call `assertAdminRole`.
3. Service layer performs database operation.
4. UI refreshes list/details after mutation.
