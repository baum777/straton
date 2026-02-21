import { z } from 'zod';

export const RoleSchema = z.enum([
  'owner',
  'admin',
  'operator',
  'reviewer',
  'viewer',
]);
export type Role = z.infer<typeof RoleSchema>;

