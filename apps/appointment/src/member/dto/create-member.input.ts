import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { MemberStatusEnum } from '../types/member';

@InputType()
export class CreateMemberInput {
  @ApiProperty({
    description: `Member Name`,
  })
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  dob: string;

  @Field(() => MemberStatusEnum, { nullable: true })
  status: MemberStatusEnum;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  is_default: boolean;
}
