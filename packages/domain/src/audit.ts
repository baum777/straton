import { z } from 'zod';
import { TimestampSchema, UuidSchema } from './primitives';

export const AuditLogEntrySchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  actor_user_id: UuidSchema,
  action: z.string().min(1),
  entity_type: z.string().min(1),
  entity_id: UuidSchema,
  created_at: TimestampSchema,
  meta: z.record(z.string(), z.unknown()),
});
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

