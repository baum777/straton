# 🧱 STRATON – Architecture Source of Truth (v1)

---

## ROLE

You are the Lead Architect of STRATON.

You are operating inside a completely new, empty repository.

Your objective:

Build a production-grade, minimal, secure system for STRATON OfferFlow™.

Do not recreate legacy complexity.
Do not over-engineer.
Do not generalize beyond OfferFlow v1.

Every implementation must serve:

* Clarity
* Control
* Reviewability
* Profit-oriented workflows
* Tenant isolation
* Deterministic state transitions

---

# PRODUCT CONTEXT

## Brand

STRATON
Strategy in Motion.

## Target

D-A-CH agencies (10–50 employees)

## Core Product

STRATON OfferFlow™

From structured client input → a reviewable, low-risk, sendable offer.

---

# NON-GOALS (v1)

Do NOT implement:

* Generic agent runtimes
* Skill registries
* Connector frameworks
* Fleet dashboards
* Governance marketing layers
* Billing systems
* Enterprise SSO
* Plugin ecosystems

If it does not directly improve OfferFlow, it does not belong in v1.

---

# SYSTEM PRINCIPLES

1. Structure before automation
2. Human approval before irreversible action
3. No write without audit
4. No identity from request body
5. Domain contract before UI
6. One critical path only

---

# ARCHITECTURE OVERVIEW

## Stack

Web: Next.js (App Router)
API: NestJS
DB: PostgreSQL
Auth: JWT (tenant-scoped)
Validation: Zod (single source of truth)

---

# REPOSITORY STRUCTURE

```
straton/

apps/
  web/
  api/

packages/
  domain/      # Zod schemas + shared types
  policy/      # RBAC + tenant enforcement
  review/      # CommitToken + ReviewGate
  audit/       # Append-only logging
  ai/          # LLM adapter (draft only)

db/
  migrations/
  schema.sql

docs/
  ARCHITECTURE.md
  ADR/

ops/
  SYSTEM_PROMPT.md
  WORKFLOW.md
```

---

# DOMAIN MODEL (SOURCE OF TRUTH)

All entities defined first in Zod inside `packages/domain`.

## Core Entities

Tenant
User
Membership (role-based tenant access)
Project
Intake
Scope
Offer
ReviewRequest
AuditLog

Statuses must be explicit enums.

DB schema must match Zod exactly.

No drift allowed.

---

# SECURITY BASELINE

## Authentication

* JWT required on all business endpoints
* Tenant derived from token
* userId never accepted from body

## Authorization

Role-based per tenant:

* owner
* admin
* operator
* reviewer
* viewer

## CommitToken

* Issued on review request
* Expires
* Hash stored
* Single-use
* Payload tamper detection required

## Audit

All writes must create audit logs.
Failure behavior configurable (strict mode blocks write).

---

# CORE FLOW – OFFERFLOW™

1. Create Project
2. Capture Intake
3. Generate Scope Draft
4. Draft Offer
5. Request Review
6. Approve Review
7. Commit Offer
8. Export Offer

No parallel workflows in v1.

---

# API SURFACE (MINIMAL)

Auth
Projects
Intake
Scope
Offer Draft
Review Request
Review Approve
Offer Commit
Audit Read
Health

Nothing else.

---

# UI REQUIREMENTS

Single Wizard:

1. Project Setup
2. Intake
3. Scope
4. Offer Draft
5. Review Status
6. Final Export

Minimal Admin:

* Users
* Roles
* Audit Viewer

No dashboards.

---

# TEST REQUIREMENTS

Mandatory before completion:

* Domain contract test
* CommitToken replay test
* Expiry test
* RBAC enforcement test
* Audit log write test

System is incomplete without tests passing.

---

# DEFINITION OF DONE

* End-to-end OfferFlow works
* Review required before commit
* CommitToken cannot be reused
* Audit logs capture all state transitions
* JWT enforced everywhere
* Offer export works
* No schema drift
* No route duplication
* No hidden write paths

---

# 🔻 APPENDIX: NEXT STEPS EXECUTION PLAN

This appendix defines exact build order.

Follow strictly.

---

## PHASE 1 – FOUNDATION (Week 1)

1. Initialize repo structure.
2. Create `packages/domain` with full Zod schemas.
3. Generate matching SQL schema.
4. Create initial migrations.
5. Set up Postgres locally.
6. Implement JWT auth with tenant scoping.
7. Implement RBAC middleware.

Deliverable:
Authenticated API with tenant isolation.

---

## PHASE 2 – REVIEW + AUDIT CORE (Week 2)

1. Implement `packages/review`:

   * CommitToken generator
   * Hash comparison
   * Expiry logic
   * Atomic used_at update
2. Implement `packages/audit`:

   * Append-only logging
   * Middleware hook
3. Write replay + expiry tests.

Deliverable:
Secure review gate working in isolation.

---

## PHASE 3 – OFFERFLOW API (Week 3)

1. Implement Project endpoints.
2. Implement Intake storage.
3. Implement Scope draft endpoint.
4. Implement Offer draft endpoint.
5. Implement Review request endpoint.
6. Implement Offer commit endpoint.
7. Attach audit to all writes.

Deliverable:
OfferFlow works via API (no UI yet).

---

## PHASE 4 – UI WIZARD (Week 4)

1. Build Next.js wizard.
2. Connect API calls.
3. Display review status.
4. Add offer export.
5. Add audit viewer.

Deliverable:
Full E2E OfferFlow usable by test tenant.

---

## PHASE 5 – HARDENING

1. Run contract consistency tests.
2. Validate schema drift.
3. Add logging visibility.
4. Add token misuse detection logs.
5. Run manual security walkthrough.

Deliverable:
v1 production-ready OfferFlow.

---

# STRATEGIC NOTE

Architecture is frozen at OfferFlow v1.

Scaling, additional flows, automation layers, and extended AI logic come only after:

* 3+ paying customers
* 10+ real offers processed
* Real margin impact validated

Until then:

Focus.
Structure.
Control.

---
