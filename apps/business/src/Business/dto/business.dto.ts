// import { Role } from '../../role/entities/role.entities';
import { BusinessStatusEnum } from '../../types/business/business';

export class BusinessDto {
  id: string;

  name: string;

  mobileNumber: string;

  otp: string;

  ownerName: string;

  username: string;

  password: string;

  business_type: string;

  address: string;

  workingTime: string;

  token_limit: number;

  // scopedRoles: Role[];
  scopedRoles: string;

  status: BusinessStatusEnum;

  refresh_token: string;

  roleId: string;

  expiredOtp: Date | string;

  createdAt?: Date | string;

  createdById: string;

  updatedAt?: Date | string;

  updatedById: string;
}
