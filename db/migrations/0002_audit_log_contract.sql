-- Migration: Align audit_logs with domain contract (entity_type, entity_id, metadata)
-- Run after 0001_initial.sql

-- Rename columns (from 0001 schema)
ALTER TABLE audit_logs RENAME COLUMN resource TO entity_type;
ALTER TABLE audit_logs RENAME COLUMN resource_id TO entity_id;
ALTER TABLE audit_logs RENAME COLUMN diff TO metadata;

-- Ensure metadata has default for NOT NULL inserts
ALTER TABLE audit_logs ALTER COLUMN metadata SET DEFAULT '{}';

-- Drop old index, add new composite index
DROP INDEX IF EXISTS idx_audit_logs_resource_id;
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_entity_created ON audit_logs(tenant_id, entity_type, created_at);

-- Append-only guard: block UPDATE and DELETE
CREATE OR REPLACE FUNCTION audit_logs_append_only_block()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only: UPDATE and DELETE are not allowed';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_logs_append_only_trigger ON audit_logs;
CREATE TRIGGER audit_logs_append_only_trigger
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION audit_logs_append_only_block();
