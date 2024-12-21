import { registerEnumType } from '@nestjs/graphql';
import { EntityBaseSchema } from '../../schema/entityBase';

export enum UserStatusEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
}
export declare class ScopedRole {
  roleId: string;
}
export declare class UserSchema extends EntityBaseSchema {
  name: string;
  mobileNumber: string;
  otp?: string;
  status: string;
  otpVerified: boolean;
  isOtpReSend?: boolean;
  success?: boolean;
  reason: string;
  accessToken: string;
  refreshToken: string;
  permissions: any;
  createdById: string;
  updatedById: string;
}

registerEnumType(UserStatusEnum, { name: 'UserStatusEnum' });
