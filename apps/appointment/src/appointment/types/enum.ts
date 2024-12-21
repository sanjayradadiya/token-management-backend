import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

registerEnumType(AppointmentStatusEnum, { name: 'AppointmentStatusEnum' });
