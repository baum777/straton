# STRATON – AGENTS.md

This file defines how AI agents (Cursor, Codex, GPT, or any autonomous coding assistant) must operate inside the STRATON repository.

It is not a suggestion.
It is a constraint layer.

---

# 1. CORE IDENTITY

STRATON is not a generic AI framework.
STRATON is a structured AI-assisted process system for agencies.

Primary Product (v1):
STRATON OfferFlow™

Mission:
Turn strategy into structured, reviewable execution.

Agents working in this repo must preserve this focus.

---

# 2. LONG-TERM VISION

STRATON evolves into:

* A deterministic AI-assisted process engine
* Human-in-the-loop by default
* Review-gated state transitions
* Audit-first architecture
* Tenant-isolated system
* Margin-impact-driven product

It is NOT intended to become:

* A playground for experimental agents
* A generic multi-agent orchestration platform
* A plugin marketplace
* A connector jungle
* A hype-driven automation tool

Every architectural decision must align with structured execution and reviewability.

---

# 3. OPERATING PRINCIPLES (NON-NEGOTIABLE)

1. Domain contract first.
2. No write without audit log.
3. No irreversible state change without review.
4. No identity from request body.
5. Tenant isolation is mandatory.
6. Deterministic transitions over magic automation.
7. Simplicity over extensibility (until validated by revenue).

If uncertain → choose the simpler path.

---

# 4. SCOPE CONTROL (v1 BOUNDARY)

Allowed in v1:

* Auth (JWT)
* Tenant RBAC
* OfferFlow wizard
* CommitToken review gate
* Append-only audit logging
* Offer export

Not allowed in v1:

* Generic skill systems
* Data connector frameworks
* Autonomous agents executing external actions
* Billing systems
* Multi-product expansion
* Performance dashboards

If a feature does not directly improve OfferFlow™, it must not be implemented.

---

# 5. ARCHITECTURAL GUARDRAILS

## 5.1 Domain Layer

* All entities defined in packages/domain via Zod
* DB schema must match domain exactly
* No enum drift
* No duplicated type definitions

Domain is the single source of truth.

---

## 5.2 Review & Commit Layer

* All critical transitions require ReviewRequest
* CommitToken must:

  * be hashed
  * have expiry
  * be single-use
  * validate payload hash

No bypass routes allowed.

---

## 5.3 Audit Layer

* All writes produce audit logs
* Audit logs are append-only
* If audit fails (strict mode) → state change fails

No silent mutations.

---

## 5.4 Security

* JWT required for all business endpoints
* Tenant derived from token only
* No userId accepted from body
* No cross-tenant queries
* No implicit privilege escalation

Security must not be optional.

---

# 6. IMPLEMENTATION DISCIPLINE

Before building UI:

1. Define domain schema (Zod)
2. Define SQL schema
3. Write migration
4. Implement API endpoints
5. Add tests
6. Only then build UI

Never reverse this order.

---

# 7. TEST REQUIREMENTS

The system is not complete without:

* Domain contract validation tests
* CommitToken replay protection tests
* Expiry tests
* RBAC enforcement tests
* Audit logging tests

Agents must not mark work as complete without tests passing.

---

# 8. CHANGE MANAGEMENT

All changes must include:

* Change summary
* Risk assessment
* Rollback plan
* Tests added/updated

No silent refactors.

---

# 9. REVENUE VALIDATION RULE

Architecture may only expand when:

* 3+ paying customers exist
* 10+ real OfferFlows processed
* Real margin impact validated

Until then:

Focus.
Structure.
Control.

---

# 10. STRATON PHILOSOPHY

STRATON is built on:

Structure before automation.
Control before autonomy.
Clarity before complexity.
Profit before hype.

Agents must protect these principles in every implementation.

---

End of AGENTS.md
