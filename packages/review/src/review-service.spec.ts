import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers';
import { Pool } from 'pg';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ReviewService } from './review-service';
import { ReviewError } from './errors';
import { sha256Hex } from './hash';

const schemaPath = path.resolve(process.cwd(), 'db', 'schema.sql');

describe('ReviewService (Review Core)', () => {
  let container: StartedTestContainer;
  let pool: Pool;
  let schemaSql: string;

  beforeAll(async () => {
    schemaSql = await readFile(schemaPath, 'utf-8');

    container = await new GenericContainer('postgres:16-alpine')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_DB: 'straton_test',
        POSTGRES_USER: 'straton',
        POSTGRES_PASSWORD: 'straton',
      })
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .start();

    pool = new Pool({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: 'straton',
      password: 'straton',
      database: 'straton_test',
    });

    // Give Postgres a moment to accept TCP connections reliably.
    let lastErr: unknown;
    for (let i = 0; i < 40; i++) {
      try {
        await pool.query('SELECT 1');
        lastErr = undefined;
        break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 250));
      }
    }
    if (lastErr) throw lastErr;

    await pool.query(schemaSql);
  });

  afterAll(async () => {
    if (pool) await pool.end();
    if (container) await container.stop();
  });

  beforeEach(async () => {
    try {
      await pool.query('TRUNCATE review_requests, audit_logs');
    } catch {
      await pool.query(schemaSql);
      await pool.query('TRUNCATE review_requests, audit_logs');
    }
  });

  function ctx(tenantId = crypto.randomUUID()) {
    return { tenantId, userId: crypto.randomUUID() };
  }

  it('approves successfully with valid token (and writes audit)', async () => {
    const service = new ReviewService(pool);
    const c = ctx();

    const payload = { x: 1, nested: { a: true } };
    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const dbRow = await pool.query(
      'SELECT commit_token_hash FROM review_requests WHERE id = $1 AND tenant_id = $2',
      [reviewRequest.id, c.tenantId],
    );
    expect(dbRow.rowCount).toBe(1);
    expect(dbRow.rows[0].commit_token_hash).toBe(sha256Hex(commitToken));
    expect(dbRow.rows[0].commit_token_hash).not.toBe(commitToken);

    const approved = await service.approveReviewRequest(c, {
      reviewRequestId: reviewRequest.id,
      commitToken,
      currentPayload: payload,
    });

    expect(approved.status).toBe('approved');
    expect(approved.used_at).toBeInstanceOf(Date);

    const auditCount = await pool.query(
      "SELECT count(*)::int AS c FROM audit_logs WHERE tenant_id = $1 AND entity_id = $2",
      [c.tenantId, reviewRequest.id],
    );
    expect(auditCount.rows[0].c).toBe(2);
  });

  it('prevents replay: second use fails', async () => {
    const service = new ReviewService(pool);
    const c = ctx();
    const payload = { a: 1 };

    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await service.approveReviewRequest(c, {
      reviewRequestId: reviewRequest.id,
      commitToken,
      currentPayload: payload,
    });

    await expect(
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
    ).rejects.toMatchObject({ name: 'ReviewError', code: 'REVIEW_REQUEST_ALREADY_USED' });
  });

  it('rejects expired token', async () => {
    const service = new ReviewService(pool);
    const c = ctx();
    const payload = { a: 1 };

    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() - 1_000),
    });

    await expect(
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
    ).rejects.toMatchObject({ name: 'ReviewError', code: 'REVIEW_REQUEST_EXPIRED' });
  });

  it('rejects payload hash mismatch', async () => {
    const service = new ReviewService(pool);
    const c = ctx();

    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload: { a: 1 },
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: { a: 2 },
      }),
    ).rejects.toMatchObject({
      name: 'ReviewError',
      code: 'REVIEW_REQUEST_PAYLOAD_HASH_MISMATCH',
    });
  });

  it('enforces tenant isolation: cross-tenant access fails', async () => {
    const service = new ReviewService(pool);
    const c1 = ctx();
    const c2 = ctx();
    const payload = { a: 1 };

    const { reviewRequest, commitToken } = await service.createReviewRequest(c1, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.approveReviewRequest(c2, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
    ).rejects.toMatchObject({ name: 'ReviewError', code: 'REVIEW_REQUEST_NOT_FOUND' });
  });

  it('enforces used_at atomicity: two parallel approves -> only one succeeds', async () => {
    const service = new ReviewService(pool);
    const c = ctx();
    const payload = { a: 1 };

    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const results = await Promise.allSettled([
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
    ]);

    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    const err = (failures[0] as PromiseRejectedResult).reason as unknown;
    expect(err).toBeInstanceOf(ReviewError);
    expect((err as ReviewError).code).toMatch(
      /REVIEW_REQUEST_(ALREADY_USED|CONCURRENT_MODIFICATION)/,
    );
  });

  it('strict audit mode: audit failure rolls back review action', async () => {
    const service = new ReviewService(pool);
    const c = ctx();
    const payload = { a: 1 };

    const { reviewRequest, commitToken } = await service.createReviewRequest(c, {
      entityType: 'offer',
      entityId: crypto.randomUUID(),
      payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await pool.query('DROP TABLE audit_logs');

    await expect(
      service.approveReviewRequest(c, {
        reviewRequestId: reviewRequest.id,
        commitToken,
        currentPayload: payload,
      }),
    ).rejects.toBeTruthy();

    // Ensure approval was rolled back (still pending + unused).
    const row = await pool.query(
      'SELECT status, used_at FROM review_requests WHERE tenant_id = $1 AND id = $2',
      [c.tenantId, reviewRequest.id],
    );
    expect(row.rowCount).toBe(1);
    expect(row.rows[0].status).toBe('pending');
    expect(row.rows[0].used_at).toBeNull();

    // Restore schema for subsequent tests (order-independent).
    await pool.query(schemaSql);
  });
});

