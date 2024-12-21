import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Refer } from '../entities/refer.entities';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';

@ObjectType('refers')
export class Refers {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Refer], { nullable: true })
  data: Refer[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
