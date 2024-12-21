import { UserStatusEnum } from '../../types/users/user';

export class UserDto {
  id: string;

  name: string;

  mobileNumber: string;

  address: string;

  otp: string;

  status: UserStatusEnum;

  expiredOtp: Date;

  isReferral: boolean;

  dob: string ;

  createdAt?: Date | string;

  createdById: string;

  updatedAt?: Date | string;

  updatedById: string;
}
