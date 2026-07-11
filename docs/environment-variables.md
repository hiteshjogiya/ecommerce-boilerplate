# Environment Variables

| Variable                               | Purpose                                              | Required                 | Default                                                |
| -------------------------------------- | ---------------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| `NODE_ENV`                             | Runtime mode and safety behavior                     | No                       | `development`                                          |
| `NEXT_PUBLIC_SITE_URL`                 | Absolute site URL for metadata/auth callbacks        | Yes (prod)               | `http://localhost:3000` (local fallback in some flows) |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL                                 | Yes                      | None                                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | Supabase public anon key                             | Yes (or publishable key) | None                                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Alternative public key name accepted by app          | Optional                 | None                                                   |
| `SUPABASE_SERVICE_ROLE_KEY`            | Server-only elevated access for protected operations | Yes (server/admin use)   | None                                                   |
| `LOG_LEVEL`                            | Logger verbosity (`debug`, `info`, `warn`, `error`)  | Optional                 | `debug` in dev, `info` in prod                         |
| `SUPABASE_DB_URL`                      | Connection string used by `npm run seed`             | Optional                 | None                                                   |
| `PLAYWRIGHT_BASE_URL`                  | Base URL for e2e tests                               | Optional                 | `http://127.0.0.1:3000`                                |

## Notes

- Keep service role key server-only; never expose it in client bundles.
- Production startup validates essential env vars.
- Use `.env.example` as the source of truth for onboarding.
