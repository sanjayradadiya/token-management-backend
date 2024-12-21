import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatusEnum } from '../../types/appointment/appointment';

@InputType()
export class CreateAppointmentInput {
  @Field({ nullable: true })
  memberId: string;

  @Field({ nullable: true })
  businessId: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  date_and_time: string;

  @ApiProperty({
    description: `Token Number`,
  })
  @Field({ nullable: true })
  tokenNumber: number;

  @Field(() => AppointmentStatusEnum, { nullable: true })
  status: AppointmentStatusEnum;
}
