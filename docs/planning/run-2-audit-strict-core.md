# Build Run #2: Audit Strict Core [PRODUCTION]

## Status
**Completed** (2026-02-21).

## Objective
Implement the minimal audit subsystem required for STRATON v1: **No write without audit (Strict Mode)** — enforced via DB transactions.

## Scope (AUDIT ONLY)
- No OfferFlow business endpoints
- No ReviewGate/CommitToken
- No UI

## Hard Guardrails
- Audit logs are append-only (no update/delete paths)
- All state-changing operations log audit entry in the same DB transaction
- Strict Mode: if audit insert fails → business write fails (rollback)
- Identity and tenant from verified JWT RequestContext
- No Prisma, no scope expansion

## Implementation Summary

### packages/audit
- `AuditEvent` type (tenant_id, user_id, action, entity_type, entity_id, metadata)
- `AuditWriter` interface: `write(event, trx)`
- `PostgresAuditWriter` implementation
- `withAuditTransaction(ctx, fn)` helper: BEGIN → fn(trx) → audit write → COMMIT; ROLLBACK on any failure

### DB
- `audit_logs` table: entity_type, entity_id, metadata (aligned with domain)
- Indexes: tenant_id, (tenant_id, entity_type, created_at)
- Append-only trigger: blocks UPDATE/DELETE on audit_logs

### Tests
- Strict-mode rollback: audit insert failure → business write rolled back
- Append-only: no UPDATE/DELETE in audit package; DB trigger rejects UPDATE/DELETE

### 📋 Implementation Checklist
- [x] Domain Schema defined/updated (Zod): AuditEventInput, AuditLog
- [x] SQL migration created (1:1 with Zod): 0002_audit_log_contract.sql
- [x] JWT enforcement verified (unchanged)
- [x] Tenant isolation verified (unchanged)
- [x] RBAC rules validated (unchanged)
- [x] ReviewGate required? No (Run #2 scope)
- [x] CommitToken logic validated (unchanged)
- [x] Audit log hook implemented: withAuditTransaction
- [x] Tests added:
  - Strict-mode rollback (Jest + Testcontainers)
  - Append-only (package + DB trigger)

## Files Changed
- `packages/domain/src/index.ts` — AuditEventInput, AuditLog (entity_type, entity_id, metadata)
- `db/schema.sql` — audit_logs columns, indexes, trigger
- `db/migrations/0002_audit_log_contract.sql` — migration
- `packages/audit/` — new package (types, PostgresAuditWriter, withAuditTransaction)
- `apps/api/src/infra/db/database.module.ts` — Pool provider
- `apps/api/src/infra/audit/audit.module.ts` — PostgresAuditWriter provider
- `apps/api/src/infra/audit/audit.strict.spec.ts` — Jest tests
- `packages/audit/src/append-only.spec.ts` — Vitest append-only assertion

## How Strict Mode is Enforced
`withAuditTransaction` runs business logic and audit write in a single Postgres transaction. On any error (business or audit), the transaction is rolled back. No partial writes persist.

## Test Execution
- Default `npm run test` excludes audit strict tests (require Docker).
- Run `npm run test:audit-integration` to execute audit strict/append-only tests (requires Docker).

## Risks
- **Testcontainers:** Requires Docker. CI must have Docker available.
- **Migration 0002:** Assumes 0001 applied. Fresh installs use schema.sql directly.

## Rollback Plan
- Revert packages/audit, apps/api infra, db changes
- Drop migration 0002; restore audit_logs columns if needed
- Remove @straton/audit dependency from apps/api
