import { AppointmentStatusEnum } from '../../types/appointment/appointment';

export class AppointmentDto {
  id: string;

  business: string;

  date_and_time: string;

  tokenNumber: number;

  status: AppointmentStatusEnum;

  createdAt?: Date | string;

  createdById: string;

  updatedAt?: Date | string;

  updatedById: string;
}
