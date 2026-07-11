# Customization Guide

## Branding

- Update theme tokens in global styles.
- Replace logo/assets in `public/`.
- Update metadata/site config in shared config utilities.

## Data model

- Add migration files in `supabase/migrations/`.
- Update service contracts and schema validation.
- Keep route handlers thin by delegating logic to services.

## Feature extensions

- Add new domains under `features/<domain>/`.
- Place reusable components in `components/`.
- Add tests in `tests/` for utilities/services/hooks.
