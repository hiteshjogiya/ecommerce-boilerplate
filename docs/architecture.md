# Architecture Overview

## Core stack

- Next.js App Router
- TypeScript strict mode
- Supabase (Auth + Postgres + Storage)
- Tailwind CSS + component primitives
- Zustand for client state synchronization

## Layering

- `app/`: route entry points, API handlers, metadata, route-level loading/error
- `features/`: domain-specific UI and hooks
- `src/services/`: business/data access layer
- `src/lib/`: shared framework helpers (seo, env, security, logger)
- `store/`: client state stores

## Principles

- Keep server-side concerns in services and route handlers.
- Keep client components focused on interactivity only.
- Avoid direct database access in UI components.
- Reuse utilities to keep consistent behavior.
