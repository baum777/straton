-- Build Run #3: Review Core (ReviewRequest + CommitToken + Audit)
-- Keep aligned 1:1 with packages/domain contracts.

BEGIN;

CREATE TABLE IF NOT EXISTS audit_log_entries (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  actor_user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE OR REPLACE FUNCTION audit_log_entries_immutable()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log_entries is append-only';
END;
$$;

DROP TRIGGER IF EXISTS audit_log_entries_no_update ON audit_log_entries;
CREATE TRIGGER audit_log_entries_no_update
BEFORE UPDATE OR DELETE ON audit_log_entries
FOR EACH ROW
EXECUTE FUNCTION audit_log_entries_immutable();

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

