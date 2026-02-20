# 🏗 STRATON MASTER INSTRUCTION (v1.1 – Final)

This document is the supreme directive for all human and AI-driven interactions inside the STRATON repository.

It overrides ambiguity.
It prevents scope drift.
It protects long-term architectural integrity.

---

# 1. CORE IDENTITY

STRATON is a structured AI-assisted process system for agencies.

Primary Product (v1):
**STRATON OfferFlow™**

Mission:
Turn strategy into structured, reviewable execution.

STRATON is NOT:

* A generic agent framework
* A multi-agent orchestration lab
* A connector marketplace
* A no-code automation playground

If a feature does not directly strengthen OfferFlow™, it must not be implemented.

---

# 2. REPOSITORY STRUCTURE (Source-Aligned)

```
straton/

apps/
  web/      # Next.js UI (OfferFlow Wizard + minimal Admin)
  api/      # NestJS API (business logic only)

packages/
  domain/   # Zod schemas (single source of truth)
  policy/   # JWT auth + tenant RBAC
  review/   # CommitToken + ReviewGate
  audit/    # Append-only audit logging
  ai/       # LLM adapters (draft-only, no autonomous actions)

db/
  migrations/
  schema.sql

docs/
  ARCHITECTURE.md
  ADR/
  planning/

ops/
  SYSTEM_PROMPT.md
  WORKFLOW.md
  AGENTS.md
```

No additional product folders allowed in v1.

---

# 3. OFFERFLOW WORKFLOW (Mandatory Critical Path)

OfferFlow™ is the only production flow in v1.

Flow:

1. Create Project
2. Capture Intake
3. Draft Scope
4. Draft Offer
5. Request Review
6. Approve Review
7. Commit Offer
8. Export Offer

No parallel flows.
No alternative write paths.

---

# 4. IMPLEMENTATION DISCIPLINE

Every feature must follow:

PLAN → IMPLEMENT → TEST → REVIEW → LOG

## 4.1 Planning Phase (Required)

Create a planning file:

`docs/planning/YYYY-MM-DD-feature-name.md`

Must include:

* Description
* Affected domain entities
* Security impact
* Review requirement
* Migration impact
* Risk level

### Mandatory Section:

```
### 📋 Implementation Checklist
- [ ] Domain Schema defined/updated (Zod)
- [ ] SQL migration created (1:1 with Zod)
- [ ] JWT enforcement verified
- [ ] Tenant isolation verified
- [ ] RBAC rules validated
- [ ] ReviewGate required? (Yes/No + reason)
- [ ] CommitToken logic validated (if applicable)
- [ ] Audit log hook implemented
- [ ] Tests added:
      - Domain
      - RBAC
      - Commit replay
      - Expiry
      - Audit assertion
```

No coding before this exists.

---

# 5. ARCHITECTURAL GUARDRAILS (Non-Negotiable)

## 5.1 Identity

* All business endpoints require JWT.
* `userId` and `tenantId` must be derived from token.
* Never accept identity from request body.
* Health endpoint is the only exception.

Violation = Critical failure.

---

## 5.2 Domain Integrity

* Zod schemas in `packages/domain` are law.
* DB schema must match Zod exactly.
* Enum drift = failed task.
* No duplicate type definitions.

---

## 5.3 Review Gate

Review is required for irreversible transitions only.

Irreversible transitions include:

* Offer commit (draft → approved)
* Final status transitions

Draft creation does NOT require Review.

CommitToken rules:

* Stored hashed
* Single-use
* Has expiry timestamp
* Payload hash validation required
* Atomic `used_at` update

Replay must be impossible.

---

## 5.4 Audit Rule

"No write without audit."

* All state changes must produce audit log.
* Audit log must be append-only.
* Strict mode: if audit fails → write fails.
* Audit export must be available.

No silent mutation allowed.

---

## 5.5 Tenant Isolation

* Every query scoped by tenant.
* No cross-tenant joins.
* No global access paths.

Isolation must be test-covered.

---

# 6. SECURITY BASELINE

Mandatory before any UI work:

* JWT authentication implemented
* RBAC middleware operational
* Tenant context extraction enforced
* CommitToken expiry + replay protection tested

System is not valid without these.

---

# 7. TEST REQUIREMENTS

The system is incomplete without:

* Domain contract tests
* Migration alignment tests
* RBAC enforcement tests
* CommitToken replay tests
* CommitToken expiry tests
* Audit write assertion tests

Green tests are required before feature completion.

---

# 8. DEFINITION OF DONE (OfferFlow v1)

OfferFlow is considered complete only when:

* End-to-end flow works via API
* Review is mandatory before commit
* CommitToken cannot be reused
* CommitToken expires correctly
* Audit logs capture every state change
* JWT enforced globally
* Tenant isolation verified
* Offer export works
* No schema drift
* No hidden write paths

---

# 9. SCOPE CONTROL (Revenue Rule)

Architecture expansion is allowed only after:

* 3+ paying customers
* 10+ real OfferFlows processed
* Margin impact validated

Until then:

No new product lines.
No framework building.
No abstraction layers for hypothetical scale.

Focus. Structure. Control.

---

# 10. STRATON PRINCIPLES

Structure before automation.
Control before autonomy.
Clarity before complexity.
Profit before hype.

Every implementation must protect these principles.

---

# FINAL DIRECTIVE

Build STRATON as a controlled execution system.

Not as a framework.
Not as a playground.
Not as a vision engine.

OfferFlow first.
Revenue second.
Expansion later.

---
