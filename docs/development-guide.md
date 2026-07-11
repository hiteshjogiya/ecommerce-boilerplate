# Development Guide

## Setup

1. Install dependencies: `npm install`
2. Create local env file from `.env.example`
3. Start app: `npm run dev`

## Recommended workflow

- Implement changes in small slices.
- Keep business logic in services and reuse hooks/utilities.
- Run quality checks before commit.

## Local quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Formatting and commits

- Use `npm run format` for code style.
- Pre-commit hook runs lint-staged.
