import { InstallationService } from './installation.service';
import { InstallationLocalType } from './enums/installation-local-type.enum';
import { PrismaService } from '../prisma.service';
import { Installation, Customer, Sensor, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CreateInstallationRequest } from './models/create-installation-request.model';
import { UnprocessableEntityException } from '@nestjs/common';

describe('InstallationService', () => {
  let prismaServiceMock: PrismaService;
  let spy: jest.Mock<any, any>;

  beforeEach(() => {
    prismaServiceMock = new PrismaService();
    spy = jest.fn();
  });

  afterEach(() => {
    spy.mockReset();
    spy.mockRestore();
  });

  describe('fetchAllAsync method', () => {
    it('should be returned empty array when not exists installations', async () => {
      // Arrange
      prismaServiceMock.installation.findMany = spy.mockReturnValueOnce([]);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const result = await sut.fetchAllAsync();

      // Assert
      expect(result).toEqual([]);
      expect(prismaServiceMock.installation.findMany).toBeCalled();
    });

    it('should be returned array of installations when exists installations', async () => {
      // Arrange
      const installationsFake: Installation[] = getInstallationsFake();
      prismaServiceMock.installation.findMany =
        spy.mockReturnValueOnce(installationsFake);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const result = await sut.fetchAllAsync();

      // Assert
      expect(result).toHaveLength(installationsFake.length);
      expect(result).toBe(installationsFake);
      expect(prismaServiceMock.installation.findMany).toBeCalled();
    });
  });

  describe('createAsync method', () => {
    it('should be throwed unprocessable entity error when cliente not exists', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      prismaServiceMock.customer.findUnique = spy.mockReturnValueOnce(null);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const act = async () => await sut.createAsync(request);

      // Assert
      expect(act()).rejects.toThrow(UnprocessableEntityException);
      expect(prismaServiceMock.customer.findUnique).toHaveBeenCalledWith({
        where: { Id: request.customerId },
      });
    });

    it('should be throwed unprocessable entity error when sensor not exists', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      const customer: Customer = getCustomerFake();
      prismaServiceMock.customer.findUnique = spy.mockReturnValueOnce(customer);
      prismaServiceMock.sensor.findUnique = spy.mockReturnValueOnce(null);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const act = async () => await sut.createAsync(request);

      // Assert
      expect(act()).rejects.toThrow(UnprocessableEntityException);
      expect(prismaServiceMock.sensor.findUnique).toHaveBeenCalled();
    });

    it('should be throwed unprocessable entity error when already exists installation with the customerId, sensorId and localType', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      const customer: Customer = getCustomerFake();
      const sensor: Sensor = getSensorFake();
      prismaServiceMock.customer.findUnique = spy.mockReturnValueOnce(customer);
      prismaServiceMock.sensor.findUnique = spy.mockReturnValueOnce(sensor);
      prismaServiceMock.installation.count = spy.mockReturnValueOnce(1);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const act = async () => await sut.createAsync(request);

      // Assert
      expect(act()).rejects.toThrow(UnprocessableEntityException);
      expect(prismaServiceMock.installation.count).toHaveBeenCalled();
    });

    it('should be created installation and returned id when request data is valid', async () => {
      // Arrange
      const request: CreateInstallationRequest =
        getCreateInstallationRequestFake();
      const customer: Customer = getCustomerFake();
      const sensor: Sensor = getSensorFake();
      const createdInstallation = getInstallationFakeFrom(request);
      prismaServiceMock.customer.findUnique = spy.mockReturnValueOnce(customer);
      prismaServiceMock.sensor.findUnique = spy.mockReturnValueOnce(sensor);
      prismaServiceMock.installation.count = spy.mockReturnValueOnce(0);
      prismaServiceMock.installation.create =
        spy.mockReturnValueOnce(createdInstallation);
      const sut: InstallationService = getServiceUnderTest();

      // Act
      const result = await sut.createAsync(request);

      // Assert
      expect(result).toBe(createdInstallation.Id);
      expect(prismaServiceMock.installation.create).toHaveBeenCalled();
    });
  });

  function getServiceUnderTest(): InstallationService {
    return new InstallationService(prismaServiceMock);
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

  function getCustomerFake(): Customer {
    return {
      Id: faker.datatype.uuid(),
      FirstName: faker.name.firstName(),
      LastName: faker.name.lastName(),
      Email: faker.internet.email(),
      CreatedAt: faker.date.recent(),
    };
  }

  function getSensorFake(): Sensor {
    return {
      Id: faker.datatype.uuid(),
      Name: faker.lorem.sentence(),
      SerialCode: faker.random.alphaNumeric(),
      CreatedAt: faker.date.recent(),
    };
  }

  function getInstallationFakeFrom(
    request: CreateInstallationRequest,
  ): Installation {
    return {
      Id: faker.datatype.uuid(),
      CustomerId: request.customerId,
      SensorId: request.sensorId,
      LocalType: request.localType,
      Date: request.date,
      Remarks: request.remarks,
      CreatedAt: faker.date.recent(),
    };
  }
});
