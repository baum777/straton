# STRATON – WORKFLOW.md

This document defines the mandatory implementation workflow inside the STRATON repository.

It ensures architectural integrity, security discipline, and long-term scalability.

---

# 1. WORK CYCLE

Every feature follows this sequence:

PLAN → IMPLEMENT → TEST → REVIEW → LOG

Skipping steps is not allowed.

---

# 2. PLAN PHASE

Before coding:

* Identify affected domain entities
* Confirm Zod schema alignment
* Define API surface
* Identify RBAC implications
* Identify audit implications
* Identify review/commit implications

Output must include:

* Scope
* Risk level (Low / Medium / High)
* Migration impact

---

# 3. IMPLEMENT PHASE

Rules:

* Modify domain first if needed
* Update DB migration second
* Update API third
* Update policy layer if needed
* Attach audit logging
* Attach review gate if state transition is critical

No direct DB writes without service layer.

---

# 4. TEST PHASE

Minimum test coverage per feature:

* Domain validation test
* RBAC enforcement test
* CommitToken replay test (if applicable)
* Expiry test (if applicable)
* Audit log assertion

Feature is not considered complete without passing tests.

---

# 5. REVIEW PHASE

Self-review checklist:

* Does this expand scope beyond OfferFlow?
* Does this introduce silent state mutation?
* Does this break tenant isolation?
* Does this bypass review gate?
* Does this introduce schema drift?

If yes → refactor.

---

# 6. LOG PHASE

Each completed change must document:

* Summary of change
* Why it was necessary
* Risks introduced
* Rollback strategy
* Tests added

Maintain clear commit history.

---

# 7. ARCHITECTURAL ESCALATION RULE

If a requested feature:

* Expands beyond OfferFlow
* Requires cross-tenant logic
* Introduces new product line
* Adds automation without review

It must be escalated and not implemented immediately.

---

# 8. LONG-TERM DISCIPLINE

STRATON evolves only after:

* 3+ paying customers
* 10+ real OfferFlows processed
* Validated margin impact

Until then:

No feature expansion.
No abstraction layers.
No framework building.

---

End of WORKFLOW.md
