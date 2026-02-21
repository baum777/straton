import { z } from 'zod';

/** RBAC roles per tenant */
export const RoleSchema = z.enum([
  'owner',
  'admin',
  'operator',
  'reviewer',
  'viewer',
]);
export type Role = z.infer<typeof RoleSchema>;

/** Project status */
export const ProjectStatusSchema = z.enum(['draft', 'active', 'closed']);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

/** Offer status */
export const OfferStatusSchema = z.enum([
  'draft',
  'in_review',
  'approved',
  'sent',
  'archived',
]);
export type OfferStatus = z.infer<typeof OfferStatusSchema>;

/** ReviewRequest status */
export const ReviewRequestStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'expired',
]);
export type ReviewRequestStatus = z.infer<typeof ReviewRequestStatusSchema>;
