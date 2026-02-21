# straton
strategy in motion

## Environment Variables

| Variable     | Required | Description                                      |
|-------------|----------|--------------------------------------------------|
| `JWT_SECRET`| Yes      | Secret for JWT signing/verification (min 32 chars for HS256). Set via env; no default in production. |
| `PORT`      | No       | API server port (default: 3001).                 |

## Package Manager

This repository uses **npm** with `package-lock.json` for deterministic installs.
## Produktlogik (Kurzbeschreibung)

STRATON OfferFlow fuehrt Agenturen durch einen festen, reviewbaren Ablauf:

1. Projekt anlegen
2. Intake erfassen
3. Scope-Entwurf erstellen
4. Angebotsentwurf erstellen
5. Review anfordern
6. Review freigeben
7. Angebot committen (nur mit gueltigem, einmal nutzbarem CommitToken)
8. Angebot exportieren

Leitplanken in v1:
- Alle Business-Endpunkte sind JWT-geschuetzt.
- Tenant-Kontext wird nur aus dem Token abgeleitet.
- Jeder Write erzeugt einen append-only Audit-Log (strict mode: write fails bei audit-failure).
- Keine parallelen Produkt- oder Schreibpfade ausserhalb von OfferFlow.

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
