import { EntityBaseSchema } from '../../schema/entityBase';
import { registerEnumType } from '@nestjs/graphql';

export enum BusinessStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}
export declare class ScopedRole {
  roleId: string;
}
export declare class BusinesSchema extends EntityBaseSchema {
  name: string;
  mobileNumber: string;
  ownerName: string;
  username: string;
  password: string;
  business_type: string;
  workingTime: string;
  token_limit: string;
  otp?: number;
  status: BusinessStatusEnum;
  otpVerified: boolean;
  isOtpReSend?: boolean;
  isSuperAdmin?: boolean;
  success?: boolean;
  message: string;
  scopedRoles: string;
  permissions: any;
  createdById: string;
  updatedById: string;
}

registerEnumType(BusinessStatusEnum, { name: 'BusinessStatusEnum' });
