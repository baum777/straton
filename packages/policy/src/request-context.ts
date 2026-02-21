import type { Role } from '@straton/domain';

/** Request context derived from JWT — never from body/headers */
export interface RequestContext {
  userId: string;
  tenantId: string;
  role: Role;
}

/** JWT payload shape — must contain these claims */
export interface JwtPayload {
  sub: string;   // userId
  tenant_id: string;
  role: Role;
  iat?: number;
  exp?: number;
}

/** Validates payload has required claims; throws if invalid */
export function createRequestContextFromPayload(payload: unknown): RequestContext {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid JWT payload');
  }
  const p = payload as Record<string, unknown>;
  const sub = p.sub;
  const tenantId = p.tenant_id;
  const role = p.role;

  if (typeof sub !== 'string' || !sub) {
    throw new Error('JWT missing or invalid sub (userId)');
  }
  if (typeof tenantId !== 'string' || !tenantId) {
    throw new Error('JWT missing or invalid tenant_id');
  }
  const validRoles = ['owner', 'admin', 'operator', 'reviewer', 'viewer'] as const;
  if (typeof role !== 'string' || !validRoles.includes(role as (typeof validRoles)[number])) {
    throw new Error('JWT missing or invalid role');
  }

  return {
    userId: sub,
    tenantId,
    role: role as Role,
  };
}
