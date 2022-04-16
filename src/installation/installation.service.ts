import {
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Customer, Installation, Sensor } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateInstallationRequest } from './models/create-installation-request.model';

@Injectable({ scope: Scope.REQUEST })
export class InstallationService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllAsync(): Promise<Installation[]> {
    return await this.prismaService.installation.findMany();
  }

  async createAsync(request: CreateInstallationRequest): Promise<string> {
    const customer: Customer = await this.prismaService.customer.findUnique({
      where: { Id: request.customerId },
    });
    if (!customer) {
      throw new UnprocessableEntityException(
        'No exist client with id provided in the request.',
      );
    }

    const sensor: Sensor = await this.prismaService.sensor.findUnique({
      where: { Id: request.sensorId },
    });
    if (!sensor) {
      throw new UnprocessableEntityException(
        'No exist sensor with id provided in the request.',
      );
    }

    const alreadyExistsInstallation: boolean =
      (await this.prismaService.installation.count({
        where: {
          CustomerId: request.customerId,
          SensorId: request.sensorId,
          LocalType: request.localType,
        },
      })) > 0;
    if (alreadyExistsInstallation) {
      throw new UnprocessableEntityException(
        'An installation with this data already exists.',
      );
    }

    const installation: Installation =
      await this.prismaService.installation.create({
        data: {
          CustomerId: request.customerId,
          SensorId: request.sensorId,
          LocalType: request.localType,
          Remarks: request.remarks,
          Date: request.date,
        },
      });

    return installation.Id;
  }
}
