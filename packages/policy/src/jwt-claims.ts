import { z } from 'zod';

/** Role enum - must match @straton/domain Role values exactly */
const JwtRole = z.enum(['owner', 'admin', 'operator', 'reviewer', 'viewer']);

/**
 * Strict JWT claims schema.
 * All claims are required. Deny by default if missing/invalid.
 */
export const JwtClaimsSchema = z.object({
  sub: z.string().uuid(),
  tenantId: z.string().uuid(),
  role: JwtRole,
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
});

export type JwtClaims = z.infer<typeof JwtClaimsSchema>;
