# Build Run #1.1: JWT Hardening + Claim Validation [PRODUCTION]

## Status
**Completed** (2026-02-21).

## Objective
Replace the mock "JWT-like base64 token" with a real JWT implementation and enforce strict claim validation.

## Non-negotiable Guardrails
- Every non-health endpoint requires VALID JWT authentication (signature verified).
- Derive userId/tenantId/role only from verified JWT.
- No guest access, no bypass.
- Deny by default if claims missing/invalid.

## Scope
1. **Real JWT Implementation:**
   - [x] Use `jose` library for signing + verifying.
   - [x] Require `JWT_SECRET` via env (documented in README).
2. **Strict JWT Claims:**
   - [x] `sub` (userId UUID)
   - [x] `tenantId` (UUID)
   - [x] `role` (Role enum)
   - [x] `iat`, `exp`
3. **AuthGuard:**
   - [x] Verify signature via jose
   - [x] Validate claim presence + type (Zod schema)
   - [x] Reject if invalid
4. **Tests:**
   - [x] Forged token rejection (E2E)
   - [x] Missing claim rejection (E2E)
   - [x] Expired token rejection (E2E)
   - [x] Public decorator only allows `/health` and `/auth/login` (E2E)

## Risks
* **Secret Management:** JWT_SECRET must be kept secure. Mitigation: Env-only, no defaults in production.

## Rollback Plan
* Revert `packages/policy`, `apps/api` auth-related changes.
* Restore mock token in AuthService if needed.
