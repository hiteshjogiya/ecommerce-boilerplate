# Contributing

## Development Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Create `.env.local` from `.env.example`.
4. Run `npm run dev`.

## Branch and PR Workflow

- Create focused branches for one concern at a time.
- Use clear commit messages.
- Link issues in pull requests when applicable.
- Keep pull requests small enough for quick review.

## Quality Requirements

Before opening a pull request, run:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

## Code Standards

- Prefer server components unless client interactivity is required.
- Keep business logic in `src/services/`.
- Keep shared cross-feature logic in `src/lib/`.
- Avoid `any`, dead code, and duplicate utilities.

## Documentation Requirements

- Update README/docs when setup, architecture, scripts, or behavior changes.
- Add migration notes for schema changes.

## Pull Request Checklist

- Include a concise summary.
- Include test evidence.
- Update docs when behavior or setup changes.
- Ensure CI passes.

## Community and Security

- Please follow `CODE_OF_CONDUCT.md`.
- For vulnerabilities, follow private reporting in `SECURITY.md`.
