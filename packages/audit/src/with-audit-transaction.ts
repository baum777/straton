import type { Pool, PoolClient } from 'pg';
import type { AuditWriter, AuditEvent } from './types';

export interface WithAuditTransactionContext {
  pool: Pool;
  auditWriter: AuditWriter;
}

/**
 * Runs fn(trx) and writes the returned audit event within the same transaction.
 * Commits only if both succeed. Rolls back on any failure (strict mode).
 */
export async function withAuditTransaction<T>(
  ctx: WithAuditTransactionContext,
  fn: (trx: PoolClient) => Promise<{ result: T; auditEvent: AuditEvent }>,
): Promise<T> {
  const client = await ctx.pool.connect();
  try {
    await client.query('BEGIN');
    const { result, auditEvent } = await fn(client);
    await ctx.auditWriter.write(auditEvent, client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
