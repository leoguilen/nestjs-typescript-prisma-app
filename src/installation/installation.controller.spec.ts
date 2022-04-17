import { Test, TestingModule } from '@nestjs/testing';
import { InstallationController } from './installation.controller';
import { InstallationService } from './installation.service';
import { Installation } from '@prisma/client';
import faker from '@faker-js/faker';
import { InstallationLocalType } from './enums/installation-local-type.enum';
import { InstallationResponse } from './models/installation-response.model';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInstallationRequest } from './models/create-installation-request.model';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { CreateInstallationResponse } from './models/create-installation-response.model';

describe('InstallationController', () => {
  let installationServiceMock: InstallationService;
  let spy: jest.Mock<any, any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstallationController],
      providers: [
        {
          provide: InstallationService,
          useFactory: () => mockDeep<InstallationService>(),
        },
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    installationServiceMock = await module.resolve(InstallationService);
    spy = jest.fn();
  });

  describe('getInstallations method', () => {
    it('should be returned empty array when service return null', async () => {
      // Arrange
      installationServiceMock.fetchAllAsync = spy.mockResolvedValue(null);
      const sut = getControllerUnderTest();

      // Act
      const result = await sut.getInstallations();

      // Assert
      expect(result).toEqual([]);
      expect(installationServiceMock.fetchAllAsync).toHaveBeenCalled();
    });

    it('should be returned empty array when service return empty array of installations', async () => {
      // Arrange
      installationServiceMock.fetchAllAsync = spy.mockResolvedValue([]);
      const sut = getControllerUnderTest();

      // Act
      const result = await sut.getInstallations();

      // Assert
      expect(result).toEqual([]);
      expect(installationServiceMock.fetchAllAsync).toHaveBeenCalled();
    });

    it('should be returned array of InstallationResponse when service return installations', async () => {
      // Arrange
      const installations = getInstallationsFake();
      installationServiceMock.fetchAllAsync =
        spy.mockResolvedValue(installations);
      const expectedResult: InstallationResponse[] = Array.from(
        installations,
        (installation) => InstallationResponse.from(installation),
      );
      const sut = getControllerUnderTest();

      // Act
      const result = await sut.getInstallations();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(installationServiceMock.fetchAllAsync).toHaveBeenCalled();
    });
  });

  describe('createInstallation method', () => {
    it('should be return BadRequest error when request is null.', async () => {
      // Arrange
      const request: CreateInstallationRequest = null;
      const sut = getControllerUnderTest();

      // Act
      const act = async () => await sut.createInstallation(request);

      // Assert
      expect(act()).rejects.toThrow(BadRequestException);
    });

    it('should be throwed InternalServerErrorException when call to service fail.', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      installationServiceMock.createAsync = spy.mockImplementation(() => {
        throw new Error();
      });
      const sut = getControllerUnderTest();

      // Act
      const act = async () => await sut.createInstallation(request);

      // Assert
      expect(act()).rejects.toThrow(InternalServerErrorException);
    });

    it('should be return installationId when request is valid and installation has been successfully created.', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      const createdInstallationId = faker.datatype.uuid();
      const expectedResult: CreateInstallationResponse = {
        installationId: createdInstallationId,
      };
      installationServiceMock.createAsync = spy.mockResolvedValue(
        createdInstallationId,
      );
      const sut = getControllerUnderTest();

      // Act
      const result = await sut.createInstallation(request);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(installationServiceMock.createAsync).toHaveBeenCalledWith(request);
    });
  });

  function getControllerUnderTest(): InstallationController {
    return new InstallationController(installationServiceMock);
  }

  function getInstallationsFake(): Installation[] {
    return [
      {
        Id: faker.datatype.uuid(),
        CustomerId: faker.datatype.uuid(),
        SensorId: faker.datatype.uuid(),
        LocalType: faker.random.arrayElement([
          InstallationLocalType.ELECTRONIC_DEVICE,
          InstallationLocalType.OUTLET,
          InstallationLocalType.SHOWER,
        ]),
        Remarks: faker.lorem.sentence(),
        Date: faker.date.recent(),
        CreatedAt: faker.date.recent(),
      },
      {
        Id: faker.datatype.uuid(),
        CustomerId: faker.datatype.uuid(),
        SensorId: faker.datatype.uuid(),
        LocalType: faker.random.arrayElement([
          InstallationLocalType.ELECTRONIC_DEVICE,
          InstallationLocalType.OUTLET,
          InstallationLocalType.SHOWER,
        ]),
        Remarks: faker.lorem.sentence(),
        Date: faker.date.recent(),
        CreatedAt: faker.date.recent(),
      },
    ];
  }

  function getCreateInstallationRequestFake(): CreateInstallationRequest {
    return {
      customerId: faker.datatype.uuid(),
      sensorId: faker.datatype.uuid(),
      localType: faker.random.arrayElement([
        InstallationLocalType.ELECTRONIC_DEVICE,
        InstallationLocalType.OUTLET,
        InstallationLocalType.SHOWER,
      ]),
      remarks: faker.lorem.sentence(),
      date: faker.date.recent(),
    };
  }
});
