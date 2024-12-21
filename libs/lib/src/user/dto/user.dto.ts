import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserLoginDto {
  @Field({ nullable: false })
  mobileNumber: string;

  @Field({ nullable: false })
  otp: string;
}
