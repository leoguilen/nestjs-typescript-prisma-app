import { InstallationLocalType } from '../enums/installation-local-type.enum';

export class CreateInstallationRequest {
  customerId: string;
  sensorId: string;
  localType: InstallationLocalType;
  remarks: string;
  date: Date;
}
