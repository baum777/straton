-- STRATON OfferFlow™ v1 — DB Contract
-- NOTE: Domain entities defined in packages/domain (Zod) are source of truth.
-- This schema must remain aligned 1:1 with the Zod contracts.

BEGIN;

-- Append-only audit log (strict mode: writes must fail if audit insert fails).
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  actor_user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Enforce append-only audit log (no UPDATE/DELETE).
CREATE OR REPLACE FUNCTION audit_logs_immutable()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_no_update ON audit_logs;
CREATE TRIGGER audit_logs_no_update
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION audit_logs_immutable();

-- Review Core (ReviewRequest + CommitToken)
CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  status text NOT NULL,
  payload_hash text NOT NULL,
  commit_token_hash text NOT NULL,
  issued_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz NULL,
  CONSTRAINT review_requests_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  CONSTRAINT review_requests_payload_hash_sha256
    CHECK (length(payload_hash) = 64),
  CONSTRAINT review_requests_commit_token_hash_sha256
    CHECK (length(commit_token_hash) = 64)
);

CREATE INDEX IF NOT EXISTS review_requests_tenant_status_idx
  ON review_requests (tenant_id, status);

CREATE INDEX IF NOT EXISTS review_requests_tenant_token_hash_idx
  ON review_requests (tenant_id, commit_token_hash);

COMMIT;

