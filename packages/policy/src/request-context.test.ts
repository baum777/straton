import { describe, it, expect } from 'vitest';
import { createRequestContextFromPayload } from './request-context.js';

describe('RequestContext', () => {
  it('extracts valid payload', () => {
    const ctx = createRequestContextFromPayload({
      sub: 'user-123',
      tenant_id: 'tenant-456',
      role: 'admin',
    });
    expect(ctx.userId).toBe('user-123');
    expect(ctx.tenantId).toBe('tenant-456');
    expect(ctx.role).toBe('admin');
  });

  it('rejects missing sub', () => {
    expect(() =>
      createRequestContextFromPayload({
        tenant_id: 't1',
        role: 'viewer',
      })
    ).toThrow('sub');
  });

  it('rejects missing tenant_id', () => {
    expect(() =>
      createRequestContextFromPayload({
        sub: 'u1',
        role: 'viewer',
      })
    ).toThrow('tenant_id');
  });

  it('rejects invalid role', () => {
    expect(() =>
      createRequestContextFromPayload({
        sub: 'u1',
        tenant_id: 't1',
        role: 'superadmin',
      })
    ).toThrow('role');
  });

  it('rejects null payload', () => {
    expect(() => createRequestContextFromPayload(null)).toThrow('Invalid');
  });
});
