import { registerEnumType } from '@nestjs/graphql';
import { EntityBaseSchema } from '../schemas/entityBase';

export enum AppointmentStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export declare class AppointmentSchema extends EntityBaseSchema {
  data_and_time: string;
  token_number: string;
  status: string;
  permissions: any;
  createdById: string;
  updatedById: string;
}

registerEnumType(AppointmentStatusEnum, { name: 'AppointmentStatusEnum' });
