# Authentication Flow

## Sign up / Sign in

1. User submits auth form.
2. Form actions call feature auth actions.
3. Supabase auth session is created/updated.
4. `proxy.ts` handles protected-route access checks.

## Password reset

1. User requests reset email.
2. Application generates callback URL using `NEXT_PUBLIC_SITE_URL`.
3. Supabase sends reset link.
4. User completes reset on the reset route.

## Authorization

- Admin APIs enforce admin role checks through `src/services/admin-auth.service.ts`.
- Public and authenticated scopes are separated across service methods and route handlers.
