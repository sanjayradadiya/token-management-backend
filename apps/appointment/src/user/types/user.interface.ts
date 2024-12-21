import { StringObjectID } from '../../types/common';
import { EntityBaseSchema } from '../../types/schemas/entityBase';
import { UserSchema } from '../../types/users/user';

export type CreateUserRepositoryInputType = Omit<
  UserSchema,
  keyof Omit<EntityBaseSchema, '_id' | 'permissions'> | 'name'
>;

export type UpdateUserRepositoryInputType = Partial<
  Omit<UserSchema, 'tenantId' | 'createdById'>
>;

export type RemoveScopeGroupIdForRoleIdFromAllExcludedUsersRepositoryInput = {
  userIds: StringObjectID[];
  roleId: StringObjectID;
  scopeGroupId: StringObjectID[];
};

export interface LoginTokenPayload {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserInput {
  mobileNumberId: string;
  name: string;
  otp: string;
}

export interface RegisterUserPayload {
  success: boolean;
  loginToken: LoginTokenPayload;
}

export interface ValidateRegisterUserPayload {
  tenantId: string;
}

export type LoginUserInput = RegisterUserInput;
export type LoginUserPayload = RegisterUserPayload;

export type SwitchTenantInput = {
  tenantId: StringObjectID;
};
