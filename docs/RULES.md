# Dokumentationsregeln (verbindlich)

Diese Regeln gelten fuer alle Mitwirkenden (Menschen und Agents) im STRATON-Repository.

## 1) Geltungsbereich

Dokumentationspflicht gilt fuer alle Vorgaenge, insbesondere:

* Feature-Entwicklung
* Bugfixes
* Refactorings
* Schema-/Migrationsaenderungen
* API-Aenderungen
* Security-, RBAC- und Audit-relevante Anpassungen
* Teststrategie- und Testfall-Aenderungen
* Architektur- und Scope-Entscheidungen

## 2) Pflicht zur Aktualisierung (Do-not-skip)

Bei jeder inhaltlichen Aenderung MUESSEN die betroffenen Docs aktualisiert werden.

Minimal erforderlich:

1. Eintrag im `docs/VORGAENGE_LOG.md` (append-only).
2. Update in der fachlich betroffenen Dokumentation (z. B. `README.md`, Architektur- oder Workflow-Dokumente).
3. Wenn nichts zu aktualisieren scheint: explizit begruenden, warum kein Doku-Update notwendig ist.

Ohne Doku-Update gilt die Arbeit als unvollstaendig.

## 3) Mindestinhalt pro Dokumentationseintrag

Jeder Vorgangseintrag muss enthalten:

* Datum
* Autor/Agent
* Kurzbeschreibung der Aenderung
* Betroffene Dateien/Module
* Risikoauswirkung
* Rollback-Hinweis
* Test-/Verifikationsstatus

## 4) Qualitaetsanforderungen

* Klar, konkret und nachvollziehbar schreiben.
* Keine leeren Floskeln; nur tatsaechliche Aenderungen dokumentieren.
* Keine nachtraeglichen stillen Umschreibungen im Log (append-only).
* Entscheidungen mit Auswirkungen auf Scope/Sicherheit explizit markieren.

## 5) Review-Regel

Ein Change darf erst als "done" gelten, wenn:

* Code + Tests vorhanden sind (falls erforderlich),
* UND Dokumentation aktualisiert wurde,
* UND der Vorgang im Log erfasst ist.

Fehlt einer dieser Punkte, ist der Change nicht abschliessbar.
