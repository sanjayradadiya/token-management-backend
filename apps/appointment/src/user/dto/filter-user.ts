import { Field, InputType } from '@nestjs/graphql';
import { UserStatusEnum } from '../../types/users/user';

@InputType()
export class UserFilter {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => UserStatusEnum, { nullable: true })
  status: UserStatusEnum;

  @Field({ nullable: true })
  isReferral: boolean;

  @Field({ nullable: true })
  createdAt: Date;
}
