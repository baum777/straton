import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtVerify } from 'jose';
import { IS_PUBLIC_KEY } from './public.decorator';
import { RequestContext } from './context';
import { JwtClaimsSchema } from './jwt-claims';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT configuration error');
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        {
          algorithms: ['HS256'],
          clockTolerance: 0,
        },
      );

      const parseResult = JwtClaimsSchema.safeParse({
        sub: payload.sub,
        tenantId: payload.tenantId,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      });

      if (!parseResult.success) {
        throw new UnauthorizedException('Token missing or invalid claims');
      }

      const claims = parseResult.data;

      const requestContext: RequestContext = {
        userId: claims.sub,
        tenantId: claims.tenantId,
        role: claims.role,
      };

      request['user'] = requestContext;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: { headers?: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
