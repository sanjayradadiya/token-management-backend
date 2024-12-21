import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BusinessTypeEnum } from '../types/enum';
import { BusinessStatusEnum } from '../../types/business/business';
// import { BusinessStatusEnum } from '../../types/business/business';

@InputType()
export class CreateBusinessInput {
  @ApiProperty({
    description: `Business's name`,
  })
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: false })
  mobileNumber: string;

  @ApiProperty({
    description: `Business Owner name`,
  })
  @Field({ nullable: true })
  ownerName: string;

  @ApiProperty({
    description: `Business username`,
  })
  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  password: string;

  @Field(() => BusinessTypeEnum, {
    defaultValue: BusinessTypeEnum.HOSPITAL,
    nullable: true,
  })
  businessType: BusinessTypeEnum;

  @ApiProperty({
    description: `Business Address`,
  })
  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  workingTime: string;

  @Field({ nullable: true })
  token_limit: number;

  @ApiProperty({
    description: `role`,
    required: true,
  })
  @IsNotEmpty()
  @Field(() => [String], {
    nullable: true,
  })
  roleIds: string[];

  @Field(() => BusinessStatusEnum, { nullable: true })
  status: BusinessStatusEnum;

  @ApiProperty({
    description: `Otp`,
  })
  @Field({ nullable: true })
  otp: string;

  @Field({ nullable: true })
  expiredOtp: Date;
}
