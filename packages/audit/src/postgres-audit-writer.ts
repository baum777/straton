import { AuditEventInput } from '@straton/domain';
import type { AuditWriter, TransactionClient } from './types';

const INSERT_SQL = `
  INSERT INTO audit_logs (tenant_id, user_id, action, entity_type, entity_id, metadata)
  VALUES ($1, $2, $3, $4, $5, $6)
`;

export class PostgresAuditWriter implements AuditWriter {
  async write(event: AuditEventInput, trx: TransactionClient): Promise<void> {
    const metadata = event.metadata ?? {};
    await trx.query(INSERT_SQL, [
      event.tenant_id,
      event.user_id ?? null,
      event.action,
      event.entity_type,
      event.entity_id ?? null,
      metadata,
    ]);
  }
}
