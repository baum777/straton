# Build Run #1: Domain + DB + Auth/RBAC (Production)

## Status
**Completed** (Pending test execution).

## Objective
Implement the minimal Domain Contract, DB Contract, and Auth/RBAC skeleton required to start OfferFlow safely.

## Scope
1.  **Domain Contract (`packages/domain`):**
    *   [x] Define Zod schemas for Tenant, User, Membership, Project, Intake, Scope, Offer, ReviewRequest, AuditLog.
    *   [x] Define Enums: Role, ProjectStatus, OfferStatus, ReviewRequestStatus.
    *   [x] Define common types (UUID, Timestamp).
2.  **DB Contract (`db/`):**
    *   [x] Create `db/schema.sql` matching Zod schemas 1:1.
    *   [x] Create first migration in `db/migrations/` to create tables and enums.
3.  **Auth/RBAC Skeleton (`apps/api`, `packages/policy`):**
    *   [x] Implement Global Auth Guard (JWT required).
    *   [x] Public `/health` endpoint.
    *   [x] Request Context extraction (User, Tenant, Role).
    *   [x] Minimal `/auth/login` and `/auth/me`.
4.  **Tests:**
    *   [x] Domain schema validation tests.
    *   [x] API auth guard tests.
    *   [x] RBAC role check tests.

## Risks
*   **Schema Drift:** Mismatch between Zod and SQL. Mitigation: Strict 1:1 mapping and manual verification.
*   **Security Gaps:** Missing tenant isolation. Mitigation: Mandatory `tenant_id` in all tables and JWT-based context extraction.

## Rollback Plan
*   Revert changes to `packages/domain`, `db/`, `apps/api`, `packages/policy`.
*   Delete migration files.
