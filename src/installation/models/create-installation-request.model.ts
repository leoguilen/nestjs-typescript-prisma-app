import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { InstallationLocalType } from '../enums/installation-local-type.enum';

export class CreateInstallationRequest {
  @ApiProperty({ example: '0c6f6a3e-2cba-4605-b7fd-cd9d57523d6a' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '8203e38a-ca4b-44e3-8d3d-215982f25c0a' })
  @IsUUID()
  sensorId: string;

  @ApiProperty({
    example: InstallationLocalType.ELECTRONIC_DEVICE,
  })
  @IsEnum(InstallationLocalType)
  localType: InstallationLocalType;

  @ApiProperty({ example: 'anything' })
  @IsOptional()
  @IsNotEmpty()
  remarks?: string;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  date: string;
}
