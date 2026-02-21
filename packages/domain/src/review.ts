import { z } from 'zod';
import { Sha256HexSchema, TimestampSchema, UuidSchema } from './primitives';

export const ReviewRequestStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'expired',
]);
export type ReviewRequestStatus = z.infer<typeof ReviewRequestStatusSchema>;

export const ReviewRequestSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  entity_type: z.string().min(1),
  entity_id: UuidSchema,
  status: ReviewRequestStatusSchema,
  payload_hash: Sha256HexSchema,
  commit_token_hash: Sha256HexSchema,
  issued_at: TimestampSchema,
  expires_at: TimestampSchema,
  used_at: TimestampSchema.nullable(),
});
export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;

