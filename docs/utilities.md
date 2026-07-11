# Utilities

## Core utility modules

- `src/lib/logger.ts`: structured app logging abstraction.
- `src/lib/env.validation.ts`: startup environment checks.
- `src/lib/env.server.ts`: server environment parsing/status.
- `src/lib/security.ts`: trusted-origin and security helpers.
- `src/lib/input.ts`: input sanitation helpers.
- `src/lib/image.ts`: safe image rendering defaults.
- `lib/utils.ts`: shared UI class merging (`cn`).

## Guidance

- Reuse existing helpers before creating new utilities.
- Keep utility modules small and focused.
- Avoid feature-specific logic in global utility modules.
