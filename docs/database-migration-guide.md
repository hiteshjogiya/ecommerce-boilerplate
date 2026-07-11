# Database Migration Guide

## Create a migration

1. Add a new SQL migration file to `supabase/migrations/`.
2. Use incremental naming: `NNN_description.sql`.
3. Include safe forwards migration statements.

## Apply migrations

```bash
npm run db:migrate
```

## Seed catalog data

```bash
npm run seed
```

`npm run seed` uses `SUPABASE_DB_URL` (or `DATABASE_URL`) and executes `supabase/seed/001_seed_catalog.sql` via `psql`.

## Production migration checklist

- Validate SQL in staging first.
- Confirm RLS and indexes after migration.
- Back up production before applying schema changes.
