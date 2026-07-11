# Production Guide

## Pre-release checklist

- `npm run check` passes.
- `npm run test:e2e` passes.
- Environment variables are configured.
- Supabase RLS and storage policies are verified.

## Runtime targets

- Vercel (managed)
- Self-hosted Node.js
- Docker container deployments

## Security essentials

- Restrict service role key to server runtime.
- Validate origin and admin checks on privileged routes.
- Enforce HTTPS at edge/load balancer.

## Observability baseline

- Configure `LOG_LEVEL` by environment.
- Aggregate logs from server runtime.
- Add external uptime and error monitoring for production.
