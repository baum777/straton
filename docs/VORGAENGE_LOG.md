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
