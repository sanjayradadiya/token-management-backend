import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../entities/user.entities';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';

@ObjectType('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [User], { nullable: true })
  data: User[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
