import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@straton/policy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // This endpoint is public, so users can log in
  @Post('login')
  async login(@Body('email') email: string) {
    return this.authService.login(email);
  }

  // This one is protected by default global guard
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
