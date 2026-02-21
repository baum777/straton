import { z } from 'zod';
import { RoleSchema, UuidSchema } from '@straton/domain';

export const JwtClaimsSchema = z.object({
  sub: UuidSchema,
  tenantId: UuidSchema,
  role: RoleSchema,
  iat: z.number().int().nonnegative(),
  exp: z.number().int().nonnegative(),
});
export type JwtClaims = z.infer<typeof JwtClaimsSchema>;

