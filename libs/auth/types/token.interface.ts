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
  userName: string | number;
}

export interface RefreshTokenPayload {
  tokenUse: TokenUsageEnum.REFRESH;
  userId: string;
}

export interface CreateLoginTokenInput {
  userId: string;
  userName: string | number;
}

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

export interface GenerateTokenInput {
  payload: TokenPayload;
  expiresInHours: number;
}
