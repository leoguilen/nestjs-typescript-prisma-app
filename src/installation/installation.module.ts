import { Module } from '@nestjs/common';
import { InstallationController } from './installation.controller';
import { InstallationService } from './installation.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InstallationController],
  providers: [InstallationService, PrismaService],
})
export class InstallationModule {}
