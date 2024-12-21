import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuccessType {
  @Field({ nullable: false })
  success: boolean;
}
