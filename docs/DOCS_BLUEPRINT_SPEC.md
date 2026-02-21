# Docs Blueprint Spezifikation (verbindlich)

Status: Aktiv  
Version: v1.0  
Geltungsbereich: Gesamtes Repository (`/workspace`)  
Zweck: Diese Spezifikation definiert die verbindliche Struktur, Aenderungslogik und Agent-Handling-Regeln fuer alle Dokumente im Repo.

---

## 1) Zielbild

Die Dokumentation dient als steuerndes System fuer Architektur-, Sicherheits- und Umsetzungsdisziplin.

Sie muss:

1. Entscheidungen nachvollziehbar machen
2. Umsetzungsregeln deterministisch vorgeben
3. Aenderungen revisionssicher dokumentieren
4. Agents zu konsistentem Verhalten zwingen

Dokumentation ist nicht "Begleittext", sondern ein Teil des operativen Systems.

---

## 2) Prioritaet und Normcharakter

Diese Spezifikation konkretisiert die bestehende Governance und darf ihr nicht widersprechen.

Normative Reihenfolge bei Konflikten:

1. `docs/architecture/MASTER_GOVERNANCE.md`
2. `AGENTS.md`
3. `.cursorrules`
4. `docs/SYSTEM_PROMPT.md`
5. `docs/WORKFLOW.md`
6. `docs/RULES.md`
7. Diese Datei (`docs/DOCS_BLUEPRINT_SPEC.md`)

Regelwoerter sind normativ zu lesen:

- MUSS / DARF NICHT = verpflichtend
- SOLL = starker Standardfall
- KANN = optional

---

## 3) Struktur-Spezifikation der Repo-Dokumentation

### 3.1 Dokumentations-Layer

| Layer | Zweck | Primäre Dateien |
|---|---|---|
| Governance | Leitplanken, Scope, Sicherheits- und Architekturregeln | `docs/architecture/MASTER_GOVERNANCE.md`, `AGENTS.md`, `.cursorrules` |
| Execution | Operative Ausfuehrungsvorgaben fuer Implementierung | `docs/SYSTEM_PROMPT.md`, `docs/WORKFLOW.md` |
| Architecture | Systembild und Zielarchitektur | `docs/ARCHITECTURE_SOURCE_OF_TRUTH.md` |
| Process Evidence | Nachvollziehbare Historie von Aenderungen | `docs/VORGAENGE_LOG.md` |
| Process Rules | Formale Dokumentationspflicht und Qualitaetskriterien | `docs/RULES.md` |
| Planning/Decision | Planungsartefakte und Architekturentscheidungen | `docs/planning/`, `docs/ADR/` |

### 3.2 Verzeichnisregeln

1. `docs/` ist der kanonische Ort fuer Systemdokumentation.
2. Root-Dokumente ausserhalb `docs/` sind nur erlaubt, wenn sie repositoryweit verpflichtend sind (z. B. `AGENTS.md`).
3. Neue Dokumenttypen MUESSEN einem bestehenden Layer zuordenbar sein.
4. Keine doppelten "Source of Truth"-Dateien fuer denselben Inhalt.

### 3.3 Namens- und Formatregeln

1. Kanonische Steuerdokumente SOLLEN stabile, sprechende Dateinamen tragen (z. B. `WORKFLOW.md`).
2. Planungsdokumente MUESSEN datumsbasiert benannt werden: `docs/planning/YYYY-MM-DD-topic.md`.
3. Logdateien mit Historiencharakter (insb. `VORGAENGE_LOG.md`) sind append-only.
4. Jede Datei MUSS klar einen Zweck und Geltungsbereich im Header erkennen lassen.

---

## 4) Logik-Spezifikation fuer Doku-Aenderungen

### 4.1 Trigger-zu-Doku-Mapping (verbindlich)

| Trigger | Pflicht-Update |
|---|---|
| Architektur-/Scope-Aenderung | Betroffene Governance-/Architekturdatei + `docs/VORGAENGE_LOG.md` |
| Workflow-/Prozess-Aenderung | `docs/WORKFLOW.md` oder betroffene Prozessdatei + Logeintrag |
| Sicherheits-/RBAC-/Audit-Aenderung | Relevante Steuerdokumente + Logeintrag |
| Nur redaktionelle Klarstellung | Betroffene Datei + Logeintrag mit Kennzeichnung "editorial" |
| Kein inhaltlicher Effekt | Begruendung im Commit/PR-Text, warum kein Doku-Update erforderlich war |

### 4.2 Pflichtfluss fuer jede inhaltliche Aenderung

1. **Impact bestimmen**: Welche Layer und Dateien sind betroffen?
2. **Kanonische Datei updaten**: Keine Parallelquelle erzeugen.
3. **Trace herstellen**: Eintrag in `docs/VORGAENGE_LOG.md`.
4. **Konsistenz pruefen**: Keine Widersprueche zu Governance-Dokumenten.
5. **Verifikation dokumentieren**: Kurztest/manuelle Pruefung angeben.

### 4.3 Done-Kriterium fuer Doku

Ein Doku-Change ist nur "done", wenn:

- betroffene kanonische Datei aktualisiert wurde,
- der Logeintrag vorhanden ist,
- Risiko und Rollback benannt sind,
- Verifikation dokumentiert ist.

---

## 5) Agent-Handling-Spezifikation

### 5.1 Pflicht-Lesereihenfolge vor nicht-trivialen Aenderungen

1. `AGENTS.md`
2. `.cursorrules`
3. `docs/architecture/MASTER_GOVERNANCE.md`
4. `docs/RULES.md`
5. `docs/WORKFLOW.md`
6. Betroffene Fachdokumente

Wenn Regeln kollidieren, gilt die Prioritaet aus Abschnitt 2.

### 5.2 Agent-Verhaltensregeln bei Doku-Arbeit

1. Agent MUSS zuerst vorhandene Doku durchsuchen, bevor neue Dateien angelegt werden.
2. Agent DARF bestehende Semantik nicht stillschweigend umdeuten.
3. Agent MUSS bei jeder inhaltlichen Aenderung einen append-only Logeintrag anhaengen.
4. Agent SOLL Spezifikationen so schreiben, dass sie pruefbar und nicht interpretationsoffen sind.
5. Agent DARF Scope nicht erweitern, wenn kein direkter Bezug zu OfferFlow v1 besteht.

### 5.3 Pflichtausgabe eines Agents pro Change

Jede abgeschlossene Aenderung MUSS enthalten:

- Change Summary
- Risk Assessment
- Rollback Strategy
- Tests/Verifikation

Diese vier Punkte sind Mindeststandard fuer technische und dokumentative Aenderungen.

### 5.4 Eskalationslogik

Ein Agent MUSS eskalieren (statt direkt umzusetzen), wenn:

1. eine Aenderung mehrere Governance-Dokumente widerspruechlich macht,
2. Scope ueber OfferFlow v1 hinaus erweitert wird,
3. Sicherheitsgarantien (JWT, Tenant-Isolation, Audit-Strict-Mode) abgeschwaecht wuerden.

---

## 6) Blueprint-Checkliste fuer neue/aktualisierte Docs

- [ ] Datei in den richtigen Layer einsortiert
- [ ] Zweck und Geltungsbereich explizit angegeben
- [ ] Keine widerspruechliche Duplikation zu bestehenden Quellen
- [ ] Terminologie konsistent zu `MASTER_GOVERNANCE.md`/`AGENTS.md`
- [ ] `docs/VORGAENGE_LOG.md` append-only erweitert
- [ ] Risiko, Rollback und Verifikation dokumentiert

---

## 7) Nicht-Ziele dieser Spezifikation

Diese Spezifikation definiert **nicht**:

1. neue Produktfeatures,
2. Laufzeitlogik der API,
3. UI-Interaktionen,
4. Ersatz fuer Security-/Domain-Regeln.

Sie definiert ausschliesslich das Dokumentations-Betriebssystem: Struktur, Logik, Agent-Handling.

---

Ende von `docs/DOCS_BLUEPRINT_SPEC.md`
