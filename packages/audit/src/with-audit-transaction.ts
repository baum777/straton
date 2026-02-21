import crypto from 'node:crypto';
import type { Pool, PoolClient } from 'pg';

export type RequestContext = {
  tenantId: string;
  userId: string;
};

export type AuditLogInput = {
  action: string;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
};

async function insertAuditLogEntry(
  tx: PoolClient,
  ctx: RequestContext,
  audit: AuditLogInput,
) {
  const id = crypto.randomUUID();
  const meta = audit.meta ?? {};

  await tx.query(
    `
      INSERT INTO audit_logs (
        id,
        tenant_id,
        actor_user_id,
        action,
        entity_type,
        entity_id,
        meta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [id, ctx.tenantId, ctx.userId, audit.action, audit.entityType, audit.entityId, meta],
  );
}

export async function withAuditTransaction<T>(
  pool: Pool,
  ctx: RequestContext,
  audit: AuditLogInput,
  work: (tx: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await insertAuditLogEntry(client, ctx, audit);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignore rollback errors; original error is more relevant
    }
    throw err;
  } finally {
    client.release();
  }
}

