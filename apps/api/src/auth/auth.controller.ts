import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { Public } from './public.decorator.js';
import { RequestContext } from './request-context.decorator.js';
import type { RequestContext as ReqCtx } from '@straton/policy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email?: string; password?: string }) {
    const email = (body?.email as string) ?? 'demo@straton.local';
    const password = (body?.password as string) ?? 'demo';
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('me')
  async me(@RequestContext() ctx: ReqCtx) {
    return {
      userId: ctx.userId,
      tenantId: ctx.tenantId,
      role: ctx.role,
    };
  }
}
