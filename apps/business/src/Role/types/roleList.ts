import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../entities/role.entities';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';

@ObjectType('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Role], { nullable: true })
  data: Role[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
