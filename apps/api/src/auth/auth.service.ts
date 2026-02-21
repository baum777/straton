import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Role } from '@straton/domain';

/** Minimal mock: returns JWT for demo user. Replace with real auth in production. */
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(_email: string, _password: string): Promise<{ access_token: string }> {
    // Mock: always return valid token for skeleton
    const payload = {
      sub: 'demo-user-id',
      tenant_id: 'demo-tenant-id',
      role: 'admin' as Role,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async validatePayload(payload: unknown) {
    return payload;
  }
}
