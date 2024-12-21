import { Field, InputType } from '@nestjs/graphql';
import { MemberStatusEnum } from '../types/member';

@InputType()
export class MemberFilter {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => MemberStatusEnum, { nullable: true })
  status: MemberStatusEnum;

  @Field({ nullable: true })
  is_default: boolean;

  @Field({ nullable: true })
  createdAt: Date;
}
