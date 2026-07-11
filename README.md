# Northstar eCommerce Boilerplate v1.0.0

Reusable production-ready eCommerce starter built with Next.js App Router, Supabase, TypeScript strict mode, and feature-based architecture.

## Core Features

- Authentication (signup, login, reset password)
- Product and category browsing with search and filters
- Product details with reviews, recommendations, recently viewed/searched
- Cart, wishlist, compare, checkout, and orders
- Account management (profile, addresses, order history)
- Admin dashboard CRUD (products, categories, orders)
- SEO-ready metadata, sitemap, robots, JSON-LD
- Error boundaries, loading states, and offline fallback page

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Supabase (Auth, Postgres, Storage)
- Tailwind CSS
- Zustand
- Vitest + Testing Library + Playwright

## Project Structure

- `app/` route composition, API handlers, metadata, loading/error boundaries
- `features/` feature-first components, hooks, schemas
- `components/` reusable shared UI and layout blocks
- `src/services/` reusable business/data access layer
- `src/lib/` cross-cutting utilities (env, security, logger, seo)
- `store/` client state stores
- `supabase/` migrations and seed SQL
- `tests/` unit/integration/e2e coverage
- `docs/` architecture and operational guides

See also: `docs/folder-structure.md`

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- `psql` CLI (optional, for `npm run seed`)

### Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Database

```bash
npm run db:migrate
npm run seed
```

## Scripts

- `npm run dev` start development server
- `npm run build` create production build
- `npm run start` start production server
- `npm run lint` run ESLint
- `npm run typecheck` run TypeScript checks
- `npm run test` run Vitest suites
- `npm run test:watch` run Vitest in watch mode
- `npm run test:coverage` run coverage report
- `npm run test:e2e` run Playwright smoke tests
- `npm run format` format files with Prettier
- `npm run format:check` verify formatting
- `npm run db:migrate` apply Supabase migrations
- `npm run seed` execute catalog seed SQL
- `npm run clean` remove temporary build/test artifacts
- `npm run check` run lint + typecheck + unit tests + build

## Environment Variables

Use `.env.example` as source of truth.

Key variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOG_LEVEL`

Full reference: `docs/environment-variables.md`

## Documentation Map

- Architecture: `docs/architecture.md`
- Folder structure: `docs/folder-structure.md`
- Authentication flow: `docs/authentication-flow.md`
- Database schema: `docs/database.md`
- Service layer: `docs/services.md`
- Hooks: `docs/hooks.md`
- Utilities: `docs/utilities.md`
- State management: `docs/state-management.md`
- Business flows: `docs/flows.md`
- Migration guide: `docs/database-migration-guide.md`
- Development guide: `docs/development-guide.md`
- Production guide: `docs/production-guide.md`
- Deployment: `docs/deployment.md`
- Customization: `docs/customization-guide.md`
- FAQ: `docs/faq.md`
- Troubleshooting: `docs/troubleshooting.md`

## Deployment Targets

- Vercel
- Self-hosted Node.js
- Docker
- Supabase production

Use `docs/deployment.md` and `docs/production-guide.md` for full instructions.

## Quality and Release Gates

- Strict TypeScript enabled
- ESLint + Prettier configured
- Husky + lint-staged pre-commit checks
- CI pipeline in `.github/workflows/ci.yml`
- Release metadata: `CHANGELOG.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`

## Contributing

See `CONTRIBUTING.md`.

## License

MIT (see `LICENSE`).
