import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestContext as ReqCtx } from '@straton/policy';

export const RequestContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ReqCtx => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new Error('RequestContext used without JWT auth');
    }
    return user as ReqCtx;
  },
);
