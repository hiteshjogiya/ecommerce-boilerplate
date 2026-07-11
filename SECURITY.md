# Security Policy

## Supported Versions

- `1.x`: Supported

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Report privately with:

- Affected version/commit
- Reproduction steps
- Impact assessment
- Suggested remediation (if available)

Maintainers will acknowledge reports within 3 business days and provide status updates until resolution.

## Security Baseline in This Boilerplate

- Authentication and authorization checks in route handlers/services.
- `proxy.ts` route protection and access control gates.
- Input validation in schemas and service boundaries.
- Environment validation for production startup safety.
- Supabase RLS expected for data isolation in production.

## Production Recommendations

- Rotate credentials regularly.
- Limit service role key usage to server-only contexts.
- Enforce TLS and secure headers at the edge.
- Review RLS policies before launch.
- Monitor auth and admin endpoints.
