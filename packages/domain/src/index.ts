import { z } from 'zod';

// --- Common Types ---
export const UUID = z.string().uuid();
export const Timestamp = z.date();
export const ID = UUID;

// --- Enums ---
export const Role = z.enum(['owner', 'admin', 'operator', 'reviewer', 'viewer']);
export type Role = z.infer<typeof Role>;

export const ProjectStatus = z.enum(['draft', 'active', 'closed']);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const OfferStatus = z.enum(['draft', 'in_review', 'approved', 'sent', 'archived']);
export type OfferStatus = z.infer<typeof OfferStatus>;

export const ReviewRequestStatus = z.enum(['pending', 'approved', 'rejected', 'expired']);
export type ReviewRequestStatus = z.infer<typeof ReviewRequestStatus>;

// --- Entities ---

export const Tenant = z.object({
  id: ID,
  name: z.string().min(1),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Tenant = z.infer<typeof Tenant>;

export const User = z.object({
  id: ID,
  email: z.string().email(),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type User = z.infer<typeof User>;

export const Membership = z.object({
  id: ID,
  user_id: ID,
  tenant_id: ID,
  role: Role,
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Membership = z.infer<typeof Membership>;

export const Project = z.object({
  id: ID,
  tenant_id: ID,
  name: z.string().min(1),
  status: ProjectStatus,
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Project = z.infer<typeof Project>;

export const Intake = z.object({
  id: ID,
  tenant_id: ID,
  project_id: ID,
  // Add minimal fields for v1 scaffolding
  content: z.record(z.unknown()).optional(),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Intake = z.infer<typeof Intake>;

export const Scope = z.object({
  id: ID,
  tenant_id: ID,
  project_id: ID,
  // Add minimal fields for v1 scaffolding
  description: z.string().optional(),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Scope = z.infer<typeof Scope>;

export const Offer = z.object({
  id: ID,
  tenant_id: ID,
  project_id: ID,
  status: OfferStatus,
  version: z.number().int().min(1).default(1),
  // Add minimal fields for v1 scaffolding
  total_amount: z.number().min(0).optional(),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type Offer = z.infer<typeof Offer>;

export const ReviewRequest = z.object({
  id: ID,
  tenant_id: ID,
  resource_id: ID, // Generic link to Offer or other reviewable
  resource_type: z.enum(['offer']), // For now only offer
  status: ReviewRequestStatus,
  payload_hash: z.string(),
  commit_token_hash: z.string(),
  issued_at: Timestamp,
  expires_at: Timestamp,
  used_at: Timestamp.nullable().optional(),
  created_at: Timestamp,
  updated_at: Timestamp,
});
export type ReviewRequest = z.infer<typeof ReviewRequest>;

/** Input event for audit write (no id/created_at – DB assigns) */
export const AuditEventInput = z.object({
  tenant_id: ID,
  user_id: ID.nullable().optional(), // System actions might not have user
  action: z.string().min(1),
  entity_type: z.string().min(1),
  entity_id: ID.nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type AuditEventInput = z.infer<typeof AuditEventInput>;

/** Persisted audit log row (1:1 with audit_logs table) */
export const AuditLog = z.object({
  id: ID,
  tenant_id: ID,
  user_id: ID.nullable().optional(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: ID.nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: Timestamp,
});
export type AuditLog = z.infer<typeof AuditLog>;
