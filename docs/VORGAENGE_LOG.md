# Vorgaenge-Log (append-only)

Dieses Log dokumentiert alle relevanten Vorgaenge im Repository.
Neue Eintraege immer am Ende anfuegen, bestehende Eintraege nicht stillschweigend ueberschreiben.

## Eintragsformat

```
Datum: YYYY-MM-DD
Autor/Agent:
Vorgang:
Betroffene Dateien:
Risiko:
Rollback:
Tests/Verifikation:
---
```

## Eintraege

Datum: 2026-02-20
Autor/Agent: Cursor Cloud Agent
Vorgang: Initiale Einrichtung von /docs mit verbindlichen Dokumentationsregeln und Pflicht-Logbuch.
Betroffene Dateien: docs/RULES.md, docs/VORGAENGE_LOG.md, AGENTS.md
Risiko: Niedrig (Dokumentationsaenderungen ohne Laufzeitwirkung).
Rollback: Dateien rueckgaengig machen oder Commit revertieren.
Tests/Verifikation: Nicht anwendbar (nur Dokumentation).
---

Datum: 2026-02-20
Autor/Agent: Cursor Cloud Agent
Vorgang: Verschiebung von ARCHITECTURE_SOURCE_OF_TRUTH.md, SYSTEM_PROMPT.md und WORKFLOW.md nach /docs sowie Verweis-Update in AGENTS.md.
Betroffene Dateien: docs/ARCHITECTURE_SOURCE_OF_TRUTH.md, docs/SYSTEM_PROMPT.md, docs/WORKFLOW.md, AGENTS.md
Risiko: Niedrig (Dokumentationsstruktur geaendert; moegliche Pfadannahmen in externen Referenzen).
Rollback: Dateien zurueck ins Root verschieben bzw. Commit revertieren.
Tests/Verifikation: Dateipfade und Inhalte manuell geprueft, Root-Dateien entfernt.
---

Datum: 2026-02-20
Autor/Agent: Cursor Cloud Agent
Vorgang: Neues Master-Governance-Dokument unter docs/architecture erstellt und in AGENTS.md verlinkt.
Betroffene Dateien: docs/architecture/MASTER_GOVERNANCE.md, AGENTS.md, docs/VORGAENGE_LOG.md
Risiko: Niedrig (Dokumentationsaenderung; keine Laufzeitlogik betroffen).
Rollback: Commit revertieren oder Dateien gezielt rueckgaengig machen.
Tests/Verifikation: Inhalt, Pfad und AGENTS-Verweis manuell verifiziert.
---

Datum: 2026-02-21
Autor/Agent: Cursor Composer (Alignment Run)
Vorgang: Alignment Run — Dokumentationsstruktur vereinheitlicht, fehlende Ordner-Scaffolds erstellt. ops/ entfernt; docs/ als kanonischer Ort für System-Docs. MASTER_GOVERNANCE und ARCHITECTURE_SOURCE_OF_TRUTH angepasst. Neue Scaffolds: db/, db/migrations/, db/schema.sql, docs/ADR/, docs/planning/, packages/{policy,review,audit,ai}, apps/web. README um Doc-Hierarchie ergänzt.
Betroffene Dateien: docs/architecture/MASTER_GOVERNANCE.md, docs/ARCHITECTURE_SOURCE_OF_TRUTH.md, README.md, docs/VORGAENGE_LOG.md, docs/ALIGNMENT_RUN_PLAN.md (neu), db/*, docs/ADR/, docs/planning/, packages/policy, packages/review, packages/audit, packages/ai, apps/web
Risiko: Niedrig (Struktur- und Dokuänderungen; keine Laufzeitlogik).
Rollback: Commit revertieren oder neue Dateien/Ordner entfernen.
Tests/Verifikation: rg "ops/" in .md → 0 Treffer; Ordnerstruktur verifiziert; npm ls prüft Workspaces.
---

Datum: 2026-02-21
Autor/Agent: Cursor Cloud Agent
Vorgang: Neue Blueprint-Spezifikation fuer die Repo-Dokumentation erstellt; definiert verbindlich Struktur, Aenderungslogik und Agent-Handling. README-Dokuhierarchie um die neue Spezifikation erweitert.
Betroffene Dateien: docs/DOCS_BLUEPRINT_SPEC.md (neu), README.md, docs/VORGAENGE_LOG.md
Risiko: Niedrig (reine Dokumentationsaenderung ohne Laufzeiteffekt).
Rollback: Letzten Commit revertieren oder die neue Datei entfernen und README/Logeintrag rueckgaengig machen.
Tests/Verifikation: Inhalte gegen docs/RULES.md, AGENTS.md und MASTER_GOVERNANCE auf Konsistenz geprueft; Markdown-Struktur manuell verifiziert.
---
