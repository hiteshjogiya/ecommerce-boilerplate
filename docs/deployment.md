# Deployment Guide

## Vercel

1. Import repository.
2. Add required environment variables from `.env.example`.
3. Keep build command as `npm run build`.
4. Keep output as default Next.js runtime.
5. Run migration and seed workflows against production Supabase.
6. Set `NODE_ENV=production` and tune `LOG_LEVEL`.

## Self-hosted Node.js

1. Install Node.js 20+ and run `npm ci`.
2. Build with `npm run build`.
3. Start with `npm run start`.
4. Supply production env vars from `.env.example`.
5. Expose port 3000 through a reverse proxy.
6. Enable HTTPS, compression, and edge caching policies.

## Docker

1. Build image: `docker build -t northstar:1.0.0 .`.
2. Run container: `docker run --env-file .env -p 3000:3000 northstar:1.0.0`.
3. For compose-based setup: `docker compose up --build`.

## Supabase production

1. Apply migrations in order.
2. Validate RLS and role grants.
3. Provision storage buckets and policies.
4. Rotate keys and ensure service role key is server-only.
5. Monitor auth, API, and storage usage.

## Supabase production checklist

- RLS policies validated.
- Admin role assignment script documented.
- Storage buckets created with correct access policy.
- Backup and retention strategy enabled.
