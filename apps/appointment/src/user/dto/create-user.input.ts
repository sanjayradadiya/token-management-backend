import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from '../../types/users/user';

@InputType()
export class CreateUserInput {
  @ApiProperty({
    description: `User's name`,
  })
  @Field({ nullable: true })
  name: string;

  @ApiProperty({
    description: `User's Address`,
  })
  @Field({ nullable: true })
  address: string;

  @Field(() => UserStatusEnum, { nullable: true })
  status: UserStatusEnum;

  @ApiProperty({
    description: `User's Otp`,
  })
  @Field({ nullable: true })
  otp: string;

  @Field({ nullable: true })
  mobileNumber: string;

  @Field({ nullable: true })
  dob: string;

  @Field({ nullable: true })
  expiredOtp: Date;
}
