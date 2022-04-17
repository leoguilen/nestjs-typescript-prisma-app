import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '@prisma/client';
import { InstallationLocalType } from '../enums/installation-local-type.enum';

export class InstallationResponse {
  @ApiProperty({ example: '715e3276-4546-4f7e-8f59-b2308bd4c20b' })
  id: string;

  @ApiProperty({ example: '0c6f6a3e-2cba-4605-b7fd-cd9d57523d6a' })
  customerId: string;

  @ApiProperty({ example: '8203e38a-ca4b-44e3-8d3d-215982f25c0a' })
  sensorId: string;

  @ApiProperty({
    example: InstallationLocalType.ELECTRONIC_DEVICE,
  })
  localType: string;

  @ApiProperty({ example: 'anything' })
  remarks: string | null;

  @ApiProperty()
  date: Date;

  static from(installation: Installation): InstallationResponse {
    return {
      id: installation.Id,
      customerId: installation.CustomerId,
      sensorId: installation.SensorId,
      localType: installation.LocalType,
      remarks: installation.Remarks,
      date: installation.Date,
    };
  }
}
