# Changelog

## [1.0.0] - 2026-07-12

### Added

- Phase 14 production release baseline.
- Phase 15 boilerplate hardening and repository readiness pass.
- Vitest + Testing Library + Playwright setup.
- Unit tests for auth schemas, cart, wishlist, orders, admin category service, hooks, utilities, and critical avatar component.
- GitHub CI workflow with lint, typecheck, test, build gates.
- GitHub issue templates and pull request template.
- Governance and security files: CODE_OF_CONDUCT and SECURITY policy.
- Dockerfile, docker-compose, and dockerignore.
- Docker development compose profile (`docker-compose.dev.yml`).
- Prettier, EditorConfig, Husky pre-commit, lint-staged workflow.
- Logger utility and startup environment validation utility.
- Release documentation expansion: architecture, folder structure, auth flow, utilities, state management, migration/development/production guides, customization, FAQ, environment variables.

### Changed

- Package version bumped to `1.0.0`.
- NPM scripts expanded for quality and DX lifecycle (`db:migrate`, `seed`, `clean`, `check`).
- Environment examples standardized with complete variable set.

### Fixed

- Category update schema mismatch fix (removed non-existent `updated_at`).
- Product detail scroll reset reliability.
- Image quality and avatar optimization edge cases.
