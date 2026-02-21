import { Injectable } from '@nestjs/common';
import { SignJWT } from 'jose';
import { Role } from '@straton/domain';

@Injectable()
export class AuthService {
  async login(email: string): Promise<{ accessToken: string }> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Mock user lookup (will be replaced by real DB lookup later)
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email,
      tenantId: '660e8400-e29b-41d4-a716-446655440001',
      role: Role.Enum.admin,
    };

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;

    const accessToken = await new SignJWT({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .sign(new TextEncoder().encode(secret));

    return { accessToken };
  }
}
