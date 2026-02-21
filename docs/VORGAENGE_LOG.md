
Datum: 2026-02-21
Autor/Agent: Cursor Composer
Vorgang: Build Run #1 (Domain + DB + Auth/RBAC)
Betroffene Dateien: packages/domain/*, db/*, apps/api/*, packages/policy/*
Risiko: Mittel (Initiale Architektur-Fundamente, Sicherheitskritische Komponenten).
Rollback: Revert changes, drop database schema.
Tests/Verifikation: Domain validation tests, API auth guard tests, RBAC role check tests.
---

Datum: 2026-02-21
Autor/Agent: Cursor Composer (Alignment Run)
Vorgang: Alignment Run — Dokumentationsstruktur vereinheitlicht, fehlende Ordner-Scaffolds erstellt. ops/ entfernt; docs/ als kanonischer Ort für System-Docs. MASTER_GOVERNANCE und ARCHITECTURE_SOURCE_OF_TRUTH angepasst. Neue Scaffolds: db/, db/migrations/, db/schema.sql, docs/ADR/, docs/planning/, packages/{policy,review,audit,ai}, apps/web. README um Doc-Hierarchie ergänzt.
Betroffene Dateien: docs/architecture/MASTER_GOVERNANCE.md, docs/ARCHITECTURE_SOURCE_OF_TRUTH.md, README.md, docs/VORGAENGE_LOG.md, docs/ALIGNMENT_RUN_PLAN.md (neu), db/*, docs/ADR/, docs/planning/, packages/policy, packages/review, packages/audit, packages/ai, apps/web
Risiko: Niedrig (Struktur- und Dokuänderungen; keine Laufzeitlogik).
Rollback: Commit revertieren oder neue Dateien/Ordner entfernen.
Tests/Verifikation: rg "ops/" in .md → 0 Treffer; Ordnerstruktur verifiziert; npm ls prüft Workspaces.
---
