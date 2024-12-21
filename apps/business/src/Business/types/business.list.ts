import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Business } from '../entities/business.entities';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';

@ObjectType('businesses')
export class Businesses {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Business], { nullable: true })
  data: Business[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
