import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../entities/member.entities';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';

@ObjectType('members')
export class Members {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Member], { nullable: true })
  data: Member[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
