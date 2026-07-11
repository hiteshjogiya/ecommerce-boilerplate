# Hooks Documentation

## useAsyncAction

Path: `features/checkout/hooks/use-async-action.ts`

Purpose:

- Wrap async actions with loading and error state.

Contract:

- Input: async action function.
- Output: `{ execute, isLoading, error }`.

## useReviews / useStockNotification / wishlist hooks

Purpose:

- Encapsulate API interactions and UI state transitions for feature modules.

Guidelines:

- Keep side effects inside hooks.
- Keep API error messages normalized.
- Avoid business logic drift between hooks and services.
