import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';

@InputType()
export class LoginDto {
  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  password: string;
}

@ObjectType()
export class TokenPayload {
  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  refreshToken: string;
}

@ObjectType()
export class SignUpType extends MutationResponse {
  @Field(() => TokenPayload, { nullable: true })
  token: TokenPayload;
}

@InputType()
export class UserLoginDto {
  @Field({ nullable: false })
  mobileNumber: string;

  @Field({ nullable: false })
  otp: string;
}

@InputType()
export class CreateOTPDto {
  @Field({ nullable: false })
  mobileNumber: string;
}

@ObjectType()
export class UserLoginType extends MutationResponse {
  @Field({ nullable: true })
  otp: string;

  @Field(() => TokenPayload, { nullable: true })
  token: TokenPayload;
}

@ObjectType()
export class CreateOTPType extends MutationResponse {
  @Field({ nullable: true })
  otp: string;
}
