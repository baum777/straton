import { describe, it, expect } from 'vitest';
import { hasMinimumRole, hasOneOfRoles } from './rbac.js';

describe('RBAC', () => {
  describe('hasMinimumRole', () => {
    it('owner satisfies all roles', () => {
      expect(hasMinimumRole('owner', 'viewer')).toBe(true);
      expect(hasMinimumRole('owner', 'owner')).toBe(true);
    });
    it('viewer does not satisfy admin', () => {
      expect(hasMinimumRole('viewer', 'admin')).toBe(false);
    });
    it('admin satisfies operator and below', () => {
      expect(hasMinimumRole('admin', 'operator')).toBe(true);
      expect(hasMinimumRole('admin', 'reviewer')).toBe(true);
    });
  });

  describe('hasOneOfRoles', () => {
    it('returns true when user has allowed role', () => {
      expect(hasOneOfRoles('admin', ['admin', 'owner'])).toBe(true);
    });
    it('returns false when user lacks allowed role', () => {
      expect(hasOneOfRoles('viewer', ['admin', 'owner'])).toBe(false);
    });
  });
});
