import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { PageInfo } from 'libs/lib/src/payloads/pageInfo';
import { Appointment } from '../entities/appointment.entities';

@ObjectType('appointments')
export class Appointments {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Appointment], { nullable: true })
  data: Appointment[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
