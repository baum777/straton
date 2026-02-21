import { describe, it, expect } from 'vitest';
import { JwtClaimsSchema } from './jwt-claims';

describe('JwtClaimsSchema', () => {
  it('should accept valid claims', () => {
    const result = JwtClaimsSchema.safeParse({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '660e8400-e29b-41d4-a716-446655440001',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing tenantId', () => {
    const result = JwtClaimsSchema.safeParse({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid role', () => {
    const result = JwtClaimsSchema.safeParse({
      sub: '550e8400-e29b-41d4-a716-446655440000',
      tenantId: '660e8400-e29b-41d4-a716-446655440001',
      role: 'superadmin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    expect(result.success).toBe(false);
  });
});
