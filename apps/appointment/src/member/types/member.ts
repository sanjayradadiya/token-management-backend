import { registerEnumType } from '@nestjs/graphql';

export enum MemberStatusEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

registerEnumType(MemberStatusEnum, { name: 'MemberStatusEnum' });
