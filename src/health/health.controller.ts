import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

@ApiTags('Health Check')
@ApiProduces('application/json')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @ApiOperation({ summary: 'Check application health.' })
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }
}
