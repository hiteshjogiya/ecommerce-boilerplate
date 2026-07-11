# Northstar E-commerce Boilerplate

## Supabase Phase 2

### Environment variables

Create a `.env.local` file based on `.env.local.example` and provide:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Supabase setup

1. Create a new Supabase project.
2. Run the migration in `supabase/migrations/001_create_catalog_tables.sql`.
3. Run the seed script in `supabase/seed/001_seed_catalog.sql`.
4. Create a storage bucket named `product-images`.

### Running migrations

```bash
npx supabase db push
```

### Seeding the database

```bash
psql "$DATABASE_URL" -f supabase/seed/001_seed_catalog.sql
```
