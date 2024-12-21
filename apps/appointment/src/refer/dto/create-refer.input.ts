import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ReferStatusEnum } from '../../types/refer/refer';

@InputType()
export class CreateReferInput {
  @ApiProperty({
    description: `Refer`,
  })
  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  refer_by_id: string;

  @Field({ nullable: true })
  businessId: string;

  @Field(() => ReferStatusEnum, { nullable: true })
  status: ReferStatusEnum;
}
