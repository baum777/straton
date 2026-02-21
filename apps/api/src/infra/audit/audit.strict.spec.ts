import { Pool, PoolClient } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  PostgresAuditWriter,
  withAuditTransaction,
  type AuditWriter,
  type AuditEvent,
} from '@straton/audit';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

const MIGRATIONS_DIR = join(__dirname, '..', '..', '..', '..', '..', 'db', 'migrations');

async function runMigrations(client: PoolClient): Promise<void> {
  const m1 = readFileSync(join(MIGRATIONS_DIR, '0001_initial.sql'), 'utf-8');
  const m2 = readFileSync(join(MIGRATIONS_DIR, '0002_audit_log_contract.sql'), 'utf-8');
  await client.query(m1);
  await client.query(m2);
}

describe('Audit Strict Mode', () => {
  let pool: Pool;
  let container: StartedPostgreSqlContainer;
  let dockerAvailable = false;

  beforeAll(async () => {
    try {
      container = await new PostgreSqlContainer('postgres:16-alpine').start();
      dockerAvailable = true;
    } catch (e) {
      if (String(e).includes('container runtime')) {
        console.warn('Docker not available – skipping audit integration tests. Run with Docker for full coverage.');
        return;
      }
      throw e;
    }
    if (!dockerAvailable) return;
    pool = new Pool({ connectionString: container.getConnectionUri() });
    const client = await pool.connect();
    try {
      await runMigrations(client);
      await client.query(
        `INSERT INTO tenants (id, name) VALUES ('660e8400-e29b-41d4-a716-446655440001', 'Test Tenant') ON CONFLICT (id) DO NOTHING`,
      );
      await client.query(
        `INSERT INTO users (id, email) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'audit-test@example.com') ON CONFLICT (email) DO NOTHING`,
      );
    } finally {
      client.release();
    }
  }, 120000);

  afterAll(async () => {
    await pool?.end();
  });

  it('should rollback business write when audit insert fails (strict mode)', async () => {
    if (!dockerAvailable) return;
    const auditWriter: AuditWriter = {
      async write() {
        throw new Error('Simulated audit insert failure');
      },
    };

    const tenantId = '660e8400-e29b-41d4-a716-446655440001';
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    await expect(
      withAuditTransaction(
        { pool, auditWriter },
        async (trx) => {
          await trx.query(
            `INSERT INTO projects (tenant_id, name) VALUES ($1, $2)`,
            [tenantId, 'Rollback Test Project'],
          );
          return {
            result: null,
            auditEvent: {
              tenant_id: tenantId,
              user_id: userId,
              action: 'project.create',
              entity_type: 'project',
              entity_id: null,
              metadata: {},
            } as AuditEvent,
          };
        },
      ),
    ).rejects.toThrow('Simulated audit insert failure');

    const check = await pool.query(
      `SELECT * FROM projects WHERE name = 'Rollback Test Project'`,
    );
    expect(check.rows).toHaveLength(0);
  });

  it('should commit when both business write and audit succeed', async () => {
    if (!dockerAvailable) return;
    const auditWriter = new PostgresAuditWriter();
    const tenantId = '660e8400-e29b-41d4-a716-446655440001';
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    const result = await withAuditTransaction(
      { pool, auditWriter },
      async (trx) => {
        const ins = await trx.query(
          `INSERT INTO projects (tenant_id, name) VALUES ($1, $2) RETURNING id`,
          [tenantId, 'Success Project'],
        );
        const projectId = ins.rows[0].id;
        return {
          result: projectId,
          auditEvent: {
            tenant_id: tenantId,
            user_id: userId,
            action: 'project.create',
            entity_type: 'project',
            entity_id: projectId,
            metadata: { name: 'Success Project' },
          } as AuditEvent,
        };
      },
    );

    const proj = await pool.query(`SELECT * FROM projects WHERE id = $1`, [result]);
    expect(proj.rows).toHaveLength(1);

    const audit = await pool.query(
      `SELECT * FROM audit_logs WHERE entity_type = 'project' AND entity_id = $1`,
      [result],
    );
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0].action).toBe('project.create');
  });

  it('should reject UPDATE on audit_logs (append-only trigger)', async () => {
    if (!dockerAvailable) return;
    const client = await pool.connect();
    try {
      const ins = await client.query(
        `INSERT INTO audit_logs (tenant_id, user_id, action, entity_type) 
         SELECT id, (SELECT id FROM users LIMIT 1), 'test', 'test' FROM tenants LIMIT 1 
         RETURNING id`,
      );
      const id = ins.rows[0]?.id;
      if (!id) throw new Error('No audit row to update');

      await expect(
        client.query(`UPDATE audit_logs SET action = 'modified' WHERE id = $1`, [id]),
      ).rejects.toThrow(/append-only|not allowed/i);
    } finally {
      client.release();
    }
  });

  it('should reject DELETE on audit_logs (append-only trigger)', async () => {
    if (!dockerAvailable) return;
    const client = await pool.connect();
    try {
      const ins = await client.query(
        `INSERT INTO audit_logs (tenant_id, user_id, action, entity_type) 
         SELECT id, (SELECT id FROM users LIMIT 1), 'delete_test', 'test' FROM tenants LIMIT 1 
         RETURNING id`,
      );
      const id = ins.rows[0]?.id;
      if (!id) throw new Error('No audit row to delete');

      await expect(
        client.query(`DELETE FROM audit_logs WHERE id = $1`, [id]),
      ).rejects.toThrow(/append-only|not allowed/i);
    } finally {
      client.release();
    }
  });
});
