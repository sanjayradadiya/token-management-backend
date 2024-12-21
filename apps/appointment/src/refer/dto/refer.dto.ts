import { ReferStatusEnum } from "../../types/refer/refer";

export class ReferDto {
  id: string;

  userId: string;

  refer_by_id: string;

  businessId: string;

  status: ReferStatusEnum;

  createdAt?: Date | string;

  createdById: string;

  updatedAt?: Date | string;

  updatedById: string;
}
