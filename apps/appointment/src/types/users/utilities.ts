import { UserStatusEnum } from './user';

export declare type CurrentUserInfo = {
  id?: string;
  mobileNumber: string;
  name: string;
  status: string;
  timezone?: string;
};
export declare type TenantType = {
  id: string;
  name: string;
};
export interface UserContext {
  currentUserInfo: CurrentUserInfo;
  requestId?: string;
  requestTimestamp: string;
}
export interface UnAuthUserContext {
  currentUserInfo?: CurrentUserInfo;
  requestId?: string;
  requestTimestamp: string;
}
export declare type PartialRecord<
  K extends keyof Record<string, unknown>,
  T,
> = Partial<Record<K, T>>;
interface UserMetadata {
  name: string;
  user_id: number;
}
export interface ValidateSessionResponseType {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  mobileNumber: string;
  sub: string;
  user_id: number;
  tenant_id: number;
  tenant_code: string;
  tenant_name: string;
  site_id: number;
  is_mobileNumber_confirmation_pending: boolean;
  new_mobileNumber?: string;
  user_time_zone?: string | null;
  permissions: string[];
  role_id: string;
  role_name: string;
  user_metadata: UserMetadata;
  user_private_key: string;
  tenants?: TenantType[];
}

export {};
