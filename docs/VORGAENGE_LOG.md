
Datum: 2026-02-21
Autor/Agent: Cursor Composer
Vorgang: Build Run #1 (Domain + DB + Auth/RBAC)
Betroffene Dateien: packages/domain/*, db/*, apps/api/*, packages/policy/*
Risiko: Mittel (Initiale Architektur-Fundamente, Sicherheitskritische Komponenten).
Rollback: Revert changes, drop database schema.
Tests/Verifikation: Domain validation tests, API auth guard tests, RBAC role check tests.
---

Datum: 2026-02-21
Autor/Agent: Cursor Composer
Vorgang: Build Run #1.1 (JWT Hardening + Claim Validation)
Betroffene Dateien: packages/policy/*, apps/api/*, docs/planning/run-1.1-jwt-hardening.md
Risiko: Mittel (Sicherheitskritische JWT-Implementierung).
Rollback: Revert policy/auth changes, restore mock token.
Tests/Verifikation: E2E tests (8) – forged token, missing claim, expired, public routes.
---
