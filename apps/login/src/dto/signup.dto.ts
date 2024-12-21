import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BusinessTypeEnum } from '../types/enum';

@InputType()
export class BusinessSignupInput {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  mobileNumber: string;

  @Field({ nullable: true })
  ownerName: string;

  @IsNotEmpty()
  @Field()
  userName: string;

  @IsNotEmpty()
  @Field({ nullable: false })
  password: string;

  @Field(() => BusinessTypeEnum, {
    defaultValue: BusinessTypeEnum.HOSPITAL,
    nullable: true,
  })
  businessType: BusinessTypeEnum;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  workingTime: string;
}
