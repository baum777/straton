import { Controller, Get } from '@nestjs/common';
import { Public } from '@straton/policy';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  getHealth(): string {
    return 'OK';
  }
}
