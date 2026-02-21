# straton
strategy in motion

## Documentation Hierarchy

| Document | Role |
|----------|------|
| `docs/architecture/MASTER_GOVERNANCE.md` | Top directive; overrides ambiguity |
| `AGENTS.md` | Mandatory constraints for AI agents |
| `.cursorrules` | Cursor-specific rules + AI model roles |
| `docs/SYSTEM_PROMPT.md` | Lead Implementation Engineer context |
| `docs/WORKFLOW.md` | Mandatory implementation workflow |
| `docs/ARCHITECTURE_SOURCE_OF_TRUTH.md` | Architecture + build plan |
| `docs/DOCS_BLUEPRINT_SPEC.md` | Spec for docs structure, logic, and agent handling |
| `docs/RULES.md` | Documentation obligations |
| `docs/VORGAENGE_LOG.md` | Append-only change log |
| `docs/ALIGNMENT_RUN_PLAN.md` | Alignment run plan (reference) |

## Docs Blueprint (Spec)

The canonical specification for documentation behavior is:

- `docs/DOCS_BLUEPRINT_SPEC.md`

It defines:

1. Documentation structure (layers, ownership, naming)
2. Change logic (trigger-to-doc mapping, mandatory flow, done criteria)
3. Agent handling (read order, behavior rules, escalation logic)

When updating repository docs, use this sequence:

1. Update the affected canonical document
2. Verify consistency with governance documents
3. Add an append-only entry in `docs/VORGAENGE_LOG.md`
4. Include summary, risk, rollback, and verification notes
