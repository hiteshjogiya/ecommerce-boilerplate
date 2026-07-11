# Troubleshooting

## Build fails with env errors

- Verify `.env.local` contains required keys.
- Confirm values are not empty strings.

## Images fail to render

- Check Next image `remotePatterns` and `qualities` config.
- Verify URLs are reachable and not returning 404.

## Admin API returns forbidden

- Confirm the logged-in user has `admin` role in `user_profiles`.

## Supabase relation errors

- Ensure all migrations were applied.
- Confirm column names match expected schema in services.

## Tests fail locally

- Run `npm install` after dependency updates.
- Delete `node_modules` and reinstall if mock/runtime mismatch persists.
