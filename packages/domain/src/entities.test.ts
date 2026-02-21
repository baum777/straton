import { describe, it, expect } from 'vitest';
import {
  TenantSchema,
  MembershipSchema,
  ProjectSchema,
} from './entities.js';
import { UuidSchema } from './ids.js';
import { RoleSchema } from './enums.js';
import type { Role } from './enums.js';

describe('Domain Schemas', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';
  const validIso = '2026-02-21T12:00:00.000Z';

  describe('UuidSchema', () => {
    it('accepts valid UUID', () => {
      expect(UuidSchema.parse(validUuid)).toBe(validUuid);
    });
    it('rejects invalid UUID', () => {
      expect(() => UuidSchema.parse('not-a-uuid')).toThrow();
    });
  });

  describe('RoleSchema', () => {
    it('accepts valid roles', () => {
      const roles: Role[] = ['owner', 'admin', 'operator', 'reviewer', 'viewer'];
      for (const r of roles) {
        expect(RoleSchema.parse(r)).toBe(r);
      }
    });
    it('rejects invalid role', () => {
      expect(() => RoleSchema.parse('superadmin')).toThrow();
    });
  });

  describe('TenantSchema', () => {
    it('parses valid tenant', () => {
      const t = TenantSchema.parse({
        id: validUuid,
        name: 'Acme Corp',
        created_at: validIso,
        updated_at: validIso,
      });
      expect(t.name).toBe('Acme Corp');
    });
    it('rejects empty name', () => {
      expect(() =>
        TenantSchema.parse({
          id: validUuid,
          name: '',
          created_at: validIso,
          updated_at: validIso,
        })
      ).toThrow();
    });
  });

  describe('MembershipSchema', () => {
    it('parses valid membership', () => {
      const m = MembershipSchema.parse({
        id: validUuid,
        tenant_id: validUuid,
        user_id: validUuid,
        role: 'admin',
        created_at: validIso,
        updated_at: validIso,
      });
      expect(m.role).toBe('admin');
    });
    it('rejects invalid role', () => {
      expect(() =>
        MembershipSchema.parse({
          id: validUuid,
          tenant_id: validUuid,
          user_id: validUuid,
          role: 'invalid',
          created_at: validIso,
          updated_at: validIso,
        })
      ).toThrow();
    });
  });

  describe('ProjectSchema', () => {
    it('parses valid project with all statuses', () => {
      for (const status of ['draft', 'active', 'closed'] as const) {
        const p = ProjectSchema.parse({
          id: validUuid,
          tenant_id: validUuid,
          name: 'Project X',
          status,
          created_at: validIso,
          updated_at: validIso,
        });
        expect(p.status).toBe(status);
      }
    });
    it('rejects invalid status', () => {
      expect(() =>
        ProjectSchema.parse({
          id: validUuid,
          tenant_id: validUuid,
          name: 'X',
          status: 'invalid',
          created_at: validIso,
          updated_at: validIso,
        })
      ).toThrow();
    });
  });
});
