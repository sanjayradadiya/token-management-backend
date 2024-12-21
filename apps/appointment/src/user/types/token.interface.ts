import { ErrorCodeEnum } from '../../types/common';
import { UserSchema } from '../../types/users/user';

export enum TokenUsageEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
  VERIFY = 'verify',
  FORGOT_PASSWORD = 'forgotPassword',
  INVITE = 'invite',
  PARTNER_TENANT_INVITE = 'partnerTenantInvite',
  UPDATE_LEAVE_STATUS = 'updateLeaveStatus',
}

export interface AccessTokenPayload {
  tokenUse: TokenUsageEnum.ACCESS;
  userId: string;
  mobileNumber: string;
}

export interface RefreshTokenPayload {
  tokenUse: TokenUsageEnum.REFRESH;
  userId: string;
}

export interface UserVerificationTokenPayload {
  tokenUse: TokenUsageEnum.VERIFY;
  mobileNumber: string;
}

export interface UserInvitationTokenPayload {
  tokenUse: TokenUsageEnum.INVITE;
  userId: string;
}

export interface ForgotPasswordTokenPayload {
  tokenUse: TokenUsageEnum.FORGOT_PASSWORD;
  userId: string;
}

export interface CreateLoginTokenInput {
  userId: string;
  mobileNumber: string;
  otp: string;
}
export interface CreateSignupTokenInput {
  userId: string;
  mobileNumber: string;
  otp: string;
}

export interface RefreshUserTokenInput {
  refreshToken: string;
}

export interface VerifyUserTokenInput {
  verificationToken: string;
}

export interface VerifyUserTokenPayload {
  success: boolean;
  redirectUrl: string;
}

export type TokenPayload =
  | AccessTokenPayload
  | RefreshTokenPayload
  | UserVerificationTokenPayload
  | ForgotPasswordTokenPayload
  | UserInvitationTokenPayload;

export interface GenerateTokenInput {
  payload: TokenPayload;
  expiresInHours: number;
}

export interface ValidRefreshTokenPayload {
  isValid: true;
  user: UserSchema;
}

export interface InvalidRefreshTokenPayload {
  isValid: false;
  errorCode: ErrorCodeEnum;
}

export type ValidateRefreshTokenPayload =
  | ValidRefreshTokenPayload
  | InvalidRefreshTokenPayload;
