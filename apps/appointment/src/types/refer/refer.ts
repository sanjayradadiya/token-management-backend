import { registerEnumType } from "@nestjs/graphql";
import { EntityBaseSchema } from "../schemas/entityBase";

export enum ReferStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}
export declare class ScopedRole {
  roleId: string;
}
export declare class ReferSchema extends EntityBaseSchema {
  permissions: any;
  createdById: string;
  updatedById: string;
}

registerEnumType(ReferStatusEnum, { name: 'ReferStatusEnum' });