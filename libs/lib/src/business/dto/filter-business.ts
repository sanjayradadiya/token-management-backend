import { Field, InputType } from '@nestjs/graphql';
import { BusinessStatusEnum } from '../../types/business/business';

@InputType()
export class BusinessFilter {
  @Field({ nullable: true })
  name?: string;

  @Field(() => BusinessStatusEnum, { nullable: true })
  status?: BusinessStatusEnum;
}
