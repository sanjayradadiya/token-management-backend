import { EntityBaseSchema } from '../schemas/entityBase';

export enum MemberStatusEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
}
export declare class ScopedRole {
  roleId: string;
}
export declare class MemberSchema extends EntityBaseSchema {
  name: string;
  dob: string;
  address: string;
  status: MemberStatusEnum;
  success?: boolean;
  reason: string;
  createdById: string;
  updatedById: string;
}
