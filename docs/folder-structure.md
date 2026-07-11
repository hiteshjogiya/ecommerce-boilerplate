# Folder Structure

## Top-level

- `app/`: Next.js App Router routes, metadata, API handlers.
- `features/`: Feature-first UI, hooks, and local schemas.
- `components/`: Shared UI and layout components.
- `src/services/`: Reusable service layer (business/data access).
- `src/lib/`: Shared utilities (seo, env, security, logger).
- `store/`: Client state stores.
- `supabase/`: SQL migrations and seed files.
- `tests/`: Unit, integration, and e2e tests.
- `docs/`: Architecture and operational documentation.

## Conventions

- Keep route composition in `app/`.
- Keep feature-specific logic in `features/<feature-name>/`.
- Keep cross-feature utilities in `src/lib/`.
- Keep data access and orchestration in `src/services/`.
