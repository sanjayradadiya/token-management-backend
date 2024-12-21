import { Field, InputType } from '@nestjs/graphql';
import { ReferStatusEnum } from '../../types/refer/refer';

@InputType()
export class ReferFilter {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  userId: string;

  @Field(() => ReferStatusEnum, { nullable: true })
  status: ReferStatusEnum;
}
