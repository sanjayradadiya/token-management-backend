// import { Role } from '../../role/entities/role.entities';
import { BusinessStatusEnum } from './business';

export declare type CurrentBusinessInfo = {
  id?: string;
  name: string;
  mobileNumber: string;
  ownerName: string;
  username: string;
  business_type: string;
  workingTime: string;
  token_limit: string;
  status: BusinessStatusEnum;
  scopedRoles: string;
  timezone?: string;
};
export declare type TenantType = {
  id: string;
  name: string;
};
export interface BusinessContext {
  currentBusinessInfo: CurrentBusinessInfo;
  requestId?: string;
  requestTimestamp: string;
}
export interface UnAuthBusinessContext {
  currentBusinessInfo?: CurrentBusinessInfo;
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
  business_time_zone?: string | null;
  permissions: string[];
  role_id: string;
  role_name: string;
  business_metadata: UserMetadata;
  business_private_key: string;
  tenants?: TenantType[];
}

export {};
