import { describe, it, expect } from 'vitest';
import { User, Tenant, Membership, Role } from './index';

describe('Domain Entities', () => {
  it('should validate a valid user', () => {
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(() => User.parse(user)).not.toThrow();
  });

  it('should fail on invalid email', () => {
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'invalid-email',
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(() => User.parse(user)).toThrow();
  });

  it('should validate a valid tenant', () => {
    const tenant = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Acme Corp',
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(() => Tenant.parse(tenant)).not.toThrow();
  });

  it('should validate membership with correct role', () => {
    const membership = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      tenant_id: '123e4567-e89b-12d3-a456-426614174001',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(() => Membership.parse(membership)).not.toThrow();
  });

  it('should fail membership with invalid role', () => {
    const membership = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      tenant_id: '123e4567-e89b-12d3-a456-426614174001',
      role: 'super-admin', // Invalid
      created_at: new Date(),
      updated_at: new Date(),
    };
    expect(() => Membership.parse(membership)).toThrow();
  });
});
