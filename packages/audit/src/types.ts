import type { AuditEventInput } from '@straton/domain';
import type { PoolClient } from 'pg';

/** Input for audit write – matches domain AuditEventInput */
export type AuditEvent = AuditEventInput;

/** Transaction client from pg Pool (PoolClient) */
export type TransactionClient = PoolClient;

/** AuditWriter writes audit events within a transaction. Append-only: no update/delete. */
export interface AuditWriter {
  write(event: AuditEvent, trx: TransactionClient): Promise<void>;
}
