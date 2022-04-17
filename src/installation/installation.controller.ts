import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InstallationResponse } from './models/installation-response.model';
import { InstallationService } from './installation.service';
import { CreateInstallationRequest } from './models/create-installation-request.model';
import { CreateInstallationResponse } from './models/create-installation-response.model';

@ApiTags('Installation')
@ApiProduces('application/json')
@Controller('api/installations')
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all saved installations.' })
  @ApiOkResponse({
    description: 'The installations has been successfully returned.',
    type: [InstallationResponse],
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable.' })
  async getInstallations(): Promise<InstallationResponse[]> {
    const installations = await this.installationService.fetchAllAsync();
    return !installations
      ? []
      : Array.from(installations, (installation) =>
          InstallationResponse.from(installation),
        );
  }

  @Post()
  @ApiOperation({ summary: 'Create new installation.' })
  @ApiCreatedResponse({
    description: 'The installation has been successfully created.',
    type: CreateInstallationResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred.',
  })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable.' })
  async createInstallation(
    @Body() request: CreateInstallationRequest,
  ): Promise<CreateInstallationResponse> {
    if (!request) {
      throw new BadRequestException('invalid request body.');
    }

    try {
      const installationId = await this.installationService.createAsync(
        request,
      );
      return { installationId };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
