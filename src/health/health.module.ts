import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from '../prisma/prisma.health';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, PrismaModule],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
