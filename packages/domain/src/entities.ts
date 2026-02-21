import { z } from 'zod';
import { UuidSchema } from './ids.js';
import {
  RoleSchema,
  ProjectStatusSchema,
  OfferStatusSchema,
  ReviewRequestStatusSchema,
} from './enums.js';

/** Tenant — top-level isolation boundary */
export const TenantSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Tenant = z.infer<typeof TenantSchema>;

/** User — global identity (no tenant_id in payload) */
export const UserSchema = z.object({
  id: UuidSchema,
  email: z.string().email(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

/** Membership — tenant-scoped role assignment */
export const MembershipSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  user_id: UuidSchema,
  role: RoleSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Membership = z.infer<typeof MembershipSchema>;

/** Project — tenant-scoped */
export const ProjectSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  name: z.string().min(1),
  status: ProjectStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

/** Intake — project-scoped input capture */
export const IntakeSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  project_id: UuidSchema,
  payload: z.record(z.unknown()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Intake = z.infer<typeof IntakeSchema>;

/** Scope — project-scoped scope definition */
export const ScopeSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  project_id: UuidSchema,
  payload: z.record(z.unknown()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Scope = z.infer<typeof ScopeSchema>;

/** Offer — project-scoped */
export const OfferSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  project_id: UuidSchema,
  status: OfferStatusSchema,
  payload: z.record(z.unknown()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Offer = z.infer<typeof OfferSchema>;

/** ReviewRequest — CommitToken + expiry */
export const ReviewRequestSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  offer_id: UuidSchema,
  status: ReviewRequestStatusSchema,
  issued_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  used_at: z.string().datetime().nullable(),
  payload_hash: z.string(),
  commit_token_hash: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;

/** AuditLog — append-only */
export const AuditLogSchema = z.object({
  id: UuidSchema,
  tenant_id: UuidSchema,
  user_id: UuidSchema,
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  payload: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;
