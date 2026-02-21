import type { Role } from '@straton/domain';

/** Role hierarchy: higher index = more privilege */
const ROLE_ORDER: Role[] = ['viewer', 'reviewer', 'operator', 'admin', 'owner'];

/** Check if user role satisfies required role (at least as privileged) */
export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  const userIdx = ROLE_ORDER.indexOf(userRole);
  const requiredIdx = ROLE_ORDER.indexOf(requiredRole);
  if (userIdx < 0 || requiredIdx < 0) return false;
  return userIdx >= requiredIdx;
}

/** Check if user has one of the allowed roles */
export function hasOneOfRoles(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
