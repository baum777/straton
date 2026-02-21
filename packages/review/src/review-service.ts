import crypto from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { withAuditTransaction, type RequestContext } from '@straton/audit';
import { ReviewRequestSchema, type ReviewRequest } from '@straton/domain';
import { generateCommitToken, hashPayload, sha256Hex } from './hash';
import { ReviewError } from './errors';

export type CreateReviewRequestInput = {
  entityType: string;
  entityId: string;
  payload: unknown;
  expiresAt: Date;
};

export type ReviewRequestPublic = Omit<ReviewRequest, 'commit_token_hash'>;

function mapReviewRow(row: Record<string, unknown>): ReviewRequest {
  const parsed = ReviewRequestSchema.safeParse(row);
  if (!parsed.success) {
    throw new Error(`Invalid ReviewRequest row: ${parsed.error.message}`);
  }
  return parsed.data;
}

async function fetchReviewRequestForTenant(
  tx: PoolClient,
  tenantId: string,
  id: string,
): Promise<ReviewRequest | null> {
  const res = await tx.query(
    `
      SELECT
        id,
        tenant_id,
        entity_type,
        entity_id,
        status,
        payload_hash,
        commit_token_hash,
        issued_at,
        expires_at,
        used_at
      FROM review_requests
      WHERE tenant_id = $1 AND id = $2
    `,
    [tenantId, id],
  );
  if (res.rowCount === 0) return null;
  return mapReviewRow(res.rows[0] as Record<string, unknown>);
}

export class ReviewService {
  constructor(private readonly pool: Pool) {}

  async createReviewRequest(
    ctx: RequestContext,
    input: CreateReviewRequestInput,
  ): Promise<{ reviewRequest: ReviewRequestPublic; commitToken: string }> {
    const issuedAt = new Date();
    const { token, tokenHash } = generateCommitToken();
    const payloadHash = hashPayload(input.payload);
    const id = crypto.randomUUID();

    const result = await withAuditTransaction(
      this.pool,
      ctx,
      {
        action: 'review_request.create',
        entityType: input.entityType,
        entityId: input.entityId,
        meta: { reviewRequestId: id },
      },
      async (tx) => {
        const res = await tx.query(
          `
            INSERT INTO review_requests (
              id,
              tenant_id,
              entity_type,
              entity_id,
              status,
              payload_hash,
              commit_token_hash,
              issued_at,
              expires_at,
              used_at
            )
            VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, NULL)
            RETURNING
              id,
              tenant_id,
              entity_type,
              entity_id,
              status,
              payload_hash,
              commit_token_hash,
              issued_at,
              expires_at,
              used_at
          `,
          [
            id,
            ctx.tenantId,
            input.entityType,
            input.entityId,
            payloadHash,
            tokenHash,
            issuedAt,
            input.expiresAt,
          ],
        );
        return mapReviewRow(res.rows[0] as Record<string, unknown>);
      },
    );

    const { commit_token_hash: _hidden, ...publicRow } = result;
    return { reviewRequest: publicRow, commitToken: token };
  }

  async approveReviewRequest(
    ctx: RequestContext,
    params: { reviewRequestId: string; commitToken: string; currentPayload: unknown },
  ): Promise<ReviewRequestPublic> {
    const tokenHash = sha256Hex(params.commitToken);
    const currentPayloadHash = hashPayload(params.currentPayload);

    const approved = await withAuditTransaction(
      this.pool,
      ctx,
      {
        action: 'review_request.approve',
        entityType: 'review_request',
        entityId: params.reviewRequestId,
      },
      async (tx) => {
        const existing = await fetchReviewRequestForTenant(
          tx,
          ctx.tenantId,
          params.reviewRequestId,
        );
        if (!existing) throw new ReviewError('REVIEW_REQUEST_NOT_FOUND');
        if (existing.used_at) throw new ReviewError('REVIEW_REQUEST_ALREADY_USED');
        if (existing.status !== 'pending')
          throw new ReviewError('REVIEW_REQUEST_INVALID_STATE');
        if (existing.expires_at.getTime() <= Date.now())
          throw new ReviewError('REVIEW_REQUEST_EXPIRED');
        if (existing.payload_hash !== currentPayloadHash)
          throw new ReviewError('REVIEW_REQUEST_PAYLOAD_HASH_MISMATCH');
        if (existing.commit_token_hash !== tokenHash)
          throw new ReviewError('REVIEW_REQUEST_INVALID_TOKEN');

        const res = await tx.query(
          `
            UPDATE review_requests
            SET used_at = now(), status = 'approved'
            WHERE
              id = $1
              AND tenant_id = $2
              AND commit_token_hash = $3
              AND payload_hash = $4
              AND used_at IS NULL
              AND status = 'pending'
              AND expires_at > now()
            RETURNING
              id,
              tenant_id,
              entity_type,
              entity_id,
              status,
              payload_hash,
              commit_token_hash,
              issued_at,
              expires_at,
              used_at
          `,
          [
            params.reviewRequestId,
            ctx.tenantId,
            tokenHash,
            currentPayloadHash,
          ],
        );

        if (res.rowCount === 0) {
          throw new ReviewError('REVIEW_REQUEST_CONCURRENT_MODIFICATION');
        }
        return mapReviewRow(res.rows[0] as Record<string, unknown>);
      },
    );

    const { commit_token_hash: _hidden, ...publicRow } = approved;
    return publicRow;
  }

  async rejectReviewRequest(
    ctx: RequestContext,
    params: { reviewRequestId: string },
  ): Promise<ReviewRequestPublic> {
    const rejected = await withAuditTransaction(
      this.pool,
      ctx,
      {
        action: 'review_request.reject',
        entityType: 'review_request',
        entityId: params.reviewRequestId,
      },
      async (tx) => {
        const existing = await fetchReviewRequestForTenant(
          tx,
          ctx.tenantId,
          params.reviewRequestId,
        );
        if (!existing) throw new ReviewError('REVIEW_REQUEST_NOT_FOUND');
        if (existing.used_at) throw new ReviewError('REVIEW_REQUEST_ALREADY_USED');
        if (existing.status !== 'pending')
          throw new ReviewError('REVIEW_REQUEST_INVALID_STATE');
        if (existing.expires_at.getTime() <= Date.now())
          throw new ReviewError('REVIEW_REQUEST_EXPIRED');

        const res = await tx.query(
          `
            UPDATE review_requests
            SET used_at = now(), status = 'rejected'
            WHERE
              id = $1
              AND tenant_id = $2
              AND used_at IS NULL
              AND status = 'pending'
              AND expires_at > now()
            RETURNING
              id,
              tenant_id,
              entity_type,
              entity_id,
              status,
              payload_hash,
              commit_token_hash,
              issued_at,
              expires_at,
              used_at
          `,
          [params.reviewRequestId, ctx.tenantId],
        );

        if (res.rowCount === 0) {
          throw new ReviewError('REVIEW_REQUEST_CONCURRENT_MODIFICATION');
        }
        return mapReviewRow(res.rows[0] as Record<string, unknown>);
      },
    );

    const { commit_token_hash: _hidden, ...publicRow } = rejected;
    return publicRow;
  }
}

