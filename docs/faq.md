# FAQ

## Why are there both feature and shared components?

Feature components keep domain logic isolated. Shared components improve reuse and consistency.

## Where should new API/business logic go?

Put business logic in `src/services/`. Keep `app/api/*` routes as transport layers.

## How do I add a new environment variable?

1. Add it to `.env.example`.
2. Document it in `docs/environment-variables.md`.
3. Update env parsing/validation (`src/lib/env.server.ts` and related checks).

## How do I run full validation before release?

Run `npm run check` and `npm run test:e2e`.
