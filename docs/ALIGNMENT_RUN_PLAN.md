# STRATON — Composer Alignment Run Plan (v1)

**Date:** 2026-02-21  
**Purpose:** Internal consistency + production-ready v1 build start

---

## 1. Mismatch Report

| # | Inconsistency | Location | Detail |
|---|---------------|----------|--------|
| 1 | **ops/ vs docs/** | MASTER_GOVERNANCE.md L57–60 | Lists `ops/SYSTEM_PROMPT.md`, `ops/WORKFLOW.md`, `ops/AGENTS.md` — files live in `docs/` (SYSTEM_PROMPT, WORKFLOW) and root (AGENTS.md) |
| 2 | **ARCHITECTURE.md missing** | MASTER_GOVERNANCE, ARCHITECTURE_SOURCE_OF_TRUTH | Both reference `docs/ARCHITECTURE.md` — file does not exist; ARCHITECTURE_SOURCE_OF_TRUTH serves this role |
| 3 | **docs/planning/ missing** | MASTER_GOVERNANCE L97 | Required for planning files; folder does not exist |
| 4 | **docs/ADR/ missing** | MASTER_GOVERNANCE, ARCHITECTURE_SOURCE_OF_TRUTH | ADR folder referenced but does not exist |
| 5 | **db/ missing** | All architecture docs | db/, db/migrations/, schema.sql referenced but do not exist |
| 6 | **packages/ policy, review, audit, ai missing** | package.json, architecture docs | Root package.json build scripts reference these; only domain exists |
| 7 | **apps/web missing** | package.json, architecture docs | Build scripts reference apps/web; only apps/api exists |
| 8 | **scripts/ missing** | package.json | db:migrate, db:drift-check reference scripts/migrate.js, scripts/drift-check.js — do not exist |

---

## 2. Decision: Canonical Location for System Docs

**Chosen: `docs/` (keep current layout)**

- **docs/** already contains SYSTEM_PROMPT, WORKFLOW, RULES, ARCHITECTURE_SOURCE_OF_TRUTH, VORGAENGE_LOG; AGENTS.md correctly stays in root (tooling convention).
- **ops/** does not exist; creating it would duplicate structure and require moving files.
- **Single source:** All operational docs under `docs/`; MASTER_GOVERNANCE remains top directive in `docs/architecture/`.

---

## 3. Planned Changes (File Map)

| Action | Path | Purpose |
|--------|------|---------|
| EDIT | `docs/architecture/MASTER_GOVERNANCE.md` | Replace ops/ block with docs/ structure; fix doc paths |
| EDIT | `docs/ARCHITECTURE_SOURCE_OF_TRUTH.md` | Align docs/ structure; add planning/; remove non-existent ARCHITECTURE.md |
| CREATE | `db/.gitkeep` | Scaffold db/ |
| CREATE | `db/migrations/.gitkeep` | Scaffold migrations |
| CREATE | `db/schema.sql` | Placeholder (comment only) |
| CREATE | `docs/ADR/.gitkeep` | Scaffold ADR |
| CREATE | `docs/planning/.gitkeep` | Scaffold planning |
| CREATE | `packages/policy/package.json` | Minimal workspace member |
| CREATE | `packages/review/package.json` | Minimal workspace member |
| CREATE | `packages/audit/package.json` | Minimal workspace member |
| CREATE | `packages/ai/package.json` | Minimal workspace member |
| CREATE | `apps/web/package.json` | Minimal workspace member |
| EDIT | `README.md` | Add doc hierarchy section |
| EDIT | `docs/VORGAENGE_LOG.md` | Append alignment run entry |

---

## 4. Diff Plan (per file)

### MASTER_GOVERNANCE.md
- Remove `ops/` block (L57–60)
- Add `docs/` block listing: RULES.md, SYSTEM_PROMPT.md, WORKFLOW.md, ARCHITECTURE_SOURCE_OF_TRUTH.md, VORGAENGE_LOG.md, architecture/, ADR/, planning/
- Add note: AGENTS.md remains in repository root

### ARCHITECTURE_SOURCE_OF_TRUTH.md
- In REPOSITORY STRUCTURE: remove ARCHITECTURE.md (redundant)
- Add planning/ to docs/
- Ensure paths match actual files

### db/, db/migrations/, db/schema.sql
- Create folders with .gitkeep
- schema.sql: single-line comment placeholder

### docs/ADR/, docs/planning/
- Create with .gitkeep

### packages/policy, review, audit, ai
- Minimal package.json: name, version, type: module, private: true

### apps/web
- Minimal package.json for Next.js placeholder

### README.md
- Add "Documentation Hierarchy" section with doc tree

### VORGAENGE_LOG.md
- Append entry: Alignment run, affected files, risk, rollback, verification

---

## 5. Verification Plan

1. **Path check:** `rg "ops/"` returns no matches in .md files
2. **Reference check:** All doc cross-references resolve (docs/X, docs/architecture/X)
3. **Folder check:** `ls db db/migrations docs/ADR docs/planning packages/policy packages/review packages/audit packages/ai apps/web` — all exist
4. **Workspace check:** `npm ls` — all workspaces recognized
5. **Build check:** `npm run build:packages` — does not fail on missing packages (may fail on empty impl — acceptable for scaffold)

---

## 6. Next Run "Build Start Checklist"

1. **Domain:** Define full Zod schemas in `packages/domain` (Tenant, User, Membership, Project, Intake, Scope, Offer, ReviewRequest, AuditLog)
2. **DB:** Create `db/schema.sql` from domain; add initial migration in `db/migrations/`
3. **Auth:** Implement JWT auth in `packages/policy`; tenant-scoped token extraction
4. **RBAC:** Implement RBAC middleware (Owner, Admin, Operator, Reviewer, Viewer)
5. **Review:** Implement `packages/review` — CommitToken generator, hash, expiry, atomic used_at
6. **Audit:** Implement `packages/audit` — append-only logging, strict-mode hook
7. **API:** Wire NestJS API with auth, policy, review, audit; add `/health` (public)
8. **Tests:** Domain contract, RBAC, CommitToken replay/expiry, audit assertion, cross-tenant
9. **Scripts:** Implement `scripts/migrate.js`, `scripts/drift-check.js` or remove from package.json
10. **UI:** Build Next.js OfferFlow wizard (last phase)

---

*End of Alignment Run Plan*
