import { ApiProperty } from '@nestjs/swagger';

export class CreateInstallationResponse {
  @ApiProperty({ example: '715e3276-4546-4f7e-8f59-b2308bd4c20b' })
  installationId: string;
}
