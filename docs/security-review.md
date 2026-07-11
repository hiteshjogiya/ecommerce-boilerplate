# Security Review

## Authentication and Authorization

- Supabase auth is used for user authentication.
- Protected route checks are enforced in `proxy.ts`.
- Admin-only APIs enforce role checks through admin auth service.

## Input Validation

- Schema validation is used at feature and service boundaries.
- Trusted-origin checks are applied on mutating API routes.

## Environment and Secrets

- Production environment validation is enabled at startup.
- Service role key is expected to be server-only.

## Supabase and RLS

- Migrations define schema and policy expectations.
- Production deployment requires explicit RLS verification.

## Recommended Follow-ups

- Add security scanning in CI.
- Add periodic review of admin endpoints and policy coverage.
- Implement key rotation and incident response runbook.
