import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { InstallationModule } from './installation/installation.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    PrismaModule,
    HealthModule,
    InstallationModule,
  ],
})
export class AppModule {}
