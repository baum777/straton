# Build Run #3: Review Core (ReviewRequest + CommitToken + Audit) [PRODUCTION]

## Status
**Completed** (2026-02-21).

## Objective
Implement the minimal **Review Core** required for STRATON v1:
- `ReviewRequest` model (domain + DB aligned 1:1)
- CommitToken lifecycle (generate, hashed storage, expiry, single-use)
- Atomic token usage (`used_at` update; replay impossible)
- Payload-hash validation
- Strict audit integration ("no write without audit")

## Scope (Allowed)
- `packages/review`
- `packages/audit`
- `packages/domain` (only contracts needed by Review Core)
- `db/schema.sql` + new migration in `db/migrations/`
- Integration tests using **Testcontainers Postgres** (no mocks)
- Documentation updates + `docs/VORGAENGE_LOG.md` entry

## Out of Scope (Forbidden)
- OfferFlow endpoints or business flows
- UI work
- Any "generic framework" abstractions

## Affected Domain Entities
- `ReviewRequest`
- `AuditLogEntry` (minimal, required for strict audit)

## Security / Governance Impact
- **High**: implements replay/expiry protection and strict audit rollback behavior.
- Tenant isolation enforced via `tenant_id` scoping in all Review queries.
- Identity/tenant derived only from provided `RequestContext` (caller must be JWT-verified upstream).

## Migration Impact
- Adds `review_requests` table.
- Adds `audit_log_entries` table (append-only; strict mode required by governance).

## Risks
- **Schema drift** between Zod and SQL. Mitigation: implement Zod first, then SQL 1:1, then tests that exercise the DB contract.
- **Token leakage** risk. Mitigation: never persist/log raw tokens; return raw token once only.
- **Incorrect atomicity** could allow replay. Mitigation: single-statement `UPDATE ... WHERE used_at IS NULL AND expires_at > now()` + tests.

## Rollback Plan
- Revert commits touching `packages/{domain,review,audit}`, `db/schema.sql`, and `db/migrations/*`.
- Drop new tables from DB if already migrated (or roll back via migration reversal if introduced later).

### 📋 Implementation Checklist
- [x] Domain Schema defined/updated (Zod)
- [x] SQL migration created (1:1 with Zod)
- [ ] JWT enforcement verified (N/A — no endpoints in this run)
- [x] Tenant isolation verified
- [ ] RBAC rules validated (N/A — no endpoints; service layer expects JWT-verified context)
- [ ] ReviewGate required? **Yes** — approval uses CommitToken and is irreversible
- [x] CommitToken logic validated (hash, expiry, single-use, atomic used_at, payload hash)
- [x] Audit log hook implemented (strict mode transaction)
- [ ] Tests added:
      - [x] Commit success
      - [x] Replay prevention
      - [x] Expiry enforcement
      - [x] Payload hash mismatch
      - [x] Atomicity (parallel use)
      - [x] Audit failure rollback

