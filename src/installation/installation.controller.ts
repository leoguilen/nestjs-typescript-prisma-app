import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';

@ApiTags('Installation')
@ApiProduces('application/json')
@Controller('api/installations')
export class InstallationController {
  @ApiOperation({ summary: 'test.' })
  @Get()
  async test(): Promise<any> {
    return {};
  }
}
