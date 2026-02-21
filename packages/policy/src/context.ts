import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Role } from '@straton/domain';

export interface RequestContext {
  userId: string;
  tenantId: string;
  role: Role;
}

export const Context = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // We'll attach the context to request.user
  },
);
