import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PrismaHealthIndicator } from '../prisma/prisma.health';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';

@ApiTags('Health Check')
@ApiProduces('application/json')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'Check application health.' })
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => await this.prismaHealthIndicator.isHealthy('prisma'),
    ]);
  }
}
