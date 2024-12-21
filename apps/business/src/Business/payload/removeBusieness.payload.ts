import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from 'libs/lib/src/payloads/mutationResponse';

@ObjectType()
export class RemoveBusinessPayload extends MutationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
