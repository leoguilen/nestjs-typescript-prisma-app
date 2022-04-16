import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { InstallationModule } from './installation/installation.module';

@Module({
  imports: [ConfigModule.forRoot({}), HealthModule, InstallationModule],
})
export class AppModule {}
